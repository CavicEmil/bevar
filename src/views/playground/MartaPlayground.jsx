import Card from "../../components/ui/Card";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";
import Container from "../../components/ui/Container";
import Recipes from "../Recipes";

export default function MartaPlayground() {
  return (
    
    <main>
      <Card variant="viewbg" className="h-screen">
      <Container>
 <Login />
<SignUp />
<Recipes />
      </Container>
      </Card>
     
    </main>
    
  );
}
