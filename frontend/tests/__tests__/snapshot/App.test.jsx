import React from "react";
import { render } from "@testing-library/react";
import App from "../../../src/App";

describe("app snapshots", () => {
  test("render app component", () => {
    const { container } = render(<App />);

    expect(container).toMatchSnapshot();
  });
});
