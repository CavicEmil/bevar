import { useLoaderData } from "react-router"; // => this handles data loading, no manual usestate, useeffect needed yay
import Container from "../components/ui/Container";

export default function Recipe() {
    const recipe = useLoaderData();
    return (
        <Container>
            <h1>{recipe.title}</h1>;
        </Container>
    )
}

/* when creating a new recipe, use router.revalidate() or useNavigate
    to refresh the view and show the newly created element to the user,
    making the user happy, the server is happy, the app is happy, everyone is happy */

    