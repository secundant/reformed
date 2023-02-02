# CombinedField

Result of [combineFields](../factories/combine-fields.md) factory, aggregates multiple fields shape in single one.

:::danger
WIP
:::

## API reference

```ts
const field: CombinedField<{ a: Field<number>; b: Field<string> }>;

// Commands

field.reset; // Event<void>
field.change; // Event<{ a?: number; b?: string }>
field.revalidate; // Event<Array<'blur' | 'change' | 'submit'>>

// Additional API

field.fields; // { a: Field<number>; b: Field<string> }
field.mapFields; // (mapValue, mapShape?) => MappedShape

// Value and modification state

field.$value; // Store<{ a: number; b: string }>
field.$dirty; // Store<boolean>
field.$pristine; // Store<boolean>
field.$modified; // Store<boolean>

// Validation state

field.$valid; // Store<boolean>
field.$errors; // Store<ValidationError[]>
field.$invalid; // Store<boolean>
field.$validating; // Store<boolean>

// Interaction state

field.$focused; // Store<boolean>
field.$blurred; // Store<boolean>
field.$touched; // Store<boolean>
field.$visited; // Store<boolean>
```
