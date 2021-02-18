import React from 'react';
import { shallow } from 'enzyme';

import BoardHeader from './BoardHeader';

describe("BoardHeader", () => {
  it("displays the board title", () => {
    const title = "My board of stuff";
    const wrapper = shallow(<BoardHeader title={title} />);

    expect(
      wrapper.html().match("My board of stuff")
    ).not.toBeNull();
  })
});
