# BinaryStruct.ts

A small, performant Typescript decorator-based module for working directly with
raw binary data structures.

## Examples

### Basic Usage
```ts
class ExampleStruct extends BinaryStruct
{
  @BinaryField(BinaryType.Int32)
  id: number;
  @BinaryField(BinaryType.Float32)
  value: number;
  @BinaryField(BinaryType.Uint8)
  isDeleted: number;
  @BinaryField(BinaryType.BinaryStruct, AnotherStruct)
  details: AnotherStruct;
};

const data = new ExampleStruct(new ArrayBuffer(sizeOf(ExampleStruct)));
data.id = 1234;
data.value = 3.14;
data.details = anotherStructInstance;
```

### Reading Structured Data
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
copy.call(dst, src);
```