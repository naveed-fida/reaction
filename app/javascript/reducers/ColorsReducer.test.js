import reducer from './ColorsReducer';

describe("ColorsReducer", () => {
  it("handles unknown types", () => {
    expect(
      reducer('state', { type: 'UNKNOWN_TYPE' })
    ).toEqual('state');
  });

  it("has colorblind off by default", () => {
   expect(
      reducer(undefined, { type: 'UNKNOWN_TYPE' })
    ).toEqual({ colorblind: false });
  });

  describe("TOGGLE_COLORBLIND", () => {
    it("keeps other values", () => {
      expect(
        reducer({ other: "value" }, { type: 'TOGGLE_COLORBLIND' }).other
      ).toEqual("value");
    });

    it("changes the value to true", () => {
      expect(
        reducer(undefined, { type: 'TOGGLE_COLORBLIND' })
      ).toEqual({ colorblind: true });
    });

    it("changes the value to false", () => {
      expect(
        reducer({ colorblind: true }, { type: 'TOGGLE_COLORBLIND' })
      ).toEqual({ colorblind: false });
    });
  });
});
