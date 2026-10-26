import Container from "../components/ui/Container"

const SORTS = {
  "recommended": { column: "created_at",       ascending: false },
  "prep-time":   { column: "prep_time_minutes", ascending: true  },
  "a-z":         { column: "title",            ascending: true  },
};

export default function Recipes() {
    return(
        <Container>
            <h2>
                BEHOLD THESE RECIPES
            </h2>
        </Container>
    )
}