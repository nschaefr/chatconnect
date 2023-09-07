import React from "react";
import { render } from "@testing-library/react";
import Avatar from "../../../src/components/chat-page/avatar";

describe("avatar snapshots", () => {
  test("render avatar component", () => {
    const { container } = render(<Avatar username="testuser" userId={"123"} />);

    expect(container).toMatchSnapshot();
  });
});
