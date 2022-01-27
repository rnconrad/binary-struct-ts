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

const byteOffsetMap = new WeakMap<BinaryStructConstructor, number>();
const structFieldsTypeMap = new WeakMap<BinaryStructConstructor,
  Map<string, BinaryStructConstructor>>();
const fieldNamesListMap = new WeakMap<BinaryStructConstructor, string[]>();

export function BinaryField(type: BinaryType, param?: BinaryStructConstructor | number)
{
  return function(target: BinaryStruct, propertyKey: string)
  {
    if (!(target instanceof BinaryStruct))
    {
      throw new Error("The BinaryField decorator can only be applied to members of classes derived from BinaryStruct.");
    }

    let fieldSize: number;

    if (type === BinaryType.BinaryStruct)
    {
      fieldSize = sizeOf(param as BinaryStructConstructor);
      const fieldTypeMap = structFieldsTypeMap.get(
        target.constructor as BinaryStructConstructor) ||
        new Map<string, BinaryStructConstructor>();
      fieldTypeMap.set(propertyKey, param as BinaryStructConstructor);
    }
    else
    {
      fieldSize = sizeOfBinaryType[type];
    }

    const byteOffset = byteOffsetMap.get(target.constructor as BinaryStructConstructor) | 0;

    byteOffsetMap.set(target.constructor as BinaryStructConstructor, byteOffset + fieldSize);

    const littleEndian = true;

    const fieldsList = fieldNamesListMap.get(target.constructor as BinaryStructConstructor) ||
      [];
    fieldsList.push(propertyKey);
    fieldNamesListMap.set(target.constructor as BinaryStructConstructor, fieldsList);

    let getter: () => number | bigint | BinaryStruct;
    let setter: (val: number | bigint | BinaryStruct) => void;

    switch (type)
    {
      case BinaryType.BinaryStruct:
        getter = function (this: BinaryStruct): BinaryStruct
        {
          const constructor = param as BinaryStructConstructor;
          return new constructor(this._dataView.buffer,
            this._dataView.byteOffset + byteOffset);
        };
        setter = function (this: BinaryStruct, val: BinaryStruct)
        {
          const thisArr = new Uint8Array(this._dataView.buffer,
            this._dataView.byteOffset + byteOffset, fieldSize);
          const otherArr = new Uint8Array(val._dataView.buffer,
            val._dataView.byteOffset, fieldSize);
          thisArr.set(otherArr);
        };
        break;
      case BinaryType.Int8:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getInt8(byteOffset);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setInt8(byteOffset, val);
        };
        break;
      case BinaryType.Uint8:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getUint8(byteOffset);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setUint8(byteOffset, val);
        };
        break;
      case BinaryType.Int16:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getInt16(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setInt16(byteOffset, val, littleEndian);
        };
        break;
      case BinaryType.Uint16:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getUint16(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setUint16(byteOffset, val, littleEndian);
        };
        break;
      case BinaryType.Int32:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getInt32(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setInt32(byteOffset, val, littleEndian);
        };
        break;
      case BinaryType.Uint32:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getUint32(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setUint32(byteOffset, val, littleEndian);
        };
        break;
      case BinaryType.Float32:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getFloat32(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setFloat32(byteOffset, val, littleEndian);
        };
        break;
      case BinaryType.Float64:
        getter = function (this: BinaryStruct): number
        {
          return this._dataView.getFloat64(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: number)
        {
          this._dataView.setFloat64(byteOffset, val, littleEndian);
        };
        break;
      case BinaryType.BigInt64:
        getter = function (this: BinaryStruct): bigint
        {
          return this._dataView.getBigInt64(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: bigint)
        {
          this._dataView.setBigInt64(byteOffset, val, littleEndian);
        };
        break;
      case BinaryType.BigUint64:
        getter = function (this: BinaryStruct): bigint
        {
          return this._dataView.getBigUint64(byteOffset, littleEndian);
        };
        setter = function (this: BinaryStruct, val: bigint)
        {
          this._dataView.setBigUint64(byteOffset, val, littleEndian);
        };
        break;
    }

    Object.defineProperty(target, propertyKey,
    {
      get: getter,
      set: setter
    }); 
  }
};

export class BinaryStruct
{
  protected _dataView: DataView;

  constructor(data: ArrayBuffer, offset: number = 0)
  {
    this._dataView = new DataView(data, offset);
  }
};

export function copy(this: BinaryStruct, src: BinaryStruct): void
{
  const dstArr = new Uint8Array(this._dataView.buffer,
    this._dataView.byteOffset, sizeOf(this));
  const srcArr = new Uint8Array(src._dataView.buffer,
    src._dataView.byteOffset, sizeOf(src));
  dstArr.set(srcArr);
}

export function toJSON(this: BinaryStruct): object
{
  let jsonObject = {};
  
  const fieldNames = fieldNamesListMap.get(this.constructor as BinaryStructConstructor);
  if (!fieldNames)
  {
    return jsonObject;
  }

  for (let i = 0; i < fieldNames.length; i++)
  {
    let value = this[fieldNames[i]];

    if (value instanceof BinaryStruct)
    {
      value = toJSON.call(value);
    }

    jsonObject[fieldNames[i]] = value;
  }

  return jsonObject;
}

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

  return byteOffsetMap.get(param);
}

