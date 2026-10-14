import { createBrowserRouter, useNavigate, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Layout from "./Layout";
import Landing from "./views/Landing";
import Recipes from "./views/Recipes";
import Recipe from "./views/Recipe";
import Blog from "./views/Blog";
import Login from './components/Login';
import SignUp from './components/SignUp';
import { getRecipes } from "./api/recipes";
import { getRecipe } from "./api/recipes";
/* import { getArticle } from "./api/articles"; */

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <p>Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
   /*  errorElement: <ErrorBoundary />,        // automatic error handling! */
    children: [
      { index: true, element: <Landing /> },
      {
        path: "recipes",
        children: [
          { index: true, loader: () => getRecipes(), element:<RequireAuth> <Recipes /> </RequireAuth>},
          {
            path: ":id",
            loader: ({ params }) => getRecipe(params.id), element: <Recipe />  // data loads before render
            /* errorElement: <RecipeNotFound />, */
          },
        ],
      },
      {
        path: "blog",
        children: [
          { index: true, element:<RequireAuth> <Blog /> </RequireAuth>},
          {
            path: ":id",
            element: <Blog />,
            loader: ({ params }) => getArticle(params.id),  // data loads before render
            /* errorElement: <PageNotFound />, */
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
      }
    ],
  },
]);

/* We choosing to use browser router because createBrowserRouter unlocks the data APIs that the React Router team built the entire modern feature set around:
loader — load data for a route before rendering it (great fit for fetching from your Supabase api layer before a view renders)
action — handle form submissions / mutations
errorElement — per-route error boundaries, wired automatically (a thrown loader error renders it instead of crashing)
useNavigation — pending/loading state for free
useFetcher, route lazy, etc.
 */