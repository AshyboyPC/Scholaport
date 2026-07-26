import { type ReactNode, useState } from "react";

export interface ExpandCardItem<TId extends string> {
  id: TId;
  ariaLabel: string;
  className?: string;
  flipId?: string;
  content: ReactNode;
}

interface ExpandCardsProps<TId extends string> {
  items: ExpandCardItem<TId>[];
  onSelect: (id: TId) => void;
  className?: string;
  disabled?: boolean;
}

export default function ExpandCards<TId extends string>({
  items,
  onSelect,
  className = "",
  disabled = false,
}: ExpandCardsProps<TId>) {
  const [engagedId, setEngagedId] = useState<TId | null>(null);

  return (
    <div
      className={`expand-cards ${className}`.trim()}
      data-expand-cards
      data-engaged-card={engagedId ?? undefined}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          data-expand-card={item.id}
          data-flip-id={item.flipId}
          className={item.className}
          aria-label={item.ariaLabel}
          disabled={disabled}
          onMouseEnter={() => setEngagedId(item.id)}
          onMouseLeave={() => setEngagedId(null)}
          onFocus={() => setEngagedId(item.id)}
          onBlur={() => setEngagedId(null)}
          onClick={() => onSelect(item.id)}
        >
          {item.content}
        </button>
      ))}
    </div>
  );
}
