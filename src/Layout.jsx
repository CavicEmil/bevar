import { Outlet } from "react-router";
import Header from './components/Header';
import Footer from './components/Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-screen bg-pig-pink">
        <Outlet />   
      </main>
      <Footer />
    </>
  );
}