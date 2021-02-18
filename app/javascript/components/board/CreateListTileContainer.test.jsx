import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore } from '../../lib/Store';

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

import CreateListTileContainer from './CreateListTileContainer';

import apiClient from '../../lib/ApiClient';
jest.mock('../../lib/ApiClient');

import * as listActions from '../../actions/ListActions';
jest.mock('../../actions/ListActions');

describe("CreateListTileContainer", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = createStore();
    store.dispatch = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <CreateListTileContainer />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    listActions.createList.mockClear();
    store.dispatch.mockRestore();
  });

  describe("user creates a list", () => {
    beforeEach(() => {
      wrapper.simulate('click');
      const input = wrapper.find("input[type='text']").first();
      const button = wrapper.find("input[type='submit']").first();

      input.simulate('change', { target: { value: "My new list" }});
      button.simulate('click', { preventDefault: () => {} });
    });

    it("has a position", () => {
      const mockCall = listActions.createList.mock.calls[0];
      const newList = mockCall[1];

      expect(typeof newList.position).toBe("number");
    });
  });
});
