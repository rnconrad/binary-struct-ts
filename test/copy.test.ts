import { TestStruct, NestedStruct } from "./testStructs"
import { BinaryStruct, sizeOf, copy, toJSON } from "../src/BinaryStruct";
import crypto from "crypto";

it("calls copy and data is copied correctly", () =>
{
  const srcBuffer = new ArrayBuffer(sizeOf(TestStruct));
  const srcStruct = new TestStruct(srcBuffer);
  crypto.randomFillSync(Buffer.from(srcBuffer));
  const dstStruct = new TestStruct(new ArrayBuffer(sizeOf(TestStruct)));
  copy.call(dstStruct, srcStruct);
  expect(JSON.stringify(toJSON.call(dstStruct)))
    .toBe(JSON.stringify(toJSON.call(srcStruct)));
});

it("calls copy on a nested TestStruct and data is copied correctly", () =>
{
  const srcBuffer = new ArrayBuffer(sizeOf(TestStruct));
  const srcStruct = new TestStruct(srcBuffer);
  crypto.randomFillSync(Buffer.from(srcBuffer));
  const dstStruct = new NestedStruct(new ArrayBuffer(sizeOf(NestedStruct)));
  copy.call(dstStruct.data0, srcStruct);
  expect(JSON.stringify(toJSON.call(dstStruct).data0))
    .toBe(JSON.stringify(toJSON.call(srcStruct)));
});