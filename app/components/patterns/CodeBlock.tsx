import { cn } from "~/lib/utils";

type CodeBlockProps = {
  code: string;
  filename?: string;
  className?: string;
};

const PRE_CLASS =
  "overflow-x-auto bg-background-subtle p-4 font-mono text-body-sm text-foreground";

export function CodeBlock({ code, filename, className }: CodeBlockProps) {
  return (
    <div className={cn("box overflow-hidden shadow-card", className)}>
      {filename ? (
        <div className="border-b border-border px-4 py-2">
          <span className="font-mono text-body-xs text-foreground-subtle">
            {filename}
          </span>
        </div>
      ) : null}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: axe treats a scroll
          container with nothing focusable in it as a serious 2.1.1 violation,
          and a code sample has no widget to hang the focus on. */}
      <pre tabIndex={0} className={PRE_CLASS}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
