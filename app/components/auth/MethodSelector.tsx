import type { AuthMethod } from "~/lib/auth/config";
import { getMethodLabel } from "~/lib/auth/config";

interface MethodSelectorProps {
  methods: AuthMethod[];
  activeMethod: AuthMethod;
  onChange: (method: AuthMethod) => void;
}

export function MethodSelector({ methods, activeMethod, onChange }: MethodSelectorProps) {
  if (methods.length <= 1) return null;

  return (
    <div className="flex theme-rounded overflow-hidden border theme-border-color">
      {methods.map((method) => (
        <button
          key={method}
          type="button"
          onClick={() => onChange(method)}
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            activeMethod === method
              ? "bg-primary text-white"
              : "theme-bg-color theme-fc-light hover:theme-fc-heading"
          }`}
        >
          {getMethodLabel(method)}
        </button>
      ))}
    </div>
  );
}
