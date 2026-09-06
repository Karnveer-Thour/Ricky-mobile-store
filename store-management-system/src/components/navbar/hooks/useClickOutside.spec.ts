import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClickOutside } from "./useClickOutside";

describe("useClickOutside Hook", () => {
  it("should trigger handler when click occurs outside target element", () => {
    const handler = vi.fn();
    const element = document.createElement("div");
    document.body.appendChild(element);
    const outsideElement = document.createElement("button");
    document.body.appendChild(outsideElement);

    const ref = { current: element };
    renderHook(() => useClickOutside(ref, handler, true));

    outsideElement.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(element);
    document.body.removeChild(outsideElement);
  });

  it("should not trigger handler when click occurs inside target element", () => {
    const handler = vi.fn();
    const element = document.createElement("div");
    document.body.appendChild(element);

    const ref = { current: element };
    renderHook(() => useClickOutside(ref, handler, true));

    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
  });

  it("should not trigger handler when active is false", () => {
    const handler = vi.fn();
    const element = document.createElement("div");
    document.body.appendChild(element);
    const outsideElement = document.createElement("button");
    document.body.appendChild(outsideElement);

    const ref = { current: element };
    renderHook(() => useClickOutside(ref, handler, false));

    outsideElement.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(element);
    document.body.removeChild(outsideElement);
  });
});
