import * as actions from './ColorActions';
import * as types from '../constants/ActionTypes';

describe("ColorActions", () => {
  describe("TOGGLE_COLORBLIND", () => {
    it("returns the correct object", () => {
      expect(actions.toggleColorblind())
        .toEqual({ type: types.TOGGLE_COLORBLIND });
    });
  });
});
