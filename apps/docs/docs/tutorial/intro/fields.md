# Fields

Field is our basic primitive.

## Simple field

```ts
const field = createField({
  defaultValue: '',
  disabled: loadMyDataDx.pending
});

sample({
  clock: field.dirty,
  filter: Boolean,
  target: loadMyDataDx
});
```

## Validation

### Default (blur)

```ts
const field = createField({
  defaultValue: '',
  validate: value => (value.length > 10 ? 'too much' : null),
  validateOn: 'blur'
});

sample({
  clock: pageOpened,
  target: field.focus
});
sample({
  clock: pageClosed,
  target: field.blur // validation will be fired
});
```

### On submit

```ts
const field = createField({
  validate: myValidation,
  validateOn: 'submit'
});

sample({
  clock: somethingHappened,
  target: field.submit // WARNING - API may be changed
});
```

### Mixed

```ts
const withShapeValidation = createField({
  validate: {
    blur: firstValidation,
    submit: [firstValidation, secondValidation]
  }
});

const withArrayValidation = createField({
  validate: [
    {
      fn: firstValidation,
      on: ['blur', 'submit']
    },
    {
      fn: secondValidation,
      on: 'submit'
    }
  ]
});
```

### Supercharge it with logic

```ts
const field = createField({
  validate: {
    blur: minLengthValidation
  }
});

sample({
  clock: minLengthRuleChanged,
  fn: rule => ({
    blur: rule.enabled ? minLengthValidation : null
  }),
  // be careful - it changes all validations
  target: field.changeValidation
});
```
