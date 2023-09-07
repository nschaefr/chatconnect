import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ChatPage from "../../../src/pages/chat-page/chat-page";
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

describe("chat snapshots", () => {
  it("rendering chat", () => {
    const { container } = render(
      <UserContextMock>
        <ChatPage />
      </UserContextMock>
    );

    expect(container).toMatchSnapshot();
  });
});
