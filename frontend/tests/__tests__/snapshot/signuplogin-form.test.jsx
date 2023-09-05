import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SignuploginForm from "../../../src/components/signuplogin-page/signuplogin-form";

describe("SignupLoginForm Snapshot-Tests", () => {
  it("Rendering SignupLoginForm", () => {
    const { container } = render(<SignuploginForm />);

    expect(container).toMatchSnapshot();
  });

  it("Rendering SignupForm after click on 'Create an Account'", () => {
    const { container } = render(<SignuploginForm />);
    fireEvent.click(screen.getByTestId("create-account"));

    expect(container).toMatchSnapshot();
  });

  it("Rendering LoginForm after click on 'Login now'", () => {
    const { container } = render(<SignuploginForm />);
    fireEvent.click(screen.getByTestId("create-account"));
    fireEvent.click(screen.getByTestId("login-now"));

    expect(container).toMatchSnapshot();
  });
});
