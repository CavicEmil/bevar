import HomePreview from "./HomePreview";
import BevarIntroPreview from "./BevarIntroPreview";
import EditProfilePreview from "./EditProfilePreview";
import Container from "../../components/ui/Container";

export default function MartaPlayground() {
  return (
    <main>
      <HomePreview />
      <Container>
        <details className="my-[24px] font-the-one text-white">
          <summary className="cursor-pointer py-[16px]">Earlier playground previews</summary>
          <div className="rounded-[24px] bg-rose-fantasy px-[20px]">
            <EditProfilePreview />
            <BevarIntroPreview />
          </div>
        </details>
      </Container>
    </main>
  );
}
