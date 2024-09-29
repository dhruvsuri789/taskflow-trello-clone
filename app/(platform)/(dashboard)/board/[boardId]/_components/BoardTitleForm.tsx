"use client";

import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/useAction";
import { toast } from "sonner";

interface BoardTitleFormProps {
  data: Board;
}

function BoardTitleForm({ data }: BoardTitleFormProps) {
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated!`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  /* 
  - focus() sets the focus to the input field, making it active and ready for user input.
  - select() highlights the text within the input field, making it easy for the user to start typing and replace the existing content.
  */
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    execute({ id: data.id, title });
  };

  // On blur, submit the form
  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  // Return the form if it is in editing mode
  // Otherwise return the title which is a button
  if (isEditing) {
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      className="font-bold text-lg h-auto w-auto p-1 px-2"
      variant="transparent"
    >
      {title}
    </Button>
  );
}

export default BoardTitleForm;
