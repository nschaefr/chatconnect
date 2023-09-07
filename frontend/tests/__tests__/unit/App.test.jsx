import React from "react";
import { render } from "@testing-library/react";
import App from "../../../src/App";

describe("app rendering", () => {
  test("rendering app correctly", () => {
    const { container } = render(<App />);

    expect(container).toBeTruthy();
  });
});
