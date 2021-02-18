import React from 'react';
import { shallow } from 'enzyme';

import CardDescription from './CardDescription';

describe("CardDescription", () => {
  let wrapper;
  let showForm;

  describe("showForm prop is true", () => {
    beforeEach(() => {
      showForm = true;
    });

    it("doesn't show the edit link", () => {
      wrapper = shallow(<CardDescription edited={true} showForm={showForm} />);

      expect(
        wrapper.find("#description-edit").length
      ).toEqual(0);
    });

    it("shows the form", () => {
      wrapper = shallow(<CardDescription showForm={showForm} />);

      expect(
        wrapper.find("textarea.textarea-toggle").length
      ).toEqual(1);
    });

    describe("edited is true", () => {
      it("doesn't show the edit/discard links", () => {
        wrapper = shallow(<CardDescription edited={true} showForm={showForm} />);

        expect(
          wrapper.html()
        ).not.toContain("You have unsaved edits");
      });
    });
  });

  describe("showForm prop is false", () => {
    beforeEach(() => {
      showForm = false;
    });

    describe("edited is true", () => {
      it("shows the edit/discard links", () => {
        wrapper = shallow(<CardDescription edited={true} showForm={showForm} />);

        expect(
          wrapper.html()
        ).toContain("You have unsaved edits");
      });
    });

    describe("edited is false", () => {
      it("doesn't show the edit/discard links", () => {
        wrapper = shallow(<CardDescription edited={false} showForm={showForm} />);

        expect(
          wrapper.html()
        ).not.toContain("You have unsaved edits")
      });
    });
  });
});
