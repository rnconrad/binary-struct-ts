import { Padded4TestStruct, Padded8TestStruct, testStructSizes, testStructFields } from "./testStructs"
import { sizeOf } from "../src/BinaryStruct";

it ("calls sizeOf on Padded4TestStruct and gets the correct size", () =>
{
  expect(sizeOf(Padded4TestStruct)).toBe(testStructSizes.get(Padded4TestStruct));
});

it ("calls sizeOf on Padded8TestStruct and gets the correct size", () =>
{
  expect(sizeOf(Padded8TestStruct)).toBe(testStructSizes.get(Padded8TestStruct));
});

it("creates a padded struct, sets values, and reads back the set values", () =>
{
  const struct = new Padded4TestStruct(new ArrayBuffer(sizeOf(Padded4TestStruct)));
  const fields = testStructFields.get(Padded4TestStruct);
  for (const fieldName in fields)
  {
    const mask = (1 << (fields[fieldName].size * 8)) - 1;
    const value = Math.floor(Math.random() * mask);
    struct[fieldName] = value;
    expect(struct[fieldName]).toBe(value);
  }
});

