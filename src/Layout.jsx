import { Outlet } from "react-router";
import Header from './components/Header';
import Footer from './components/Footer';
import Container from './components/ui/Container';

export default function Layout() {
  return (
    <div className="h-screen">
      <Header />
      <Container>
        <main>
          <Outlet />   
        </main>
      </Container>
      <Footer />
    </div>
  );
}