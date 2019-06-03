import { assert } from "chai";

suite("Array", function(): void {
  setup(function(): void {
    // ...
  });

  suite("#indexOf()", function(): void {
    test("should return -1 when not present", function(): void {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
