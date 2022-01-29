import { TestStruct, NestedStruct, testStructFields } from "./testStructs"
import { sizeOf } from "../src/BinaryStruct";

it("sets TestStruct field values and reads back the set values", () =>
{
  const struct = new TestStruct(new ArrayBuffer(sizeOf(TestStruct)));
  const fields = testStructFields.get(TestStruct);
  for (const fieldName in fields)
  {
    const mask = (1 << (fields[fieldName].size * 8)) - 1;
    const value = Math.floor(Math.random() * mask);
    struct[fieldName] = value;
    expect(struct[fieldName]).toBe(value);
  }
});

it("sets a nested TestStruct field and reads back the set values", () =>
{
  const struct = new NestedStruct(new ArrayBuffer(sizeOf(NestedStruct)));
  const fields = testStructFields.get(TestStruct);
  for (const fieldName in fields)
  {
    const mask = (1 << (fields[fieldName].size * 8)) - 1;
    const value = Math.floor(Math.random() * mask);
    struct.data0[fieldName] = value;
    expect(struct.data0[fieldName]).toBe(value);
  }
});