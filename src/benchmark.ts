import { binaryField, BinaryStruct, binaryStruct, BinaryType, sizeOf } from "./BinaryStruct";
import fs from "fs";

@binaryStruct()
class TestStruct extends BinaryStruct
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

class manualStruct
{
  dataView: DataView;

  constructor(data: ArrayBuffer, offset: number)
  {
    this.dataView = new DataView(data, offset);
  }

  get id()
  {
    return this.dataView.getInt32(0, true);
  }
  set id(val)
  {
    this.dataView.setInt32(0, val, true);
  }

  get parentId()
  {
    return this.dataView.getInt32(4, true);
  }
  set parentId(val)
  {
    this.dataView.setInt32(4, val, true);
  }

  get score()
  {
    return this.dataView.getFloat32(8, true);
  }
  set score(val)
  {
    this.dataView.setFloat32(8, val, true);
  }

  get timestamp()
  {
    return this.dataView.getInt32(12, true);
  }
  set timestamp(val)
  {
    this.dataView.setInt32(12, val, true);
  }

  get isNew()
  {
    return this.dataView.getUint8(16);
  }
  set isNew(val)
  {
    this.dataView.setUint8(16, val);
  }

  get isCreated()
  {
    return this.dataView.getUint8(17);
  }
  set isCreated(val)
  {
    this.dataView.setUint8(17, val);
  }

  get padding0()
  {
    return this.dataView.getUint8(18);
  }
  set padding0(val)
  {
    this.dataView.setUint8(18, val);
  }

  get padding1()
  {
    return this.dataView.getUint8(19);
  }
  set padding1(val)
  {
    this.dataView.setUint8(19, val);
  }
}

class manualStructTypedArrays
{
  int32: Int32Array;
  float32: Float32Array;
  uint8: Uint8Array;

  constructor(data: ArrayBuffer, offset: number)
  {
    this.int32 = new Int32Array(data, offset);
    this.float32 = new Float32Array(data, offset);
    this.uint8 = new Uint8Array(data, offset);
  }

  get id()
  {
    return this.int32[0];
  }
  set id(val)
  {
    this.int32[0] = val;
  }

  get parentId()
  {
    return this.int32[1];
  }
  set parentId(val)
  {
    this.int32[1] = val;
  }

  get score()
  {
    return this.float32[2];
  }
  set score(val)
  {
    this.float32[2] = val;
  }

  get timestamp()
  {
    return this.int32[3];
  }
  set timestamp(val)
  {
    this.int32[3] = val;
  }

  get isNew()
  {
    return this.uint8[16];
  }
  set isNew(val)
  {
    this.uint8[16] = val;
  }

  get isCreated()
  {
    return this.uint8[17];
  }
  set isCreated(val)
  {
    this.uint8[17] = val;
  }

  get padding0()
  {
    return this.uint8[18];
  }
  set padding0(val)
  {
    this.uint8[18] = val;
  }

  get padding1()
  {
    return this.uint8[19];
  }
  set padding1(val)
  {
    this.uint8[19] = val;
  }
}

function generate(count: number)
{
  const size = sizeOf(TestStruct);
  const buf = new ArrayBuffer(size * count);
  const items = [];

  for (let i = 0; i < count; i++)
  {
    const struct = new TestStruct(buf, i * size);
    struct.id = Math.random() * 0xFFFFFFFF;
    struct.parentId = Math.random() * 0xFFFFFFFF;
    struct.score = Math.random();
    struct.timestamp = Math.random() * 0xFFFFFFFF;
    struct.isNew = Math.random() * 0xFF;
    struct.isCreated = Math.random() * 0xFF;

    items.push(struct.toJSON());
  }

  fs.writeFileSync("./out.json", JSON.stringify(items), { encoding: "utf8" });
  fs.writeFileSync("./out.bin", Buffer.from(buf));
}

function loadJson(contents: string)
{
  return JSON.parse(contents);
}

function loadBinary(contents: Buffer)
{
  const size = sizeOf(TestStruct);
  const count = contents.byteLength / size;
  const items = [];

  for (let i = 0; i < count; i++)
  {
    const struct = new TestStruct(contents.buffer, i * size);
    items.push(
    {
      id: struct.id,
      parentId: struct.parentId,
      score: struct.score,
      timestamp: struct.timestamp,
      isNew: struct.isNew,
      isCreated: struct.isCreated,
      padding0: struct.padding0,
      padding1: struct.padding1
    });
  }

  return items;
}

function loadBinaryManual(contents: Buffer)
{
  const size = sizeOf(TestStruct);
  const count = contents.byteLength / size;
  const items = [];

  for (let i = 0; i < count; i++)
  {
    const struct = new manualStruct(contents.buffer, i * size);
    items.push(
    {
      id: struct.id,
      parentId: struct.parentId,
      score: struct.score,
      timestamp: struct.timestamp,
      isNew: struct.isNew,
      isCreated: struct.isCreated,
      padding0: struct.padding0,
      padding1: struct.padding1
    });
  }

  return items;
}

function loadBinaryManualTypedArrays(contents: Buffer)
{
  const size = sizeOf(TestStruct);
  const count = contents.byteLength / size;
  const items = [];

  for (let i = 0; i < count; i++)
  {
    const struct = new manualStructTypedArrays(contents.buffer, i * size);
    items.push(
    {
      id: struct.id,
      parentId: struct.parentId,
      score: struct.score,
      timestamp: struct.timestamp,
      isNew: struct.isNew,
      isCreated: struct.isCreated,
      padding0: struct.padding0,
      padding1: struct.padding1
    });
  }

  return items;
}

generate(3000000);

let items: any[];

const contentsString = fs.readFileSync("./out.json", { encoding: "utf8" });

console.time("json");
items = loadJson(contentsString);
console.timeEnd("json");
console.log(items[0]);

const contentsBinary = fs.readFileSync("./out.bin") as Buffer;

console.time("binary struct");
items = loadBinary(contentsBinary);
console.timeEnd("binary struct");
console.log(items[0]);

console.time("binary manual");
items = loadBinaryManual(contentsBinary);
console.timeEnd("binary manual");
console.log(items[0]);

console.time("binary manual TypedArray");
items = loadBinaryManualTypedArrays(contentsBinary);
console.timeEnd("binary manual TypedArray");
console.log(items[0]);