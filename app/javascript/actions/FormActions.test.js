import React from 'react';

import * as actions from './FormActions';
import * as types from '../constants/ActionTypes';

describe("Form actions", () => {
  describe("showCreateBoardForm", () => {
    it("returns the correct object", () => {
      expect(
        actions.showCreateBoardForm()
      ).toEqual({ type: types.SHOW_CREATE_BOARD_FORM});
    });
  });

  describe("hideCreateBoardForm", () => {
    it("returns the correct object", () => {
      expect(
        actions.hideCreateBoardForm()
      ).toEqual({ type: types.HIDE_CREATE_BOARD_FORM});
    });
  });

  describe("updateCreateBoardFormInputText", () => {
    it("returns the correct object", () => {
      expect(
        actions.updateCreateBoardFormInputText("new text")
      ).toEqual({
        type: types.UPDATE_CREATE_BOARD_FORM_INPUT_TEXT,
        text: "new text"
      });
    });
  });

  describe("showCreateListForm", () => {
    it("returns the correct object", () => {
      expect(
        actions.showCreateListForm()
      ).toEqual({ type: types.SHOW_CREATE_LIST_FORM })
    });
  });

  describe("hideCreateListForm", () => {
    it("returns the correct object", () => {
      expect(
        actions.hideCreateListForm()
      ).toEqual({ type: types.HIDE_CREATE_LIST_FORM });
    });
  });

  describe("updateCreateListFormInputText", () => {
    it("returns the correct object", () => {
      expect(
        actions.updateCreateListFormInputText("new text")
      ).toEqual({
        type: types.UPDATE_CREATE_LIST_FORM_INPUT_TEXT,
        text: "new text"
      });
    });
  });
});
