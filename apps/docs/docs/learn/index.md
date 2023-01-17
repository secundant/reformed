# Getting started

:::warning
Reformed is in early development, public API may (and will) be changed.

Please, read [Releases policy](/statements/releases-policy) before using it.
:::

Reformed based on simple concept - "Forms is business logic".
What it means? ...

## Installation

First of all, install `@reformed/core` and [effector](https://effector.dev/) (our peer dependency):

::: code-group

```sh [yarn]
yarn add @reformed/core effector
```

```sh [pnpm]
pnpm install @reformed/core effector
```

```sh [npm]
npm install @reformed/core effector
```

:::

## First steps

- Learn about [Fields](/learn/quick-start/fields.md)

### First fields

```ts
const firstName = createField({ defaultValue: '' });
const lastName = createField({ defaultValue: '' });
const fullName = createField({
  disabled: true
});
const fields = combineFields({
  firstName,
  lastName,
  fullName
});

sample({
  clock: fieldValue([firstName, lastName]),
  filter: values => values.some(Boolean),
  fn: names => names.filter(Boolean).join(' '),
  target: fullName.change
});
sample({
  clock: buttonClicked,
  source: fields.$value,
  filter: fields.$valid,
  target: sendDataFx
});
```
