import { prismaClient } from "@/lib/db";
import Form from "./Form";
import Board from "./Board";

async function OrganizationIdPage() {
  const boards = await prismaClient.board.findMany();

  return (
    <div className="flex flex-col space-y-4">
      <Form />
      <div className="space-y-2">
        {boards.map((board) => (
          <Board key={board.id} title={board.title} id={board.id} />
        ))}
      </div>
    </div>
  );
}

export default OrganizationIdPage;
