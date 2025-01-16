import { formatRelativeTime } from "@/lib/utils";

export default function NameWithDate({ name, date }: { name: string; date: Date }) {
  const formatDate = formatRelativeTime(date);

  return (
    <div className="flex items-center gap-1">
      <span className="font-bold">{name}</span>
      <span className="flex items-center gap-1 text-stone-500 before:content-['•']">{formatDate}</span>
    </div>
  );
}
