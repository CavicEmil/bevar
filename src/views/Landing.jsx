import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Layout() {
  function handleSubmit(event) {
    event.preventDefault();
    alert("All fields are valid.");
  }

  return (
    <>
      <h1>I AM THE LANDING PAGE MWAHAHAHA</h1>

      {/* Temporary input and validation preview */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-section bg-rose-fantasy p-page"
      >
        <Input variant="name" />

        <Input variant="surname" />

        <Input variant="email" />

        <Input variant="password" />

        <Input variant="calculator" defaultValue={1000} />

        <Button content="Test validation" type="submit" />
      </form>

      {/* Search input preview */}
      <div className="bg-rose-fantasy p-page">
        <Input variant="search" />
      </div>
    </>
  );
}