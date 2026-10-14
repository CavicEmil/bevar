import { RouterProvider } from 'react-router';
import { router } from './router';
import './App.css';

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}