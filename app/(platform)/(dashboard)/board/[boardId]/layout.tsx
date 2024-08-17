import { prismaClient } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/BoardNavbar";

interface BoardIdLayoutProps {
  children: React.ReactNode;
  params: { boardId: string };
}

// generateMetadata also has access to the params object
export async function generateMetadata({ params }: BoardIdLayoutProps) {
  const { orgId } = auth();

  if (!orgId) {
    return {
      title: "Board",
    };
  }

  const board = await prismaClient.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  return {
    title: board?.title || "Board",
  };
}

// Our dynamic component automatically recieves a params object that has the boardId in it
// Its the folders name, named after the boardId
async function BoardIdLayout({ children, params }: BoardIdLayoutProps) {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const board = await prismaClient.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    // This function allows you to render the not-found.js file
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
}

export default BoardIdLayout;
