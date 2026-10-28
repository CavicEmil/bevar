import {
  createBrowserRouter,
  Navigate,
  useLocation,
} from "react-router";

import { useAuth } from "./context/AuthContext";

import Layout from "./Layout";
import Landing from "./views/Landing";
import Recipes from "./views/Recipes";
import Recipe from "./views/Recipe";
import Blog from "./views/Blog";
import Article from "./views/Article";
import MyProfile from "./views/MyProfile";
import MyRecipes from "./views/MyRecipes";

import Login from "./components/Login";
import SignUp from "./components/SignUp";

import { getArticles, getArticle } from "./api/article";
import { getRecipes, getRecipe } from "./api/recipes";

/* Temporary component testing pages */
import MagdaPlayground from "./views/playground/MagdaPlayground";
import EmilPlayground from "./views/playground/EmilPlayground";
import MartaPlayground from "./views/playground/MartaPlayground";
import JosiePlayground from "./views/playground/JosiePlayground";

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading…</p>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "recipes",
        children: [
          {
            index: true,
            loader: () => getRecipes(),
            element: (
              <RequireAuth>
                <Recipes />
              </RequireAuth>
            ),
          },
          {
            path: ":id",
            loader: ({ params }) => getRecipe(params.id),
            element: <Recipe />,
          },
        ],
      },
      {
        path: "blog",
        children: [
          {
            index: true,
            loader: () => getArticles(),
            element: (
              <RequireAuth>
                <Blog />
              </RequireAuth>
            ),
            errorElement: (
              <p role="alert" className="p-page text-dark-humor">
                Could not load articles. Please reload the page.
              </p>
            ),
          },
        ],
      },
      {
        path: "articles/:slug",
        loader: async ({ params }) => {
          const [article, articles, recipes] = await Promise.all([
            getArticle(params.slug),
            getArticles(),
            getRecipes(),
          ]);

          return { article, articles, recipes };
        },
        element: <Article />,
        errorElement: (
          <p role="alert" className="p-page text-dark-humor">
            Could not load this article.
          </p>
        ),
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: (
              <RequireAuth>
                <MyProfile />
              </RequireAuth>
            ),
          },
          {
            path: "recipes",
            element: (
              <RequireAuth>
                <MyRecipes />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },

      /* Temporary component testing routes */
      {
        path: "playground/magda",
        element: <MagdaPlayground />,
      },
      {
        path: "playground/emil",
        element: <EmilPlayground />,
      },
      {
        path: "playground/marta",
        element: <MartaPlayground />,
      },
      {
        path: "playground/josie",
        element: <JosiePlayground />,
      },
    ],
  },
]);