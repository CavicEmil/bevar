
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useSaveNotification } from "../context/SaveNotificationContext";

const emptyState = {
  articles: [],
  loading: false,
  ready: false,
  pendingIds: new Set(),
  error: "",
};

const accounts = new Map();

function accountFor(userId) {
  if (!userId) return null;

  if (!accounts.has(userId)) {
    accounts.set(userId, {
      state: { ...emptyState, loading: true },
      listeners: new Set(),
      request: null,
    });
  }

  return accounts.get(userId);
}

function update(account, values) {
  account.state = { ...account.state, ...values };
  account.listeners.forEach((listener) => listener());
}

async function load(account, userId) {
  if (account.request || account.state.pendingIds.size) {
    return account.request;
  }

  update(account, { loading: true, error: "" });

  account.request = (async () => {
    try {
      const { data, error } = await supabase
        .from("saved_articles")
        .select("article_id, article:articles(*)")
        .eq("user_id", userId);

      if (error) throw error;

      const articles = (data ?? [])
        .map((row) => row.article)
        .filter(Boolean);

      update(account, { articles, ready: true });
    } catch (error) {
      console.error(
        "[saved_articles] Load failed:",
        error?.message ?? "Unknown error",
        error?.code ?? ""
      );

      update(account, {
        error: "Could not load your saved articles. Please try again.",
      });
    } finally {
      update(account, { loading: false });
      account.request = null;
    }
  })();

  return account.request;
}

export default function useSavedArticles() {
  const notifySave = useSaveNotification();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const account = useMemo(() => accountFor(userId), [userId]);

  const state = useSyncExternalStore(
    (listener) => {
      if (!account) return () => {};

      account.listeners.add(listener);
      return () => account.listeners.delete(listener);
    },
    () => account?.state ?? emptyState,
    () => emptyState
  );

  useEffect(() => {
    if (!account) return;

    const refresh = () => load(account, userId);

    refresh();
    window.addEventListener("focus", refresh);

    return () => window.removeEventListener("focus", refresh);
  }, [account, userId]);

  async function toggle(article) {
    if (authLoading) return;

    if (!userId) {
      navigate("/login");
      return;
    }

    if (
      !article?.id ||
      !account ||
      account.state.loading ||
      account.state.pendingIds.has(article.id)
    ) {
      return;
    }

    if (!account.state.ready) {
      await load(account, userId);
      return;
    }

    const wasSaved = account.state.articles.some(
      (item) => item.id === article.id
    );

    const pendingIds = new Set(account.state.pendingIds);
    pendingIds.add(article.id);

    update(account, { pendingIds, error: "" });

    try {
      const { error } = wasSaved
        ? await supabase
            .from("saved_articles")
            .delete()
            .eq("user_id", userId)
            .eq("article_id", article.id)
        : await supabase
            .from("saved_articles")
            .insert({ user_id: userId, article_id: article.id });

      if (error && (wasSaved || error.code !== "23505")) {
        throw error;
      }

      const articles = wasSaved
        ? account.state.articles.filter((item) => item.id !== article.id)
        : [
            article,
            ...account.state.articles.filter((item) => item.id !== article.id),
          ];

      update(account, { articles });
      notifySave?.(!wasSaved);
    } catch (error) {
      console.error(
        "[saved_articles] Update failed:",
        error?.message ?? "Unknown error",
        error?.code ?? ""
      );

      update(account, {
        error: "Could not update your saved articles. Please try again.",
      });
    } finally {
      const nextPending = new Set(account.state.pendingIds);
      nextPending.delete(article.id);
      update(account, { pendingIds: nextPending });
    }
  }

  return {
    articles: state.articles,
    isLoading: authLoading || state.loading,
    error: state.error,
    pendingIds: state.pendingIds,
    isSaved: (articleId) =>
      state.articles.some((article) => article.id === articleId),
    toggle,
    refresh: () => account && load(account, userId),
  };
}
