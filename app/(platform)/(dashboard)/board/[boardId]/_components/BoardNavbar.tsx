import { Board } from "@prisma/client";
import BoardTitleForm from "./BoardTitleForm";
import BoardOptions from "./BoardOptions";

interface BoardNavbarProps {
  data: Board;
}

async function BoardNavbar({ data }: BoardNavbarProps) {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />
      <div className="ml-auto">
        <BoardOptions boardId={data.id} />
      </div>
    </div>
  );
}

export default BoardNavbar;
