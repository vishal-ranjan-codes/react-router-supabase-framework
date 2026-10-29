/**
 * Theme Presets Registry
 *
 * Scalable multi-brand architecture:
 * Decoupled neutral canvas + 60-30-10 multi-color branding.
 *
 * Each preset defines:
 * - 60% Canvas / Neutral surfaces
 * - 30% Primary brand structure (buttons, primary links, active tabs)
 * - 10% Brand Accent (high-contrast callouts, tags, badges, secondary CTAs)
 */

export interface BrandPalette {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryForeground: string;
  primarySubtle: string;
  primaryOnSubtle: string;
  primaryDeep?: string;
  primaryDeepForeground?: string;
  secondary?: string;
  secondaryHover?: string;
  secondaryForeground?: string;
}

export interface BrandAccentPalette {
  accent: string;
  accentHover: string;
  accentActive: string;
  accentForeground: string; // onAccent
  accentSubtle: string;
  accentOnSubtle: string;
  accentBorder: string;
}

export interface SurfacePalette {
  background: string;
  card: string;
  backgroundSubtle: string;
  border: string;
  borderSubtle: string;
  foreground: string;
  foregroundMuted: string;
  foregroundSubtle: string;
}

export type ThemePresetId =
  | "tech-blue"
  | "signal"
  | "tidal"
  | "forest"
  | "terracotta"
  | "monochrome";

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  rule60_30_10: string;
  light: {
    brand: BrandPalette;
    brandAccent: BrandAccentPalette;
    surfaces?: Partial<SurfacePalette>;
  };
  dark: {
    brand: BrandPalette;
    brandAccent: BrandAccentPalette;
    surfaces?: Partial<SurfacePalette>;
  };
}

export const PRESET_TECH_BLUE: ThemePreset = {
  id: "tech-blue",
  name: "Tech Blue",
  description:
    "Enterprise SaaS starter palette: vibrant tech blue paired with warm sunset coral accent.",
  rule60_30_10:
    "60% luminous neutral canvas · 30% tech blue · 10% sunset coral accent",
  light: {
    brand: {
      primary: "#1160c9",
      primaryHover: "#0e51aa",
      primaryActive: "#0a3d7d",
      primaryForeground: "#ffffff",
      primarySubtle: "#eef6ff",
      primaryOnSubtle: "#0e51aa",
      primaryDeep: "#0a3d7d",
      primaryDeepForeground: "#ffffff",
      secondary: "#f3f3f3",
      secondaryHover: "#e9e9e9",
      secondaryForeground: "#141414",
    },
    brandAccent: {
      accent: "#d14118",
      accentHover: "#b8340f",
      accentActive: "#99280a",
      accentForeground: "#ffffff",
      accentSubtle: "#fff2ee",
      accentOnSubtle: "#942e12",
      accentBorder: "#ffccbc",
    },
    surfaces: {
      background: "#fafafa",
      card: "#ffffff",
      backgroundSubtle: "#f3f3f3",
      border: "#dedede",
      borderSubtle: "#e9e9e9",
      foreground: "#090909",
      foregroundMuted: "#5d5d5d",
      foregroundSubtle: "#5d5d5d",
    },
  },
  dark: {
    brand: {
      primary: "#1160c9",
      primaryHover: "#0e51aa",
      primaryActive: "#0a3d7d",
      primaryForeground: "#ffffff",
      primarySubtle: "#04121f",
      primaryOnSubtle: "#7cb8ff",
      primaryDeep: "#0d2c50",
      primaryDeepForeground: "#d9e9ff",
      secondary: "#292929",
      secondaryHover: "#383838",
      secondaryForeground: "#fafafa",
    },
    brandAccent: {
      accent: "#ff6f43",
      accentHover: "#ff855f",
      accentActive: "#ffa182",
      accentForeground: "#1a0803",
      accentSubtle: "#3b1308",
      accentOnSubtle: "#ffb094",
      accentBorder: "#7a2b15",
    },
    surfaces: {
      background: "#090909",
      card: "#191919",
      backgroundSubtle: "#222222",
      border: "#333333",
      borderSubtle: "#242424",
      foreground: "#fafafa",
      foregroundMuted: "#c4c4c4",
      foregroundSubtle: "#9e9e9e",
    },
  },
};

