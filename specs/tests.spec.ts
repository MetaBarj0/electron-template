import chai from "chai";
const should = chai.should(); // eslint-disable-line

describe("Array", function(): void {
  before(function(): void {
    // ...
  });

  describe("#indexOf()", function(): void {
    context("when not present", function(): void {
      it("should not throw an error", function(): void {
        (function(): void {
          [1, 2, 3].indexOf(4);
        }.should.not.throw());
      });
      it("should return -1", function(): void {
        [1, 2, 3].indexOf(4).should.equal(-1);
      });
    });
    context("when present", function(): void {
      it("should return the index where the element first appears in the array", function(): void {
        [1, 2, 3].indexOf(3).should.equal(2);
      });
    });
  });
});
