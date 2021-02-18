import React from 'react';
import { shallow } from 'enzyme';

import Board from './Board';
import BoardHeader from './BoardHeader';
import ListListing from './ListListing';

describe("Board", () => {
  let wrapper;

  describe("the board prop is falsey", () => {
    it("doesn't render", () => {
      wrapper = shallow(<Board board={null} />);

      expect(
        wrapper.html()
      ).toEqual(null);
    });
  });

  describe("a board prop is provided", () => {
    const board = {
      id: 1,
      title: "My board",
      lists: []
    };

    const lists = [{
      id: 1,
      title: "My list",
      board_id: 1
    }];

    beforeEach(() => {
      wrapper = shallow(<Board board={board} />);
    });

    it("displays the board header", () => {
      expect(
        wrapper.containsMatchingElement(<BoardHeader />)
      ).toBe(true);
    });

    it("displays the lists section", () => {
      expect(
        wrapper.containsMatchingElement(<ListListing boardId={1} />)
      ).toBe(true);
    });
  });
});
