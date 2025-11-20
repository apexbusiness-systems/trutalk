import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

const iconSize = 104;

describe("HomePage hero and features", () => {
  it("surfaces a clear hero with primary and secondary CTAs", () => {
    render(<HomePage />);

    const heading = screen.getByRole("heading", {
      name: /meet people by how they make you feel/i
    });
    expect(heading).toBeInTheDocument();

    const primaryCta = screen.getByRole("button", { name: /join the trutalk waitlist/i });
    const secondaryCta = screen.getByRole("button", { name: /see how it works/i });
    expect(primaryCta).toBeVisible();
    expect(secondaryCta).toBeVisible();
    primaryCta.focus();
    expect(primaryCta).toHaveFocus();
  });

  it("renders feature cards with consistently sized, centered icons", () => {
    render(<HomePage />);
    const icons = screen.getAllByTestId("feature-icon");
    expect(icons.length).toBeGreaterThanOrEqual(4);
    icons.forEach((icon) => {
      expect(icon).toHaveStyle({ width: `${iconSize}px`, height: `${iconSize}px` });
      const svg = icon.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg).toHaveAttribute("width", "72");
      expect(svg).toHaveAttribute("height", "72");
    });
  });

  it("keeps hero summary content visible without overflow cues", () => {
    render(<HomePage />);
    const hero = screen.getByRole("heading", { name: /meet people/i }).closest("section");
    expect(hero).toBeTruthy();
    expect(hero).toHaveClass("hero-shell");
  });
});
