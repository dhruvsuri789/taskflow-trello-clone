"use client";

import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import { useEffect, useState } from "react";
import ListItem from "./ListItem";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { updateListOrder } from "@/actions/update-list-order";
import { useAction } from "@/hooks/useAction";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

// Utility function to reorder an array using indexes
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function ListContainer({ data, boardId }: ListContainerProps) {
  // For drag and drop we need a source of truth which we will modify locally and then in the database
  // We could directly do it in the database and skip this local part, but it will have bad user experience
  // Because with drag and drop its important that we have a working optimistic mutations like when you like something.
  // Optimistic mutations : We know it will happen so we show the result before we actually mutate in the database
  // When it comes to drag and drop its a really bad experience to have to wait for a second
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered!");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered!");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Whenever data updates, we will pass in the new data.
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) {
      return;
    }
    // if Dropped in the same position, we dont have to anything
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderedData(items);
      //Trigger server action
      executeUpdateListOrder({
        items,
        boardId,
      });
    }

    // User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) return;

      // Check if cards exists on the sourcelist
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);

        //Trigger server action
        executeUpdateCardOrder({
          boardId,
          items: reorderedCards,
        });
      } else {
        // User moves the card to another list

        // Remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listld to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
        //Trigger server action
        executeUpdateCardOrder({
          boardId,
          items: destList.cards,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} data={list} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default ListContainer;
