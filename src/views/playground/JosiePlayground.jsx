import { useState } from "react";
import Onboarding from "../../components/Onboarding";
import Button from "../../components/ui/Button";

export default function JosiePlayground() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-dark-humor pb-24">
      {!result ? (
        <Onboarding
          onComplete={(preferences) =>
            setResult({
              status: "completed",
              preferences,
            })
          }
          onSkip={() =>
            setResult({
              status: "skipped",
            })
          }
        />
      ) : (
        <section
          className="
            mx-auto flex max-w-lg flex-col gap-section
            rounded-t-card bg-rose-fantasy p-page
            font-the-one text-dark-humor
          "
        >
          <h1 className="text-heading-2">
            {result.status === "completed"
              ? "Onboarding completed"
              : "Onboarding skipped"}
          </h1>

          {/* Temporary output to verify the selected values. */}
          {result.preferences && (
            <pre className="overflow-auto rounded-card bg-white p-4 text-small">
              {JSON.stringify(result.preferences, null, 2)}
            </pre>
          )}

          <Button
            content="Test again"
            onClick={() => setResult(null)}
          />
        </section>
      )}
    </div>
  );
}