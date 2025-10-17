interface TooltipProps {
  message: string;
}

export default function Tooltip({ message }: TooltipProps) {
  return (
    <div className="absolute right-0 top-full mb-2 w-max rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}
