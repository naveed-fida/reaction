import React from 'react';
import { shallow } from 'enzyme';

import EditableTitle from './EditableTitle';

describe("EditableTitle", () => {
  describe("showInput is true", () => {
    it("displays the `title` prop as the input value", () => {
      const wrapper = shallow(
        <EditableTitle 
          title="This is my title"
          onChange={() => {}}
          onKeyPress={() => {}}
          onBlur={() => {}}
          onTitleClick={() => {}}
          showInput={true}
        />
      );

      expect(
        wrapper.containsMatchingElement(
          <input value={"This is my title"} />
        )
      ).toBe(true);
    });
  });

  describe("showInput is false", () => {
    it("displays the `title` prop value as text", () => {
      const wrapper = shallow(
        <EditableTitle 
          title="This is my title"
          onChange={() => {}}
          onKeyPress={() => {}}
          onBlur={() => {}}
          onTitleClick={() => {}}
          showInput={false}
        />
      );

      expect(
        wrapper.containsMatchingElement(
          <p>This is my title</p>
        )
      ).toBe(true);
    });
  });
});
