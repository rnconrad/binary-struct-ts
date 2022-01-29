import { BinaryStruct, binaryField, BinaryType, BinaryStructConstructor, binaryStruct, Endianness } from "../src/BinaryStruct";
import { AlignedPackingStrategy } from "../src/PackingStrategy";

export const testStructSizes = new Map<BinaryStructConstructor, number>();
export const testStructFields = new Map<BinaryStructConstructor, any>();

@binaryStruct()
export class TestStruct extends BinaryStruct
{
  @binaryField(BinaryType.Int32)
  id: number;
  @binaryField(BinaryType.Int32)
  parentId: number;
  @binaryField(BinaryType.Float32)
  score: number;
  @binaryField(BinaryType.Int32)
  timestamp: number;
  @binaryField(BinaryType.Uint8)
  isNew: number;
  @binaryField(BinaryType.Uint8)
  isCreated: number;
  @binaryField(BinaryType.Uint8)
  padding0: number;
  @binaryField(BinaryType.Uint8)
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

@binaryStruct()
export class NestedStruct extends BinaryStruct
{
  @binaryField(BinaryType.Int32)
  id: number;
  @binaryField(BinaryType.BinaryStruct, TestStruct)
  data0: TestStruct;
  @binaryField(BinaryType.BinaryStruct, TestStruct)
  data1: TestStruct;
};

testStructSizes.set(NestedStruct, 2 * testStructSizes.get(TestStruct) + 4);
testStructFields.set(NestedStruct,
{
  id: { offset: 0, size: 4 },
  data0: { offset: 4, size: testStructSizes.get(TestStruct) },
  data1: { offset: 4 + testStructSizes.get(TestStruct), size: testStructSizes.get(TestStruct) }
});


@binaryStruct({ packingStrategy: new AlignedPackingStrategy(4) })
export class Padded4TestStruct extends BinaryStruct
{
  @binaryField(BinaryType.Int32)
  id: number;
  @binaryField(BinaryType.Uint8)
  isNew: number;
  @binaryField(BinaryType.Float32)
  score: number;
  @binaryField(BinaryType.Float64)
  time: number;
  @binaryField(BinaryType.Uint16)
  flags: number;
  @binaryField(BinaryType.Uint8)
  isCreated: number;
  @binaryField(BinaryType.Int32)
  timestamp: number;
};

testStructSizes.set(Padded4TestStruct, 32);
testStructFields.set(Padded4TestStruct,
{
  id: { offset: 0, size: 4, padding: 0 },
  isNew: { offset: 4, size: 1, padding: 3 },
  score: { offset: 8, size: 4, padding: 0 },
  time: { offset: 12, size: 8, padding: 0 },
  flags: { offset: 20, size: 2, padding: 2 },
  isCreated: { offset: 24, size: 1, padding: 3 },
  timestamp: { offset: 28, size: 4, padding: 0 }
});

@binaryStruct({ packingStrategy: new AlignedPackingStrategy(8) })
export class Padded8TestStruct extends BinaryStruct
{
  @binaryField(BinaryType.Int16)
  field0_16: number;
  @binaryField(BinaryType.Uint8)
  field1_8: number;
  @binaryField(BinaryType.Uint32)
  field2_32: number;
};

testStructSizes.set(Padded8TestStruct, 24);
testStructFields.set(Padded8TestStruct,
{
  field0_16: { offset: 0, size: 2, padding: 6 },
  field1_8: { offset: 0, size: 1, padding: 7 },
  field2_32: { offset: 8, size: 4, padding: 4 }
});

@binaryStruct({ endianness: Endianness.BigEndian,
  packingStrategy: new AlignedPackingStrategy(8) })
export class Padded8TestStructBE extends BinaryStruct
{
  @binaryField(BinaryType.Int16)
  field0_16: number;
  @binaryField(BinaryType.Uint8)
  field1_8: number;
  @binaryField(BinaryType.Uint32)
  field2_32: number;
};

testStructSizes.set(Padded8TestStructBE, 24);
testStructFields.set(Padded8TestStructBE,
{
  field0_16: { offset: 0, size: 2, padding: 6 },
  field1_8: { offset: 0, size: 1, padding: 7 },
  field2_32: { offset: 8, size: 4, padding: 4 }
});
