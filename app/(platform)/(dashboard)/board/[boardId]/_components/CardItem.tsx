"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import useCardModal from "@/hooks/useCardModel";

interface CardItemProps {
  data: Card;
  index: number;
}

function CardItem({ index, data }: CardItemProps) {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
}

export default CardItem;
