import { TestStruct, NestedStruct, testStructFields } from "./testStructs"
import { BinaryStruct, sizeOf, toJSON, BinaryStructConstructor } from "../src/BinaryStruct";
import crypto from "crypto";

function checkStructJsonObj(struct: BinaryStruct, jsonObj: any)
{
  const fields = testStructFields.get(struct.constructor as BinaryStructConstructor);
  for (const fieldName in fields)
  {
    const value = struct[fieldName];
    if (value instanceof BinaryStruct)
    {
      checkStructJsonObj(value, jsonObj[fieldName]);
    }
    else
    {
      expect(jsonObj[fieldName]).toBe(struct[fieldName]);
    }
  }
}

it("calls toJSON on TestStruct and gets the correct object", () =>
{
  const buffer = new ArrayBuffer(sizeOf(TestStruct));
  const struct = new TestStruct(buffer);
  crypto.randomFillSync(Buffer.from(buffer));

  checkStructJsonObj(struct, toJSON.call(struct));
});

it("calls toJSON on NestedStruct and gets the correct object", () =>
{
  const buffer = new ArrayBuffer(sizeOf(NestedStruct));
  const struct = new NestedStruct(buffer);
  crypto.randomFillSync(Buffer.from(buffer));

  checkStructJsonObj(struct, toJSON.call(struct));
});