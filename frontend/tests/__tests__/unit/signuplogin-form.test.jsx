import React from "react";
import { render } from "@testing-library/react";
import SignuploginForm from "../../../src/components/signuplogin-page/signuplogin-form";

test("Form component renders correctly", () => {
  const { getByText, getByPlaceholderText } = render(<SignuploginForm />);

  const header = getByText("chatconnect");
  const slogan = getByText("Sign In");
  const usernameInput = getByPlaceholderText("Username");
  const passwordInput = getByPlaceholderText("Password");

  expect(header).toBeInTheDocument();
  expect(slogan).toBeInTheDocument();
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});
