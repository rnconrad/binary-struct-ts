import { BinaryFieldDescription, BinaryType, sizeOf } from "./BinaryStruct";

export interface FieldSize
{
  size: number;
  padding: number;
};

export interface PackingStrategy
{
  getFieldSize(fields: BinaryFieldDescription[], index: number): FieldSize;
};

export class PackedPackingStrategy implements PackingStrategy
{
  getFieldSize(fields: BinaryFieldDescription[], index: number): FieldSize
  {
    const type = fields[index].fieldType;

    if (type === BinaryType.BinaryStruct)
    {
      return { size: sizeOf(fields[index].structType), padding: 0 };
    }

    return { size: sizeOf(fields[index].fieldType), padding: 0 };
  }
};

export class AlignedPackingStrategy implements PackingStrategy
{
  readonly byteAlignment: number;

  constructor(byteAlignment: number)
  {
    this.byteAlignment = byteAlignment | 0;
  }

  getFieldSize(fields: BinaryFieldDescription[], index: number): FieldSize
  {
    const type = fields[index].fieldType;
    let size: number;

    if (type === BinaryType.BinaryStruct)
    {
      size = sizeOf(fields[index].structType) | 0;
    }
    else
    {
      size = sizeOf(fields[index].fieldType) | 0;
    }

    const paddedSize = (((size + this.byteAlignment - 1) / this.byteAlignment) | 0) * 
      this.byteAlignment;
    return { size: paddedSize, padding: paddedSize - size };
  }
}