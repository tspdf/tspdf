import type { ComponentProps } from "react";

type PlaceHolderProps = ComponentProps<"div">;

export const PlaceHolder = ({ ...props }: PlaceHolderProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full border rounded" {...props} />
  )
}