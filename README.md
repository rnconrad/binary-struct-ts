# BinaryStruct.ts

A small, performant Typescript decorator-based module for working directly with
raw binary data structures.

## Examples

### Basic Usage
```ts
import * from "binary-struct-ts";

@binaryStruct()
class ExampleStruct extends BinaryStruct
{
  @binaryField(BinaryType.Int32)
  id: number;
  @binaryField(BinaryType.Float32)
  value: number;
  @binaryField(BinaryType.Uint8)
  isDeleted: number;
  @binaryField(BinaryType.BinaryStruct, AnotherStruct)
  details: AnotherStruct;
};

const data = new ExampleStruct(new ArrayBuffer(sizeOf(ExampleStruct)));
data.id = 1234;
data.value = 3.14;
data.details = anotherStructInstance;
```

### Read Structured Data
```ts
const data = new ExampleStruct(arrayBuffer, offsetBytes);
id = data.id;
value = data.value;
detailsValue = data.details.value;
```

### Copy Data
```ts
const src = new ExampleStruct(arrayBuffer, srcOffsetBytes);
const dst = new ExampleStruct(arrayBuffer, dstOffsetBytes);
dst.copyFrom(src);
```

### Additional Options
```ts
@binaryStruct({ endianness: Endianness.BigEndian,
  packingStrategy: new AlignedPackingStrategy(4) })
class ExampleStruct extends BinaryStruct
{
  @binaryField(BinaryType.Int32)
  id: number;
  @binaryField(BinaryType.Float32)
  value: number;
  @binaryField(BinaryType.Uint8)
  isDeleted: number;
  @binaryField(BinaryType.BinaryStruct, AnotherStruct)
  details: AnotherStruct;
};
```