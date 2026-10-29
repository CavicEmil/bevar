import { RouterProvider } from 'react-router';
import { ChromeProvider } from './context/ChromeContext';
import { LoadingProvider } from './context/LoadingContext';
import { SaveNotificationProvider } from './context/SaveNotificationContext';
import { router } from './router';
import './App.css';

export default function App() {
  return (
    <LoadingProvider>
      <ChromeProvider>
        <SaveNotificationProvider>
          <RouterProvider router={router} />
        </SaveNotificationProvider>
      </ChromeProvider>
    </LoadingProvider>
  );
}