export const PRESET_SIGNAL: ThemePreset = {
  id: "signal",
  name: "Signal",
  description:
    "High-velocity developer tool identity: Precision cobalt with acid yellow energetic pulse.",
  rule60_30_10:
    "60% cool white / ink · 30% cobalt & slate · 10% acid yellow pulse",
  light: {
    brand: {
      primary: "#1649D8",
      primaryHover: "#1138AC",
      primaryActive: "#0C2980",
      primaryForeground: "#FFFFFF",
      primarySubtle: "#EEF3FF",
      primaryOnSubtle: "#1138AC",
      primaryDeep: "#0C2980",
      primaryDeepForeground: "#FFFFFF",
      secondary: "#27334B",
      secondaryHover: "#1F293D",
      secondaryForeground: "#FFFFFF",
    },
    brandAccent: {
      accent: "#DDF85B",
      accentHover: "#CCE746",
      accentActive: "#B5D132",
      accentForeground: "#172139", // AAA 13.44:1 contrast
      accentSubtle: "#F7FDDA",
      accentOnSubtle: "#3F4E07",
      accentBorder: "#D0EC4C",
    },
    surfaces: {
      background: "#F3F5FB",
      card: "#FFFFFF",
      backgroundSubtle: "#E8EDF8",
      border: "#CCD4E7",
      borderSubtle: "#E0E5F2",
      foreground: "#172139",
      foregroundMuted: "#52617B",
      foregroundSubtle: "#6E7C98",
    },
  },
  dark: {
    brand: {
      primary: "#93B4FF",
      primaryHover: "#B1C9FF",
      primaryActive: "#CEDDFF",
      primaryForeground: "#12234B",
      primarySubtle: "#0D1832",
      primaryOnSubtle: "#93B4FF",
      primaryDeep: "#12234B",
      primaryDeepForeground: "#F0F4FF",
      secondary: "#C2CDE1",
      secondaryHover: "#DDE4F2",
      secondaryForeground: "#101522",
    },
    brandAccent: {
      accent: "#DDF85B",
      accentHover: "#CCE746",
      accentActive: "#B5D132",
      accentForeground: "#172139",
      accentSubtle: "#2A320A",
      accentOnSubtle: "#DDF85B",
      accentBorder: "#536414",
    },
    surfaces: {
      background: "#101522",
      card: "#192236",
      backgroundSubtle: "#25314A",
      border: "#3D4B67",
      borderSubtle: "#2A354D",
      foreground: "#F0F4FF",
      foregroundMuted: "#B9C7E1",
      foregroundSubtle: "#8799BC",
    },
  },
};

export const PRESET_TIDAL: ThemePreset = {
  id: "tidal",
  name: "Tidal",
  description:
    "Maritime operating environment: Deep teal structure with warm brass artisanal emphasis.",
  rule60_30_10:
    "60% mineral neutrals · 30% deep maritime teal · 10% warm brass emphasis",
  light: {
    brand: {
      primary: "#006B64",
      primaryHover: "#00544F",
      primaryActive: "#003E3A",
      primaryForeground: "#FFFFFF",
      primarySubtle: "#E6F5F3",
      primaryOnSubtle: "#00544F",
      primaryDeep: "#003E3A",
      primaryDeepForeground: "#FFFFFF",
      secondary: "#193D45",
      secondaryHover: "#122E34",
      secondaryForeground: "#FFFFFF",
    },
    brandAccent: {
      accent: "#E6B85C",
      accentHover: "#D4A548",
      accentActive: "#BF9136",
      accentForeground: "#17251F", // AAA 8.61:1 contrast
      accentSubtle: "#FCF6E8",
      accentOnSubtle: "#5E430B",
      accentBorder: "#F0CE85",
    },
    surfaces: {
      background: "#F3F7F5",
      card: "#FFFFFF",
      backgroundSubtle: "#E5EFEB",
      border: "#CBD9D2",
      borderSubtle: "#DDE7E2",
      foreground: "#142C28",
      foregroundMuted: "#50655D",
      foregroundSubtle: "#647A70",
    },
  },
  dark: {
    brand: {
      primary: "#64DDD0",
      primaryHover: "#91E9DF",
      primaryActive: "#B4F1EA",
      primaryForeground: "#0C2521",
      primarySubtle: "#061B18",
      primaryOnSubtle: "#64DDD0",
      primaryDeep: "#0C2521",
      primaryDeepForeground: "#ECF5EF",
      secondary: "#B9CFD3",
      secondaryHover: "#D6E4E7",
      secondaryForeground: "#0C1917",
    },
    brandAccent: {
      accent: "#F4C76F",
      accentHover: "#E6B85C",
      accentActive: "#D4A548",
      accentForeground: "#17251F",
      accentSubtle: "#2E2108",
      accentOnSubtle: "#F4C76F",
      accentBorder: "#614917",
    },
    surfaces: {
      background: "#0C1917",
      card: "#142823",
      backgroundSubtle: "#1D362F",
      border: "#35554A",
      borderSubtle: "#243E36",
      foreground: "#ECF5EF",
      foregroundMuted: "#B5CBBE",
      foregroundSubtle: "#819F91",
    },
  },
};

