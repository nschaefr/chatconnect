import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SignuploginForm from "../../../src/components/signuplogin-page/signuplogin-form";

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
