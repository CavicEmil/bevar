import { useState } from "react";
import Button from "../../components/ui/Button";
import Heading from "../../components/ui/Heading";
import BevarIntro from "../../components/ui/BevarIntro";

export default function BevarIntroPreview() {
  const [replay, setReplay] = useState(0);
  return (
    <section className="flex flex-col gap-[20px] py-[24px]">
      <Heading content="Bevar intro animation" level={2} variant={2} />
      <BevarIntro key={replay} />
      <div><Button content="Replay animation" onClick={() => setReplay(value => value + 1)} /></div>
    </section>
  );
}
