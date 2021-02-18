import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from '../../lib/Store';

import ExistingLists from './ExistingLists';

describe("ExistingLists", () => {
  it("sorts lists by position", () => {
    const store = createStore({ lists: [ 
      { id: 1, title: "My first list", position: 3, board_id: 1 },
      { id: 2, title: "My second list", position: 1, board_id: 1 },
      { id: 3, title: "My third list", position: 2, board_id: 1 },
    ]});
    const wrapper = mount(
      <Provider store={store}>
        <ExistingLists boardId={1} />
      </Provider>
    );
    const titles = wrapper.find('.list-title').map(title => title.text());

    expect(titles).toEqual(["My second list", "My third list", "My first list"]);
  });
});
