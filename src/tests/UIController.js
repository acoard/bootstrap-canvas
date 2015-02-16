import ImageCollection from "../models/ImageCollection";



describe("Image Collection", function () {
  it("can be called via new ImageCollection(1, 2, 3...)", function () {
    var imgCollection = new ImageCollection(1,2,3);
    console.log(imgCollection);
    expect(imgCollection == new Array(1, 2, 3)).toBe(true);
    // var product = multiply_lib.multiply(2, 3);
    // expect(product).toBe(6);
  });
});