export const PRESET_FOREST: ThemePreset = {
  id: "forest",
  name: "Forest",
  description:
    "Natural workshop for independent makers: Grounded forest green with soft rose accent.",
  rule60_30_10:
    "60% chalk neutrals · 30% forest green · 10% soft rose emphasis",
  light: {
    brand: {
      primary: "#365A28",
      primaryHover: "#29451E",
      primaryActive: "#1E3316",
      primaryForeground: "#FFFFFF",
      primarySubtle: "#EFF5EC",
      primaryOnSubtle: "#29451E",
      primaryDeep: "#1E3316",
      primaryDeepForeground: "#FFFFFF",
      secondary: "#4D5039",
      secondaryHover: "#3B3D2C",
      secondaryForeground: "#FFFFFF",
    },
    brandAccent: {
      accent: "#F6B0B6",
      accentHover: "#EE98A0",
      accentActive: "#DE7F88",
      accentForeground: "#27321F", // AA contrast
      accentSubtle: "#FDF2F3",
      accentOnSubtle: "#662028",
      accentBorder: "#F9CBD0",
    },
    surfaces: {
      background: "#F5F6EC",
      card: "#FFFFF8",
      backgroundSubtle: "#E9EDDA",
      border: "#D0D8BE",
      borderSubtle: "#DFE5D2",
      foreground: "#27321F",
      foregroundMuted: "#59664E",
      foregroundSubtle: "#788568",
    },
  },
  dark: {
    brand: {
      primary: "#B3D79B",
      primaryHover: "#C9E4B7",
      primaryActive: "#DDF0D0",
      primaryForeground: "#24351B",
      primarySubtle: "#121C0E",
      primaryOnSubtle: "#B3D79B",
      primaryDeep: "#24351B",
      primaryDeepForeground: "#F1F5E7",
      secondary: "#CDD0B3",
      secondaryHover: "#E2E4CF",
      secondaryForeground: "#171C13",
    },
    brandAccent: {
      accent: "#F6B0B6",
      accentHover: "#EE98A0",
      accentActive: "#DE7F88",
      accentForeground: "#27321F",
      accentSubtle: "#331519",
      accentOnSubtle: "#F6B0B6",
      accentBorder: "#662B32",
    },
    surfaces: {
      background: "#171C13",
      card: "#242D1D",
      backgroundSubtle: "#333F29",
      border: "#4F6040",
      borderSubtle: "#3A472E",
      foreground: "#F1F5E7",
      foregroundMuted: "#C0CEAD",
      foregroundSubtle: "#91A57B",
    },
  },
};

export const PRESET_TERRACOTTA: ThemePreset = {
  id: "terracotta",
  name: "Terracotta",
  description:
    "Working atelier warmth: Fired terracotta clay with parchment neutrals and ochre accent.",
  rule60_30_10:
    "60% parchment neutrals · 30% terracotta clay · 10% ochre emphasis",
  light: {
    brand: {
      primary: "#A33D26",
      primaryHover: "#85301D",
      primaryActive: "#642517",
      primaryForeground: "#FFFFFF",
      primarySubtle: "#FCEEEB",
      primaryOnSubtle: "#85301D",
      primaryDeep: "#642517",
      primaryDeepForeground: "#FFFFFF",
      secondary: "#4D3832",
      secondaryHover: "#3A2B26",
      secondaryForeground: "#FFFFFF",
    },
    brandAccent: {
      accent: "#EBC56D",
      accentHover: "#D9B255",
      accentActive: "#C29C3E",
      accentForeground: "#30241F", // AAA 9.11:1 contrast
      accentSubtle: "#FCF8EE",
      accentOnSubtle: "#543C0A",
      accentBorder: "#F3D797",
    },
    surfaces: {
      background: "#FAF5EC",
      card: "#FFFCF6",
      backgroundSubtle: "#F0E6D8",
      border: "#DFCEBC",
      borderSubtle: "#ECE1D4",
      foreground: "#30241F",
      foregroundMuted: "#6D594D",
      foregroundSubtle: "#8A7664",
    },
  },
  dark: {
    brand: {
      primary: "#FFAA8C",
      primaryHover: "#FFC0A8",
      primaryActive: "#FFD6C6",
      primaryForeground: "#3A2117",
      primarySubtle: "#23110A",
      primaryOnSubtle: "#FFAA8C",
      primaryDeep: "#3A2117",
      primaryDeepForeground: "#FCF1E2",
      secondary: "#D4C1B8",
      secondaryHover: "#E5D8D1",
      secondaryForeground: "#1D1713",
    },
    brandAccent: {
      accent: "#EBC56D",
      accentHover: "#D9B255",
      accentActive: "#C29C3E",
      accentForeground: "#30241F",
      accentSubtle: "#302107",
      accentOnSubtle: "#EBC56D",
      accentBorder: "#664912",
    },
    surfaces: {
      background: "#1D1713",
      card: "#2A211B",
      backgroundSubtle: "#3B2F26",
      border: "#5B483A",
      borderSubtle: "#443428",
      foreground: "#FCF1E2",
      foregroundMuted: "#D3BDAB",
      foregroundSubtle: "#A78D76",
    },
  },
};

