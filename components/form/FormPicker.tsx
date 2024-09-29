"use client";

import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import FormErrors from "./FormErrors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

/**
 * FormPicker component for selecting images from Unsplash.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID for the form picker.
 * @param {Array} props.errors - The array of form errors.
 */
function FormPicker({ id, errors }: FormPickerProps) {
  // Can only be used inside a child component of the form component
  // That form component must have an action prop handling the submition
  const { pending } = useFormStatus();

  // Set default images incase of fetching error
  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Get random images from Unsplash
        const result = await unsplash.photos.getRandom({
          // Contains a collection of images that are good for this project
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          const fetchedImages = result.response as Array<Record<string, any>>;
          setImages(fetchedImages);
        } else {
          console.log("Failed to get images from Unsplash");
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            key={image.id}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              onChange={() => setSelectedImageId(image.id)}
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}|${image.links.download_location}`}
            />
            <Image
              fill
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover rounded-sm"
            />
            {selectedImageId === image.id && (
              <div className="absolute inset-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={`${image.user.links.html}?utm_source=taskflow&utm_medium=referral`}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
}

export default FormPicker;
