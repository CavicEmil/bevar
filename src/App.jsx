import { RouterProvider } from 'react-router';
import { ChromeProvider } from './context/ChromeContext';
import { SaveNotificationProvider } from './context/SaveNotificationContext';
import { router } from './router';
import './App.css';

export default function App() {
  return (
    <ChromeProvider>
      <SaveNotificationProvider>
        <RouterProvider router={router} />
      </SaveNotificationProvider>
    </ChromeProvider>
  );
}
