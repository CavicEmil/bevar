import StepGuide from "../../components/StepGuide";

export default function MagdaPlayground() {
  return (
    <main className="min-h-screen bg-rose-fantasy p-page">
      <div className="mx-auto max-w-[345px]">
        <StepGuide
          recipeId="e985ea7d-5f9c-4fb2-ac0e-99296251d701"
          mediaBucket="guides-images"
          recipeImageBucket="recipe-images"
        />
      </div>
    </main>
  );
}