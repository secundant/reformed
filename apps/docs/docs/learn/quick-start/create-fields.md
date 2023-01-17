# Create first fields

:::tip
This section describes how to work with our basic primitives -
[Field](/api/entities/field), _Validation_, _Schema_, etc.
:::

## Create simple fields

```ts
const firstName = createField({ defaultValue: '' });
const lastName = createField({ defaultValue: '' });
const age = createField({ defaultValue: 0 });

// Now you can manipulate them

sample({
  clock: myPage.opened,
  target: [firstName.reset, lastName.reset, age.reset]
});

sample({
  clock: multiplyAgeButtonClicked,
  source: age.$value,
  filter: Boolean,
  fn: age => age ** 2,
  target: age.change
});
```

## Combine them

```ts
const guest = combineFields({
  fields: {
    firstName,
    lastName,
    age
  }
});

// Now you can replace manual reset with one for guest field

sample({
  clock: myPage.opened,
  target: guest.reset
  // target: [firstName.reset, lastName.reset, age.reset]
});
```

## Integrate fields state with your logic

### Combine values

```ts
const $fullName = combineFieldsValues([firstName, lastName], names =>
  names.filter(Boolean).join(' ')
);
// or
const $fullNameV2 = guest.$value.map(({ firstName, lastName }) =>
  [firstName, lastName].filter(Boolean).join(' ')
);
```

### Conditions dependent on fields states

```ts
sample({
  clock: idleTimeoutExpired,
  filter: not(guest.$modified),
  target: notifyUser
});
```
