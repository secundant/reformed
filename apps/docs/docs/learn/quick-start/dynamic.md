# Dynamic fields

:::danger

Pure imagination

:::

## Example

```ts
const passengerAdded = createEvent();
const guestAdded = createEvent<{
  index: number;
}>();

const passengers = createArrayField({
  defaultValue: [{ name: '', guests: [] }]
});

sample({
  clock: passengerAdded,
  fn: name => ({ name, guests: [] }),
  target: passengers.append
});

sample({
  clock: guestAdded,
  fn: ({ index }) => ({ path: `${index}.guests`, defaultValue: { name: '' } }),
  target: passengers.pushAt
});
```
