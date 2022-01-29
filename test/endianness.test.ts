import { Padded8TestStruct, Padded8TestStructBE, testStructSizes } from "./testStructs"
import { sizeOf } from "../src/BinaryStruct";

it ("calls sizeOf on Padded8TestStructBE and gets the correct size", () =>
{
  expect(sizeOf(Padded8TestStructBE)).toBe(testStructSizes.get(Padded8TestStructBE));
});

it("creates a padded LE struct, sets values, and checks for the correct underlying data", () =>
{
  const buffer = new ArrayBuffer(sizeOf(Padded8TestStruct));
  const struct = new Padded8TestStruct(buffer);

  struct.field0_16 = 0xAABB;
  struct.field1_8 = 0xCC;
  struct.field2_32 = 0xDDEEEEFF;

  const expectedArr = new Uint8Array(
  [
    ...new Array(6).fill(0x0), 0xBB, 0xAA,
    ...new Array(7).fill(0x0), 0xCC,
    ...new Array(4).fill(0x0), 0xFF, 0xEE, 0xEE, 0xDD
  ]);
  expect(new Uint8Array(buffer)).toEqual(expectedArr);
});

it("creates a padded BE struct, sets values, and checks for the correct underlying data", () =>
{
  const buffer = new ArrayBuffer(sizeOf(Padded8TestStructBE));
  const struct = new Padded8TestStructBE(buffer);

  struct.field0_16 = 0xAABB;
  struct.field1_8 = 0xCC;
  struct.field2_32 = 0xDDEEEEFF;

  const expectedArr = new Uint8Array(
  [
    0xAA, 0xBB, ...new Array(6).fill(0x0),
    0xCC, ...new Array(7).fill(0x0),
    0xDD, 0xEE, 0xEE, 0xFF, ...new Array(4).fill(0x0),
  ]);
  expect(new Uint8Array(buffer)).toEqual(expectedArr);
});

