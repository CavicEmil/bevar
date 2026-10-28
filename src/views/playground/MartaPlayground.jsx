import Card from "../../components/ui/Card";
import Login from "../../components/Login";
import SignUp from "../../components/SignUp";
import Container from "../../components/ui/Container";
import Recipes from "../Recipes";
import ArticleCategory from "../../components/ArticleCategory";
import BevarIntroPreview from "./BevarIntroPreview";

export default function MartaPlayground() {
  return (
    
    <main>
      <Card variant="viewbg" className="h-screen">
      <Container>
<BevarIntroPreview />
<Recipes />
<ArticleCategory />
      </Container>
      </Card>
     
    </main>
    
  );
}
