import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SignuploginForm from "../../../src/components/signuplogin-page/signuplogin-form";

describe("rendering error messages on loginform", () => {
  beforeEach(() => {
    render(<SignuploginForm />);
  });

  it("password-error visible when less than 8 characters", () => {
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "1234567" },
    });

    const passwordError = screen.queryByTestId("password-error");
    expect(passwordError).toBeInTheDocument();
  });

  it("password-error disappeares when more than 7 characters", () => {
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "12345678" },
    });

    const passwordError = screen.queryByTestId("password-error");
    expect(passwordError).not.toBeInTheDocument();
  });

  it("invalid-data-error visible when data invalid because of empty username", () => {
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    const invalidDataError = screen.getByTestId("invalid-data-error");
    expect(invalidDataError).toBeInTheDocument();
  });

  it("invalid-data-error visible when data invalid because of invalid username", () => {
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "invalid-name" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "testpassword" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));
  });

  it("invalid-data-error visible when data invalid because of invalid password", () => {
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "invalid-password" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));
  });
});

describe("rendering error messages on signupform", () => {
  beforeEach(() => {
    render(<SignuploginForm />);
    fireEvent.click(screen.getByTestId("create-account"));
  });

  it("password-error visible when less than 8 characters", () => {
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "1234567" },
    });

    const passwordError = screen.queryByTestId("password-error");
    expect(passwordError).toBeInTheDocument();
  });

  it("password-error disappeares when more than 7 characters", () => {
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "12345678" },
    });

    const passwordError = screen.queryByTestId("password-error");
    expect(passwordError).not.toBeInTheDocument();
  });

  it("cannot-be-empty-error visible when username empty", () => {
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "12345678" },
    });
    const passwordInput = screen.getByTestId("password-input");
    fireEvent.keyDown(passwordInput, {
      key: "Enter",
      code: "Enter",
    });

    const canNotBeEmptyError = screen.getByTestId("cannot-be-empty-error");
    expect(canNotBeEmptyError).toBeInTheDocument();
  });
});
