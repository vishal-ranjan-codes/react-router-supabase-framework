import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge cannot know the contract's type scale, so without this a
// `text-h1` passed to a component would lose to the component's own text size.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "body-lg",
            "body",
            "body-sm",
            "body-xs",
            "eyebrow",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
