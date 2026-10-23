import { Outlet } from "react-router";
import Header from './components/Header';
import Footer from './components/Footer';

export default function Layout() {
  return (
    <div className="h-screen">
      <Header />
      <main>
        <Outlet />   
      </main>
      <Footer />
    </div>
  );
}