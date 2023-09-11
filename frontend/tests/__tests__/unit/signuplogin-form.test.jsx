import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import SignuploginForm from "../../../src/components/signuplogin-page/signuplogin-form";
const axios = require("axios");
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

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

  it("invalid-data-error visible when data invalid because of invalid username", async () => {
    jest.spyOn(axios, "post").mockImplementation(() => {
      return Promise.resolve({ data: { valid: false } });
    });

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "invalid-name" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "testpassword" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      const invalidDataError = screen.getByTestId("invalid-data-error");
      expect(invalidDataError).toBeInTheDocument();
    });
  });

  it("invalid-data-error visible when data invalid because of invalid password", async () => {
    jest.spyOn(axios, "post").mockImplementation(() => {
      return Promise.resolve({ data: { valid: false } });
    });

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "invalid-password" },
    });

    const passwordInput = screen.getByTestId("password-input");
    fireEvent.keyDown(passwordInput, {
      key: "Enter",
      code: "Enter",
    });

    await waitFor(() => {
      const invalidDataError = screen.getByTestId("invalid-data-error");
      expect(invalidDataError).toBeInTheDocument();
    });
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

  it("already-exists-error visible when username is already in use", async () => {
    jest.spyOn(axios, "post").mockImplementation(() => {
      return Promise.resolve({ data: { duplicate: true } });
    });

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "valid-password" },
    });

    const passwordInput = screen.getByTestId("password-input");
    fireEvent.keyDown(passwordInput, {
      key: "Enter",
      code: "Enter",
    });

    await waitFor(() => {
      const alreadyExistsError = screen.getByTestId("already-exists-error");
      expect(alreadyExistsError).toBeInTheDocument();
    });
  });
});

describe("rendering chat component after valid data", () => {
  beforeEach(() => {
    render(<SignuploginForm />);
  });

  it("successful rendering after login", async () => {
    const token = jwt.sign(
      { userId: "mock_id_123", username: "testuser" },
      "jsonWebTokenSecret",
      {}
    );
    jest.spyOn(axios, "post").mockImplementation(() => {
      return Promise.resolve({ data: { id: "mock_id_123", valid: true } });
    });

    jwt.sign.mockReturnValue(token);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "testpassword" },
    });

    const passwordInput = screen.getByTestId("password-input");
    fireEvent.keyDown(passwordInput, {
      key: "Enter",
      code: "Enter",
    });

    await waitFor(() => {
      const chatComponent = screen.getByTestId("chat-component");
      expect(chatComponent).toBeInTheDocument();
    });
  });
});
