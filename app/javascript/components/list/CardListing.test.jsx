import React from 'react';
import { shallow } from 'enzyme';

import CardListing from './CardListing';
import ListCard from './ListCard';

describe("CardListing", () => {
  let wrapper;

  it("displays no cards", () => {
    const cards = [];
    wrapper = shallow(<CardListing cards={cards} />);

    expect(
      wrapper.containsMatchingElement(
        <ListCard />
      )
    ).toEqual(false);
  });

  it("displays one card", () => {
    const cards = [{ id: 1, title: "First card", labels: [] }];

    wrapper = shallow(<CardListing cards={cards} />);

    expect(
      wrapper.containsMatchingElement(
        <ListCard card={cards[0]} />
      )
    ).toEqual(true);
  });

  it("displays more than one card", () => {
    const cards = [
      { id: 1, title: "First card", labels: [] },
      { id: 2, title: "Second card", labels: [] }
    ];

    wrapper = shallow(<CardListing cards={cards} />);

    expect(
      wrapper.containsAllMatchingElements([
        <ListCard card={cards[0]} />,
        <ListCard card={cards[1]} />
      ])
    ).toEqual(true);
  });
});
