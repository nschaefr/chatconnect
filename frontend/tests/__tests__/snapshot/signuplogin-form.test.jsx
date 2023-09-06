import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SignuploginForm from "../../../src/components/signuplogin-page/signuplogin-form";
import Chat from "../../../src/components/chat-page/chat";
import { UserContext } from "../../../src/components/utils/user-context";

const UserContextMock = ({ children }) => (
  <UserContext.Provider
    value={{
      username: "testuser",
      setLoggedInUsername: jest.fn(),
      id: "123",
      setId: jest.fn(),
    }}
  >
    {children}
  </UserContext.Provider>
);

describe("signuploginform snapshot-tests", () => {
  it("rendering signuploginform", () => {
    const { container } = render(<SignuploginForm />);

    expect(container).toMatchSnapshot();
  });

  it("rendering signupform after click on 'create an account'", () => {
    const { container } = render(<SignuploginForm />);
    fireEvent.click(screen.getByTestId("create-account"));

    expect(container).toMatchSnapshot();
  });

  it("rendering loginform after click on 'login now'", () => {
    const { container } = render(<SignuploginForm />);
    fireEvent.click(screen.getByTestId("create-account"));
    fireEvent.click(screen.getByTestId("login-now"));

    expect(container).toMatchSnapshot();
  });
});
