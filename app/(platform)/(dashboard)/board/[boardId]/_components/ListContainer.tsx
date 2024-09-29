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
// The reorder function is a useful utility for rearranging elements within an array without mutating the original array. This can be particularly useful in scenarios where immutability is important, such as in functional programming or when working with state management libraries like Redux.
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  // Creating a new array to mutate it. This creates a shallow copy of the input array list. This ensures that the original array remains unchanged, adhering to immutability principles.
  const result = Array.from(list);
  // Removing the element from the array
  // Removes one element from the result array at the startIndex position.
  // The removed element is destructured into the variable removed.
  const [removed] = result.splice(startIndex, 1);
  // Moving the element from startIndex to endIndex
  // This inserts the removed element back into the result array at the endIndex position. The 0 indicates that no elements should be removed at the endIndex position, just an insertion.
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
    // if Dropped in the same position, we dont have to do anything
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

      // Maybe?:Meaning the card was dragged and dropped at the same place in the same list
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
        // Reorder cards based on the index
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        // Update the order for each card using the new index
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
      }
      // User moves the card to another list
      else {
        // Remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        // Update the order for each card in the source list
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
        // Trigger server action
        // Maybe?: We are not updating the sourceList.cards as well because the card's listId was already changed.
        // Maybe?: When we will update the database it will reflect everywhere
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
            {/* Prevents the element from shrinking when the flex container is resized. */}
            <div className="flex-shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default ListContainer;
