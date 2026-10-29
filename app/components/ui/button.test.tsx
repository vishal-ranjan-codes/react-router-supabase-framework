import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText("Delete");
    expect(button).toHaveClass("bg-destructive");
  });

  it("applies on-dark variant classes", () => {
    const { rerender } = render(<Button variant="white">White Primary</Button>);
    expect(screen.getByText("White Primary")).toHaveClass("bg-white", "text-neutral-950");

    rerender(<Button variant="white-secondary">White Secondary</Button>);
    expect(screen.getByText("White Secondary")).toHaveClass("bg-white/10", "text-white");

    rerender(<Button variant="white-outline">White Outline</Button>);
    expect(screen.getByText("White Outline")).toHaveClass("border-white/25", "text-white");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText("Click").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });
});
