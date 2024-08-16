import deleteBoard from "@/actions/deleteBoard";
import { Button } from "@/components/ui/button";

import FormSubmit from "@/components/form/FormSubmit";

interface BoardProps {
  title: string;
  id: string;
}

function Board({ title, id }: BoardProps) {
  const deleteBoardWithId = deleteBoard.bind(null, id);
  return (
    <form action={deleteBoardWithId} className="flex items-center gap-x-2">
      <p>Board title: {title}</p>
      <FormSubmit variant="destructive">Delete</FormSubmit>
    </form>
  );
}

export default Board;
