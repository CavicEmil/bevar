import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Layout() {

  return (
    <Card variant="viewbg">
      <h1>I AM THE LANDING PAGE MWAHAHAHA</h1>

      {/* Temporary input and validation preview */}
      <form
        
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
    </Card>
  );
}