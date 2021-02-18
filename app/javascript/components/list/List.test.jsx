import React from 'react';
import { shallow } from 'enzyme';

import List from './List';
import CardListing from './CardListing';
import NewCardForm from './NewCardForm';

describe("List", () => {
  let wrapper;
  const list = {
    id: 1,
    title: "My list",
  };
  const cards = [];

  it("displays the list title", () => {
    wrapper = shallow(
      <List 
        list={list} 
        onDrop={() => {}}
        onAddCardClick={() => {}}
        onNewCardFormChange = {() => {}}
        onNewCardFormSubmit = {() => {}}
        addCardActive={false}
        cards={[]}
      />
    );

    expect(
      wrapper.html().match(/My list/)
    ).not.toBeNull();
  });

  it("displays a CardListing", () => {
    wrapper = shallow(
      <List 
        list={list} 
        onDrop={() => {}}
        onAddCardClick={() => {}}
        onNewCardFormChange ={() => {}}
        onNewCardFormSubmit = {() => {}}
        addCardActive={false}
        cards={cards}
      />
    );

    expect(
      wrapper.containsMatchingElement(
        <CardListing cards={cards} />
      )
    ).toEqual(true);
  });

  describe("addCardActive prop is false", () => {
    beforeEach(() => {
      wrapper = shallow(
        <List 
          list={list} 
          onDrop={() => {}}
          onAddCardClick={() => {}}
          onNewCardFormChange={() => {}}
          onNewCardFormSubmit={() => {}}
          newCardFormText={''}
          addCardActive={false}
        />
      );
    });

    it("doesn't render a NewCardForm", () => {
      expect(
        wrapper.find(NewCardForm).length
      ).toEqual(0);
    });
  });

  describe("addCardActive prop is true", () => {
    beforeEach(() => {
      wrapper = shallow(
        <List 
          list={list} 
          onDrop={() => {}}
          onAddCardClick={() => {}}
          onNewCardFormChange={() => {}}
          onNewCardFormSubmit={() => {}}
          newCardFormText={''}
          addCardActive={true}
        />
      );
    });

    it("renders a NewCardForm", () => {
      expect(
        wrapper.find(NewCardForm).length
      ).toEqual(1);
    })
  });
});
