# Native JSX Migration

This branch is for converting preserved Framer pages into native JSX one page at a time.

## Ground Rules

- Keep `main` deployable as the exact mirrored Framer version.
- Convert only one route at a time.
- Do not delete the preserved mirror for a route until the native route passes visual QA.
- Keep the Framer class names and CSS during the first native pass whenever possible.
- Rebuild cleaner semantic components only after the native route matches the reference.

## Reference Routes

Every original mirrored page is available under `/__reference`.

Examples:

```text
/__reference/
/__reference/about
/__reference/work/raven-claw
/__reference/blog/polestar-new-ev
/__reference/contact
```

Use these routes for screenshot comparison while replacing the normal routes with native JSX.

## Suggested Page Order

1. `/contact`
2. `/about`
3. `/work`
4. Work detail pages
5. `/blog`
6. Blog detail pages
7. `/`

The homepage should come later because it has the highest animation and interaction density.

## QA Gate Per Page

Before replacing a preserved page:

- `npm run build`
- route returns `200`
- native route renders nonblank
- `/__reference/...` still renders the preserved page
- desktop screenshot compared against reference
- mobile screenshot compared against reference
- Framer badge and "Use for Free" remain hidden
- primary interaction still works, when applicable
