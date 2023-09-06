import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Chat from "../../../src/components/chat-page/chat";
import { UserContext } from "../../../src/components/utils/user-context";

const UserContextMock = ({ children }) => (
  <UserContext.Provider
    value={{
      username: "mockuser",
      setLoggedInUsername: jest.fn(),
      id: "123",
      setId: jest.fn(),
    }}
  >
    {children}
  </UserContext.Provider>
);

describe("chat snapshot-tests", () => {
  it("rendering chat", () => {
    const { container } = render(
      <UserContextMock>
        <Chat />
      </UserContextMock>
    );

    expect(container).toMatchSnapshot();
  });
});
