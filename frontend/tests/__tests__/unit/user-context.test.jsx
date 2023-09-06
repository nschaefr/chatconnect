import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Chat from "../../../src/components/chat-page/chat";
import {
  UserContext,
  ContextProvider,
} from "../../../src/components/utils/user-context";
import axios from "axios";

describe("ContextProvider", () => {
  it("should fetch user data and provide it through context", async () => {
    const mockUserData = {
      id: "mockedUserId",
      username: "mockedUsername",
    };

    jest.spyOn(axios, "get").mockResolvedValue({ data: mockUserData });

    render(
      <ContextProvider>
        <UserContext.Consumer>
          {(contextValue) => (
            <>
              <div data-testid="username">{contextValue.username}</div>
              <div data-testid="id">{contextValue.id}</div>
            </>
          )}
        </UserContext.Consumer>
      </ContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent(
        "mockedUsername"
      );
      expect(screen.getByTestId("id")).toHaveTextContent("mockedUserId");
    });
  });
});
