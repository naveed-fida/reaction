import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from '../../lib/Store';

import ListCard from './ListCard';

describe("ListCard", () => {
  let wrapper;
  let store = createStore({
    cards: [{
      id: 1,
      title: "My card",
      description: "My description"
    }]
  });
  const card = {
    id: 1,
    title: "My card",
    labels: ["red", "green", "blue", "striped"]
  };

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <ListCard card={card} />
        </Router>
      </Provider>
    );
  });

  it("displays the card title", () => {
    expect(
      wrapper.html().match(card.title)
    ).not.toBeNull();
  });

  it("displays the card labels", () => {
    card.labels.forEach(label => {
      expect(
        wrapper.find(`.card-label.${label}`).length
      ).toEqual(1);
    });
  });
});
