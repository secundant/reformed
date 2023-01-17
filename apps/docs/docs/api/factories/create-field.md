# createField

Creates single static [Field](/api/entities/field)

## Formulae

### `createField({ defaultValue = null, disabled = true } = {})`

### `createField({ defaultValue? })`

Creates basic [Field](/api/entities/field) with default value

```ts
const name = createField({
  defaultValue: ''
});
```

### `createField({ defaultValue, validate: Validator })`

Creates [Field](/api/entities/field) with single validation

```ts
const age = createField({
  defaultValue: 0,
  validate: value => value < 10 && 'should be gt than 10'
});
```
