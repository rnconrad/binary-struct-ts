import { BinaryStruct, BinaryField, BinaryType, BinaryStructConstructor } from "../src/BinaryStruct";

export const testStructSizes = new Map<BinaryStructConstructor, number>();
export const testStructFields = new Map<BinaryStructConstructor, any>();

export class TestStruct extends BinaryStruct
{
  @BinaryField(BinaryType.Int32)
  id: number;
  @BinaryField(BinaryType.Int32)
  parentId: number;
  @BinaryField(BinaryType.Float32)
  score: number;
  @BinaryField(BinaryType.Int32)
  timestamp: number;
  @BinaryField(BinaryType.Uint8)
  isNew: number;
  @BinaryField(BinaryType.Uint8)
  isCreated: number;
  @BinaryField(BinaryType.Uint8)
  padding0: number;
  @BinaryField(BinaryType.Uint8)
  padding1: number;
};

testStructSizes.set(TestStruct, 20);
testStructFields.set(TestStruct,
{
  id: { offset: 0, size: 4 },
  parentId: { offset: 4, size: 4 },
  score: { offset: 8, size: 4 },
  timestamp: { offset: 12, size: 4 },
  isNew: { offset: 16, size: 1 },
  isCreated: { offset: 17, size: 1 },
  padding0: { offset: 18, size: 1 },
  padding1: { offset: 19, size: 1 }
});

export class NestedStruct extends BinaryStruct
{
  @BinaryField(BinaryType.Int32)
  id: number;
  @BinaryField(BinaryType.BinaryStruct, TestStruct)
  data0: TestStruct;
  @BinaryField(BinaryType.BinaryStruct, TestStruct)
  data1: TestStruct;
};

testStructSizes.set(NestedStruct, 2 * testStructSizes.get(TestStruct) + 4);
testStructFields.set(NestedStruct,
{
  id: { offset: 0, size: 4 },
  data0: { offset: 4, size: testStructSizes.get(TestStruct) },
  data1: { offset: 4 + testStructSizes.get(TestStruct), size: testStructSizes.get(TestStruct) }
});
