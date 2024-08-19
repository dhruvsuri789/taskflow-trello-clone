"use client";

import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import { useEffect, useState } from "react";
import ListItem from "./ListItem";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function ListContainer({ data, boardId }: ListContainerProps) {
  // For drag and drop we need a source of truth which we will modify locally and then in the database
  // We could directly do it in the database and skip this local part, but it will have bad user experience
  // Because with drag and drop its important that we have a working optimistic mutations like when you like something.
  // Optimistic mutations : We know it will happen so we show the result before we actually mutate in the database
  // When it comes to drag and drop its a really bad experience to have to wait for a second
  const [orderedData, setOrderedData] = useState(data);

  // Whenever data updates, we will pass in the new data.
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list, index) => (
        <ListItem key={list.id} data={list} index={index} />
      ))}
      <ListForm />
      <div className="flex-shrink-0 w-1"></div>
    </ol>
  );
}

export default ListContainer;
