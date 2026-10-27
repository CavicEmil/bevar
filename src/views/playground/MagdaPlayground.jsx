import { useState } from "react";
import Header from "../../components/Header";

export default function MagdaPlayground() {
  const [action, setAction] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-section bg-rhodophobia p-page font-the-one text-white">
      <section>
        <p className="text-small text-white/60">
          Logo
        </p>

        <Header variant="logo" />
      </section>

      <section>
        <p className="text-small text-white/60">
          Recipe — back button and title
        </p>

        <Header
          variant="title"
          title="Frozen Apple Slices"
          onBack={() => setAction("Back clicked")}
        />
      </section>

      <section>
        <p className="text-small text-white/60">
          Guide — exit button and title
        </p>

        <Header
          variant="title"
          title="Frozen Apple Slices"
          isGuide
          onBack={() => setAction("Exit clicked")}
        />
      </section>

      {action && (
        <p role="status" className="text-body">
          {action}
        </p>
      )}
    </div>
  );
}