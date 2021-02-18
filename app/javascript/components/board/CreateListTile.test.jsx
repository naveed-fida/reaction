import React from 'react';
import { shallow } from 'enzyme';

import CreateListTile from './CreateListTile';

describe("CreateListTile", () => {
  let wrapper;

  it("displays the title in the input", () => {
    wrapper = shallow(<CreateListTile title="My title"/>)

    expect(
      wrapper.containsMatchingElement(<input type="text" value="My title" />)
    ).toEqual(true);
  });

  describe("`showForm` prop is true", () => {
    it("adds the selected class to the tile", () => {
      wrapper = shallow(<CreateListTile showForm={true} />);

      expect(
        wrapper.hasClass("selected")
      ).toEqual(true);
    });
  });

  describe("`showForm` prop is false", () => {
    it("does not add the selected class to the tile", () => {
      wrapper = shallow(<CreateListTile showForm={false} />);

      expect(
        wrapper.hasClass("selected")
      ).toEqual(false);
    })
  });
});
