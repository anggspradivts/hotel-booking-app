"use client";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  isLoading: boolean;
  context: string;
  handleClick?: () => Promise<void>
}
const LoadingButton = ({ context, isLoading, handleClick }: LoadingButtonProps) => {
  return (
    <button
      className="flex justify-center items-center p-2 bg-indigo-400 rounded text-white min-w-[80px]"
      type="submit"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : context}
    </button>
  );
};

export default LoadingButton;
