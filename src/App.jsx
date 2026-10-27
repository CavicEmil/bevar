import { RouterProvider } from 'react-router';
import { ChromeProvider } from './context/ChromeContext';
import { router } from './router';
import './App.css';

export default function App() {
  return (
    <ChromeProvider>
      <RouterProvider router={router} />
    </ChromeProvider>
  );
}