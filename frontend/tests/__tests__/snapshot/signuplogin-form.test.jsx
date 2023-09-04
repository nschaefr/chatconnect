import React from "react";
import {
  screen,
  fireEvent,
  getByTestId,
  findByTestId,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import SignuploginForm from "../../../src/components/signuplogin-page/signuplogin-form";

test("rendering signuploginform", () => {
  const component = renderer.create(<SignuploginForm />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
