import { TestStruct, NestedStruct, testStructSizes } from "./testStructs"
import { BinaryStruct, BinaryType, sizeOf } from "../src/BinaryStruct";

it("calls sizeOf on TestStruct and gets correct size", () =>
{
  expect(sizeOf(TestStruct)).toBe(testStructSizes.get(TestStruct));
});

it("calls sizeOf on NestedStruct and gets correct size", () =>
{
  expect(sizeOf(NestedStruct)).toBe(testStructSizes.get(NestedStruct));
});

it("calls sizeOf on a NestedStruct instance and gets correct size", () =>
{
  const structInstance = new NestedStruct(new ArrayBuffer(sizeOf(NestedStruct)));
  expect(sizeOf(structInstance)).toBe(sizeOf(NestedStruct));
});

it("calls sizeOf on BinaryType.Int32 and gets 4", () =>
{
  expect(sizeOf(BinaryType.Int32)).toBe(4);
});

it("calls sizeOf on an object and gets undefined", () =>
{
  expect(sizeOf({} as BinaryStruct)).toBeUndefined();
});