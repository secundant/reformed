# Reformed

Forms are business logic.

```tsx
import { createHtmlForm, createHtmlField } from '@reformed/html';
import { Form, useForm } from '@reformed/react';

const form = createHtmlForm({
  fields: {
    login: createHtmlField({
      required: true
    }),
    password: createHtmlField({
      required: true
    }),
    comfirmPassword: createHtmlField({
      required: true
    }),
    rememberMe: createHtmlField({
      type: Boolean
    })
  },
  validate: {
    on: 'submit',
    fn: ({ password, comfirmPassword }) => {
      if (password !== comfirmPassword) {
        return {
          comfirmPassword: 'should be equal to password'
        };
      }
    }
  },
  submit: {
    mapParams: omit(['comfirmPassword']),
    fn: submitFx
  }
});

sample({
  clock: form.submitFailed
});
sample({
  clock: form.submitted,
  target: HomePage.route.open
});

// ...

function MyForm() {
  const { register } = useForm(form);

  return (
    <Form form={form} className="space-y-4">
      <FieldLayout label="Login">
        <input {...register('login')} />
      </FieldLayout>
      <FieldLayout label="Password">
        <input type="password" {...register('password')} />
      </FieldLayout>
      <FieldLayout label="Confirm password">
        <input type="password" {...register('confirmPassword')} />
      </FieldLayout>
      <FieldLayout type="control" label="Remember me?">
        <input {...register('rememberMe')} />
      </FieldLayout>
      <Button type="submit">Login</Button>
    </Form>
  );
}
```

> WIP

## Credits

Reformed inspired by ...
