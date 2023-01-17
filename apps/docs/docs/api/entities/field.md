# Field

Static declarative unit without any platform specific

## API reference

```ts
const field: Field<number>;

field.blur; // Event<void>
field.focus; // Event<void>
field.reset; // Event<void>
field.change; // Event<number>

field.$value; // Store<number>
field.$dirty; // Store<boolean>
field.$pristine; // Store<boolean>
field.$modified; // Store<boolean>
field.$disabled; // Store<boolean>

field.$focused; // Store<boolean>
field.$blurred; // Store<boolean>
field.$touched; // Store<boolean>
field.$visited; // Store<boolean>
```

## Value API

- `field.change`: [`Event<Value>`](https://effector.dev/docs/api/effector/event) - change current value

```ts
const field: Field<number>;

// Event<number> - change current value
field.change;

// Store<number> - current value
field.$value;
// Store<boolean> - `true` if value is not equal to the default value
field.$dirty;
// Store<boolean> - `true` if value is equal to the default value
field.$pristine;
field.$pristine === not(field.$dirty);
// Store<boolean> - `true` if value has ever been changed (until field is reset)
field.$modified;
// Store<boolean>
field.$disabled;
```

## User focus API

```ts
const field: Field<number>;

// Event<void> - marks field as not focused if it's focused now
field.blur;
// Event<void> - marks field as focused if it's not
field.focus;

// Stores

// Store<boolean> - `true` if this field currently has focus
field.$focused;
// Store<boolean> - `true` if this field isn't focused
field.$blurred;
field.$blurred === not(field.$focused);
// Store<boolean> - `true` if this field has ever gained and lost focus
field.$touched;
// Store<boolean> - `true` if this field has ever gained focus
field.$visited;
```
