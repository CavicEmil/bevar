import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyState = { recipes: [], loading: false, ready: false, pendingIds: new Set(), error: "" };
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
  account.listeners.forEach(listener => listener());
}

async function load(account, userId) {
  if (account.request || account.state.pendingIds.size) return account.request;
  update(account, { loading: true, error: "" });
  account.request = (async () => {
    try {
      const { data, error } = await supabase
        .from("saved_recipes")
        .select("recipe_id, recipe:recipes(*, difficulty(*), category(*), method(*))")
        .eq("user_id", userId);
      if (error) throw error;
      const recipes = (data ?? []).map(row => row.recipe).filter(Boolean);
      update(account, { recipes, ready: true });
    } catch (error) {
      console.error("[saved_recipes] Load failed:", error?.message ?? "Unknown error", error?.code ?? "");
      update(account, { error: "Could not load your saved recipes. Please try again." });
    } finally {
      update(account, { loading: false });
      account.request = null;
    }
  })();
  return account.request;
}

export default function useSavedRecipes() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const account = useMemo(() => accountFor(userId), [userId]);
  const state = useSyncExternalStore(
    listener => {
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

  async function toggle(recipe) {
    if (authLoading) return;
    if (!userId) {
      navigate("/login");
      return;
    }
    if (!recipe?.id || !account || account.state.loading || account.state.pendingIds.has(recipe.id)) return;
    // Do not toggle an unknown status after a failed initial read.
    if (!account.state.ready) {
      await load(account, userId);
      return;
    }

    const wasSaved = account.state.recipes.some(item => item.id === recipe.id);
    const pendingIds = new Set(account.state.pendingIds).add(recipe.id);
    update(account, { pendingIds, error: "" });
    try {
      const { error } = wasSaved
        ? await supabase.from("saved_recipes").delete().eq("user_id", userId).eq("recipe_id", recipe.id)
        : await supabase.from("saved_recipes").insert({ user_id: userId, recipe_id: recipe.id });
      if (error && (wasSaved || error.code !== "23505")) throw error;
      const recipes = wasSaved
        ? account.state.recipes.filter(item => item.id !== recipe.id)
        : [recipe, ...account.state.recipes.filter(item => item.id !== recipe.id)];
      update(account, { recipes });
    } catch (error) {
      console.error("[saved_recipes] Update failed:", error?.message ?? "Unknown error", error?.code ?? "");
      update(account, { error: "Could not update your saved recipes. Please try again." });
    } finally {
      const nextPending = new Set(account.state.pendingIds);
      nextPending.delete(recipe.id);
      update(account, { pendingIds: nextPending });
    }
  }

  return {
    recipes: state.recipes,
    isLoading: authLoading || state.loading,
    error: state.error,
    pendingIds: state.pendingIds,
    isSaved: recipeId => state.recipes.some(recipe => recipe.id === recipeId),
    toggle,
    refresh: () => account && load(account, userId),
  };
}
