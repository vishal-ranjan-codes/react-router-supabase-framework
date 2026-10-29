import { describe, expect, it } from "vitest";
import { PRIMARY_NAV_CONFIG } from "./navigation";

describe("PRIMARY_NAV_CONFIG", () => {
  it("contains at least one mega-menu, grouped-dropdown, simple-dropdown, and flat link", () => {
    const types = PRIMARY_NAV_CONFIG.map((item) => item.type);
    expect(types).toContain("mega-menu");
    expect(types).toContain("grouped-dropdown");
    expect(types).toContain("simple-dropdown");
    expect(types).toContain("link");
  });

  it("ensures every navigation item has a valid label", () => {
    for (const item of PRIMARY_NAV_CONFIG) {
      expect(item.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("validates mega-menu structure and featured spotlight card", () => {
    const mega = PRIMARY_NAV_CONFIG.find((item) => item.type === "mega-menu");
    expect(mega).toBeDefined();
    if (mega?.type === "mega-menu") {
      expect(mega.featured.title.length).toBeGreaterThan(0);
      expect(mega.featured.to.length).toBeGreaterThan(0);
      expect(mega.groups.length).toBeGreaterThanOrEqual(1);

      for (const group of mega.groups) {
        expect(group.title.length).toBeGreaterThan(0);
        expect(group.items.length).toBeGreaterThan(0);
        for (const subItem of group.items) {
          expect(subItem.label.length).toBeGreaterThan(0);
          expect(subItem.to.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("validates grouped dropdown structure", () => {
    const grouped = PRIMARY_NAV_CONFIG.find(
      (item) => item.type === "grouped-dropdown",
    );
    expect(grouped).toBeDefined();
    if (grouped?.type === "grouped-dropdown") {
      expect(grouped.groups.length).toBeGreaterThanOrEqual(1);
      for (const group of grouped.groups) {
        expect(group.title.length).toBeGreaterThan(0);
        for (const subItem of group.items) {
          expect(subItem.label.length).toBeGreaterThan(0);
          expect(subItem.to.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("validates simple dropdown structure", () => {
    const simple = PRIMARY_NAV_CONFIG.find(
      (item) => item.type === "simple-dropdown",
    );
    expect(simple).toBeDefined();
    if (simple?.type === "simple-dropdown") {
      expect(simple.items.length).toBeGreaterThanOrEqual(1);
      for (const subItem of simple.items) {
        expect(subItem.label.length).toBeGreaterThan(0);
        expect(subItem.to.length).toBeGreaterThan(0);
      }
    }
  });
});
