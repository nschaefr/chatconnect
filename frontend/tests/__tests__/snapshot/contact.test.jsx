import React from "react";
import { render } from "@testing-library/react";
import Contact from "../../../src/components/chat-page/contact";

describe("contact snapshots", () => {
  test("render contact component", () => {
    const { container } = render(<Contact id="123" username={"testuser"} />);

    expect(container).toMatchSnapshot();
  });
});
