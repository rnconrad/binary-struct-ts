import { TestStruct, NestedStruct } from "./testStructs"
import { sizeOf } from "../src/BinaryStruct";
import crypto from "crypto";

it("calls copyFrom and data is copied correctly", () =>
{
  const srcBuffer = new ArrayBuffer(sizeOf(TestStruct));
  const srcStruct = new TestStruct(srcBuffer);
  crypto.randomFillSync(Buffer.from(srcBuffer));
  const dstStruct = new TestStruct(new ArrayBuffer(sizeOf(TestStruct)));
  dstStruct.copyFrom(srcStruct);
  expect(JSON.stringify(dstStruct))
    .toBe(JSON.stringify(srcStruct));
});

it("calls copyFrom on a nested TestStruct and data is copied correctly", () =>
{
  const srcBuffer = new ArrayBuffer(sizeOf(TestStruct));
  const srcStruct = new TestStruct(srcBuffer);
  crypto.randomFillSync(Buffer.from(srcBuffer));
  const dstStruct = new NestedStruct(new ArrayBuffer(sizeOf(NestedStruct)));
  dstStruct.data0.copyFrom(srcStruct);
  expect(JSON.stringify(dstStruct.data0))
    .toBe(JSON.stringify(srcStruct));
});