import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore } from '../../lib/Store.js';

import Card from './Card';

describe("Card", () => {
  let wrapper;

  describe("no card is provided", () => {
    it("renders an empty div", () => {
      wrapper = shallow(<Card card={undefined} comments={[]} />);

      expect(
        wrapper.html()
      ).toEqual('<div></div>');
    });
  });

  describe("card is provided", () => {
    it("renders a card", () => {
      const card = { id: 1, title: "My title", description: "", labels: [] };
      wrapper = shallow(
        <Provider store={createStore()}>
          <Router>
            <Card card={card} comments={[]}/>
          </Router>
        </Provider>
      );

      expect(
        wrapper.html()
      ).not.toEqual('<div></div>');
    });
  });
});
