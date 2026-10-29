import type { AuthMethod } from "~/lib/auth/config";
import { getMethodLabel } from "~/lib/auth/config";

interface MethodSelectorProps {
  methods: AuthMethod[];
  activeMethod: AuthMethod;
  onChange: (method: AuthMethod) => void;
}

export function MethodSelector({
  methods,
  activeMethod,
  onChange,
}: MethodSelectorProps) {
  if (methods.length <= 1) return null;

  const count = methods.length;
  // Equal-width segments (1fr) let the thumb track its slot by index alone,
  // so any number of methods or label lengths stays aligned.
  const activeIndex = Math.max(0, methods.indexOf(activeMethod));

  return (
    <div className="flex justify-center">
      {/* biome-ignore lint/a11y/useSemanticElements: a segmented pill control is
          the same shape Radix ToggleGroup renders as div[role=group]; a fieldset
          would add form semantics this control does not have. */}
      <div
        role="group"
        aria-label="Authentication method"
        className="relative inline-grid rounded-full bg-muted p-1"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 rounded-full bg-card shadow-sm transition-transform duration-300 ease-out dark:bg-white/25"
          style={{
            width: `calc((100% - 0.5rem) / ${count})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
        {methods.map((method) => {
          const active = activeMethod === method;
          return (
            <button
              key={method}
              type="button"
              onClick={() => onChange(method)}
              aria-pressed={active}
              className={`relative z-10 cursor-pointer rounded-full px-4 py-1 text-sm font-medium outline-none transition-colors focus-visible:ring-ring focus-visible:ring-[3px] ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {getMethodLabel(method)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
