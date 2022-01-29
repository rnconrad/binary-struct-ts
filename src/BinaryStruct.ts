import { FieldSize, PackedPackingStrategy, PackingStrategy } from "./PackingStrategy";

export enum Endianness
{
  LittleEndian,
  BigEndian
};

export interface BinaryFieldDescription
{
  fieldName: string;
  fieldType: BinaryType;
  structType?: BinaryStructConstructor;
};

export interface BinaryStructDefinitionOptions
{
  endianness?: Endianness;
  packingStrategy?: PackingStrategy;
};

export type BinaryStructConstructor =
{
  new (data: ArrayBuffer, offset?: number): BinaryStruct
};

export enum BinaryType
{
  BinaryStruct,
  Int8,
  Uint8,
  Int16,
  Uint16,
  Int32,
  Uint32,
  Float32,
  Float64,
  BigInt64,
  BigUint64
};

const sizeOfBinaryType = {};
sizeOfBinaryType[BinaryType.Int8] = 1;
sizeOfBinaryType[BinaryType.Uint8] = 1;
sizeOfBinaryType[BinaryType.Int16] = 2;
sizeOfBinaryType[BinaryType.Uint16] = 2;
sizeOfBinaryType[BinaryType.Int32] = 4;
sizeOfBinaryType[BinaryType.Uint32] = 4;
sizeOfBinaryType[BinaryType.Float32] = 4;
sizeOfBinaryType[BinaryType.Float64] = 8;
sizeOfBinaryType[BinaryType.BigInt64] = 8;
sizeOfBinaryType[BinaryType.BigUint64] = 8;

const structSizeMap = new WeakMap<BinaryStructConstructor, number>();
const fieldListMap = new WeakMap<BinaryStructConstructor, BinaryFieldDescription[]>();

export function binaryStruct(options: BinaryStructDefinitionOptions = {})
{
  return function<T extends BinaryStructConstructor>(constructor: T)
  {
    const fieldList = fieldListMap.get(constructor) || [];
    fieldListMap.delete(constructor);

    const jsonObjectShape = {}
    for (let i = 0; i < fieldList.length; i++)
    {
      jsonObjectShape[fieldList[i].fieldName] = null;
    }
    Object.defineProperty(constructor.prototype, "toJSON",
    {
      value: function (this: BinaryStruct)
      {
        const obj = Object.assign({}, jsonObjectShape);
        for (let i = 0; i < fieldList.length; i++)
        {
          obj[fieldList[i].fieldName] = this[fieldList[i].fieldName];
        }
        return obj;
      }
    });

    Object.defineProperty(constructor.prototype, "copyFrom",
    {
      value: function (this: BinaryStruct, src: BinaryStruct)
      {
        const dstArr = new Uint8Array(this._dataView.buffer,
          this._dataView.byteOffset, sizeOf(this));
        const srcArr = new Uint8Array(src._dataView.buffer,
          src._dataView.byteOffset, sizeOf(src));
        dstArr.set(srcArr);
      }
    });

    let structOffset = 0;
    const littleEndian = (options.endianness !== Endianness.BigEndian);
    const packingStrategy = options.packingStrategy || new PackedPackingStrategy();

    for (let i = 0; i < fieldList.length; i++)
    {
      const fieldDescription = fieldList[i];
      const fieldSize: FieldSize = packingStrategy.getFieldSize(fieldList, i);
      const fieldOffset = (littleEndian)
        ? fieldSize.padding + structOffset : structOffset;
      const fieldTotalSize = fieldSize.size;

      structOffset += fieldTotalSize;

      let getter: () => number | bigint | BinaryStruct;
      let setter: (val: number | bigint | BinaryStruct) => void;

      switch (fieldDescription.fieldType)
      {
        case BinaryType.BinaryStruct:
          getter = function (this: BinaryStruct): BinaryStruct
          {
            const constructor = fieldDescription.structType as BinaryStructConstructor;
            return new constructor(this._dataView.buffer,
              this._dataView.byteOffset + fieldOffset);
          };
          setter = function (this: BinaryStruct, val: BinaryStruct)
          {
            const thisArr = new Uint8Array(this._dataView.buffer,
              this._dataView.byteOffset + fieldOffset, fieldTotalSize);
            const otherArr = new Uint8Array(val._dataView.buffer,
              val._dataView.byteOffset, fieldTotalSize);
            thisArr.set(otherArr);
          };
          break;
        case BinaryType.Int8:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getInt8(fieldOffset);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setInt8(fieldOffset, val);
          };
          break;
        case BinaryType.Uint8:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getUint8(fieldOffset);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setUint8(fieldOffset, val);
          };
          break;
        case BinaryType.Int16:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getInt16(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setInt16(fieldOffset, val, littleEndian);
          };
          break;
        case BinaryType.Uint16:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getUint16(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setUint16(fieldOffset, val, littleEndian);
          };
          break;
        case BinaryType.Int32:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getInt32(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setInt32(fieldOffset, val, littleEndian);
          };
          break;
        case BinaryType.Uint32:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getUint32(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setUint32(fieldOffset, val, littleEndian);
          };
          break;
        case BinaryType.Float32:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getFloat32(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setFloat32(fieldOffset, val, littleEndian);
          };
          break;
        case BinaryType.Float64:
          getter = function (this: BinaryStruct): number
          {
            return this._dataView.getFloat64(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: number)
          {
            this._dataView.setFloat64(fieldOffset, val, littleEndian);
          };
          break;
        case BinaryType.BigInt64:
          getter = function (this: BinaryStruct): bigint
          {
            return this._dataView.getBigInt64(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: bigint)
          {
            this._dataView.setBigInt64(fieldOffset, val, littleEndian);
          };
          break;
        case BinaryType.BigUint64:
          getter = function (this: BinaryStruct): bigint
          {
            return this._dataView.getBigUint64(fieldOffset, littleEndian);
          };
          setter = function (this: BinaryStruct, val: bigint)
          {
            this._dataView.setBigUint64(fieldOffset, val, littleEndian);
          };
          break;
      }

      Object.defineProperty(constructor.prototype, fieldDescription.fieldName,
      {
        get: getter,
        set: setter
      });
    }

    Object.seal(constructor);
    Object.seal(constructor.prototype);

    structSizeMap.set(constructor, structOffset);
  }
};

export function binaryField(type: BinaryType, param?: BinaryStructConstructor)
{
  return function(target: BinaryStruct, propertyKey: string)
  {
    const description: BinaryFieldDescription =
    {
      fieldName: propertyKey,
      fieldType: type,
      structType: param
    };

    let fieldList = fieldListMap.get(
      target.constructor as BinaryStructConstructor);
    if (!fieldList)
    {
      fieldList = [];
      fieldListMap.set(target.constructor as BinaryStructConstructor, fieldList);
    }

    fieldList.push(description);
  }
};

export class BinaryStruct
{
  protected _dataView: DataView;

  constructor(data: ArrayBuffer, offset: number = 0)
  {
    this._dataView = new DataView(data, offset);
  }

  toJSON(): any {};
  copyFrom(src: BinaryStruct): void {};

  asDataView(): DataView
  {
    return this._dataView;
  }
};

export function sizeOf(param: BinaryStruct | BinaryStructConstructor | BinaryType): number
{
  if (typeof param === "number")
  {
    return sizeOfBinaryType[param];
  }

  if (param instanceof BinaryStruct)
  {
    param = param.constructor as BinaryStructConstructor;
  }

  return structSizeMap.get(param);
}