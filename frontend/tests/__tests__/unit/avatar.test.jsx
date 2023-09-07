import React from "react";
import { render } from "@testing-library/react";
import Avatar from "../../../src/components/chat-page/avatar";

describe("avatar rendering", () => {
  it("avatar is rendering with given data", () => {
    const username = "testuser";
    const userId = "123";

    const { getByText, getByTestId } = render(
      <Avatar username={username} userId={userId} />
    );
    const avatarDiv = getByTestId("avatar");
    expect(avatarDiv).toBeInTheDocument();

    const shortName = username[0].toUpperCase();
    const shortNameElement = getByText(shortName);
    expect(shortNameElement).toBeInTheDocument();

    const expectedBackgroundColor = "rgb(153, 207, 201)";
    expect(avatarDiv).toHaveStyle(
      `background-color: ${expectedBackgroundColor}`
    );
  });
});
