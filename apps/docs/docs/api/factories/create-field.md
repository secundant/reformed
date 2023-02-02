# createField

Creates single static [Field](/api/entities/field)

:::danger
WIP
:::

## Formulae

### `createField({ defaultValue?, disabled?, valueEq?, validate? })`

Creates basic [Field](../entities/field).

## Config details

### `defaultValue`

Optional default value or store with default value

- type: `SourceValue<Value>`
- default: `null`

```ts
const name = createField({
  defaultValue: 'John'
});
const copyName = createField({
  defaultValue: name.$value
});

sample({
  clock: resetCopied,
  target: copyName.reset // After reset copyName's value will be taken from name.$value
});
```

### `disabled`

Disabled fields will ignore any `change` or `focus` commands.

- type: `SourceValue<boolean>`
- default: `false`

You can pass plain boolean value:

```ts
const field = createField({ defaultValue: '', disabled: true });
```

Or boolean store:

```ts
const $mode = createStore<'edit' | 'view'>('view');
const disabledStore = createField({
  defaultValue: '',
  // Note: now it's DerivedStore (can't be changed externally)
  disabled: $mode.map(mode => mode === 'view')
});
```

### `valueEq`

Values equality comparator

- type: `(left: Value, right: Value) => boolean`
- default: `Object.is`

```ts
const field = createField<string[]>({
  defaultValue: [],
  valueEq: shallowEqualArray
});
```

### `validate`: `ValidationRule | ValidationConfig | ValidationConfig[]`

- `ValidationRule`: `(value: Value) => ValidationResult`