export const PRESET_MONOCHROME: ThemePreset = {
  id: "monochrome",
  name: "Monochrome Editorial",
  description:
    "High-contrast editorial layout: Jet black and pure white with cool slate accent.",
  rule60_30_10:
    "60% pure white / black · 30% solid ink structure · 10% slate accent",
  light: {
    brand: {
      primary: "#090909",
      primaryHover: "#262626",
      primaryActive: "#404040",
      primaryForeground: "#ffffff",
      primarySubtle: "#f3f3f3",
      primaryOnSubtle: "#090909",
      primaryDeep: "#000000",
      primaryDeepForeground: "#ffffff",
      secondary: "#e5e5e5",
      secondaryHover: "#d4d4d4",
      secondaryForeground: "#090909",
    },
    brandAccent: {
      accent: "#475569",
      accentHover: "#334155",
      accentActive: "#1e293b",
      accentForeground: "#ffffff",
      accentSubtle: "#f1f5f9",
      accentOnSubtle: "#1e293b",
      accentBorder: "#cbd5e1",
    },
    surfaces: {
      background: "#fafafa",
      card: "#ffffff",
      backgroundSubtle: "#f3f3f3",
      border: "#dedede",
      borderSubtle: "#e9e9e9",
      foreground: "#090909",
      foregroundMuted: "#5d5d5d",
      foregroundSubtle: "#747474",
    },
  },
  dark: {
    brand: {
      primary: "#fafafa",
      primaryHover: "#e5e5e5",
      primaryActive: "#d4d4d4",
      primaryForeground: "#090909",
      primarySubtle: "#171717",
      primaryOnSubtle: "#fafafa",
      primaryDeep: "#000000",
      primaryDeepForeground: "#fafafa",
      secondary: "#262626",
      secondaryHover: "#404040",
      secondaryForeground: "#fafafa",
    },
    brandAccent: {
      accent: "#94a3b8",
      accentHover: "#cbd5e1",
      accentActive: "#e2e8f0",
      accentForeground: "#0f172a",
      accentSubtle: "#1e293b",
      accentOnSubtle: "#e2e8f0",
      accentBorder: "#334155",
    },
    surfaces: {
      background: "#000000",
      card: "#181818",
      backgroundSubtle: "#222222",
      border: "#363636",
      borderSubtle: "#262626",
      foreground: "#fafafa",
      foregroundMuted: "#a3a3a3",
      foregroundSubtle: "#737373",
    },
  },
};

export const THEME_PRESETS: readonly ThemePreset[] = [
  PRESET_TECH_BLUE,
  PRESET_SIGNAL,
  PRESET_TIDAL,
  PRESET_FOREST,
  PRESET_TERRACOTTA,
  PRESET_MONOCHROME,
];

export function getThemePreset(id: string): ThemePreset {
  if (id === "default" || id === "tech-blue") return PRESET_TECH_BLUE;
  const match = THEME_PRESETS.find((p) => p.id === id);
  return match ?? PRESET_TECH_BLUE;
}

// Backward compatibility aliases
export { PRESET_TECH_BLUE as DEFAULT_PRESET };
export { PRESET_MONOCHROME as MONOCHROME_PRESET };
