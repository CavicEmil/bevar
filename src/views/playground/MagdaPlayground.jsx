import Tip from "../../components/ui/Tip";

export default function MagdaPlayground() {
  return (
    <main className="min-h-screen bg-rose-fantasy p-page">
      <div className="mx-auto flex max-w-[345px] flex-col gap-section">
        <Tip variant={1}>
          Spread the fruit in a single layer before freezing.
        </Tip>

        <Tip
          variant={2}
          items={[
            {
              id: "freezing",
              icon: "freezing",
              title: "Keep frozen",
              text: "Store in the freezer until ready to use.",
            },
            {
              id: "packing",
              icon: "packing",
              title: "Pack it well",
              text: "Use an airtight container or freezer bag.",
            },
            {
              id: "label",
              icon: "label",
              title: "Add a label",
              text: "Write the recipe name and preparation date.",
            },
          ]}
        />

        <Tip variant={3}>
          A little preparation today means less fruit wasted tomorrow.
        </Tip>
      </div>
    </main>
  );
}