# Field <Badge type="info" text="core" />

`Field` is main low-level structure for static logic.

:::danger
WIP
:::

## API reference

```ts
const field: Field<number>;

// Commands

field.blur; // Event<void>
field.focus; // Event<void>
field.reset; // Event<void>
field.change; // Event<number>
field.revalidate; // Event<Array<'blur' | 'change' | 'submit'>>

// Events

field.changed; // Event<number>
field.focused; // Event<void>
field.blurred; // Event<void>

// Value and modification state

field.$value; // Store<number>
field.$dirty; // Store<boolean>
field.$pristine; // Store<boolean>
field.$modified; // Store<boolean>
field.$disabled; // Store<boolean>

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

## Commands

### `change` - [`Event<Value>`](https://effector.dev/docs/api/effector/event)

Change current value.

Will be ignored if field is `$disabled` or passed value is equal to current value (see [config.valueEq](/api/factories/create-field.md#valueeq))

- `focus`: [`Event<void>`](https://effector.dev/docs/api/effector/event) - mark field as focused
  - Will be ignored if field is `$disabled` or already `$focused`
- `blur`: [`Event<void>`](https://effector.dev/docs/api/effector/event) - marks field as not focused
  - Will be ignored if field is `$blurred`
- `reset`: [`Event<void>`](https://effector.dev/docs/api/effector/event) - reset the whole field
  - Field's value will be reset to `config.defaultValue`
- `revalidate`: [`Event<Array<'blur' | 'change' | 'submit'>>`](https://effector.dev/docs/api/effector/event) - force field validations with provided triggers

## Events

- `changed`: [`Event<Value>`](https://effector.dev/docs/api/effector/event) - Fires when the current value changes
- `focused`: [`Event<void>`](https://effector.dev/docs/api/effector/event) - Fires when the field actually achieves focus
- `blurred`: [`Event<void>`](https://effector.dev/docs/api/effector/event) - Fires when the field actually loses focus

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
