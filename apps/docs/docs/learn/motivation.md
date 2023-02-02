# Motivation

:::info DRAFT

Not finished yet

:::

What is the most painful problem with form management now?

Most popular form managers are well done, bring really rich features, are well integrated with browser APIs, provide a good DX, etc.

They have different API designs, different features, pros/cons, but every time, with every solution, we see the same kind of problems:

- What if we want to create a single field with full functionality (validation, user's interaction state, etc.)?
- How to handle conditions and reactions without dirty hacks?
- How to integrate our form state with any external dependencies? Global state/data/events, anything.
- And the most major issue - **business logic**. Yes, that mysterious business logic, you can't write anything that will be a bit more complex than a todo list without transforming your code into a big ball of bud

Of course, it's just a few examples that help describe a more global issue, the real reason for whole painful moments with nowadays form managers.

They are out of touch with `business logic management` (or event state management).

Yes, too simple.
