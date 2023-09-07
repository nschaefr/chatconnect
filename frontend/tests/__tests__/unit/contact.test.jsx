import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Contact from "../../../src/components/chat-page/contact";

describe("contact rendering", () => {
  it("contact is rendering with given data", () => {
    const id = "user1";
    const username = "TestUser";
    const onClick = jest.fn();
    const selected = false;
    const screen = "desktop";

    const { getByText, getByTestId } = render(
      <Contact
        id={id}
        username={username}
        onClick={onClick}
        selected={selected}
        screen={screen}
      />
    );

    const contactDiv = getByTestId("contact");
    expect(contactDiv).toBeInTheDocument();

    if (screen === "desktop") {
      const usernameElement = getByText(username);
      expect(usernameElement).toBeInTheDocument();
    }

    fireEvent.click(contactDiv);
    expect(onClick).toHaveBeenCalledWith(id);
  });
});
