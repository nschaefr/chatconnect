import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import Chat from "../../../src/components/chat-page/chat";
import { UserContext } from "../../../src/components/utils/user-context";

describe("chat function tests", () => {
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

  it("handleresize is working when changing zu mobilesize and back", () => {
    render(
      <UserContextMock>
        <Chat />
      </UserContextMock>
    );

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
    });

    const isMobile = screen.queryByTestId("mobile-view");
    expect(isMobile).toBeInTheDocument();

    act(() => {
      window.innerWidth = 800;
      window.dispatchEvent(new Event("resize"));
    });

    expect(isMobile).not.toBeInTheDocument();
  });
});
