"use client";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  isLoading: boolean;
  context: string;
  handleClick?: () => Promise<void>
}
const LoadingButton = ({ context, isLoading, handleClick }: LoadingButtonProps) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center p-2 min-w-[80px]",
        "bg-indigo-400 rounded text-white",
        "hover:bg-indigo-500"
      )}
      type="submit"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : context}
    </button>
  );
};

export default LoadingButton;
