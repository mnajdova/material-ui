# Slider → v10 styling architecture: migration pilot

A working prototype of one component (Slider) converted from the v9 runtime style
engine to the proposed v10 architecture: **static CSS + CSS variable contract +
cascade layers**. Slider was picked deliberately — it's a worst case for a
zero-runtime conversion (continuous dynamic values, multi-thumb, orientation,
RTL, marks, value labels, controlled transitions while dragging).

This folder is a prototype: it is not exported from the package and can be
deleted wholesale.

## Files

| File | What it is |
| :--- | :--- |
| `parts.js` | Composition parts (`Slider.Root/Rail/Track/Marks/Thumb/ValueLabel`) — Material-styled Base UI parts (`@base-ui/react`). Behavior and a11y come from Base UI; no v9 code is used. |
| `Slider.js` | The precomposed high-level component — a ~70-line composition of the parts (the "publish the composition" model from the composition RFC). |
| `slider.css` | The entire style implementation, static, inside `@layer mui.components`. Replaces all seven `styled()` slots. **Unchanged by the composition refactor.** |
| `theme.css` | Minimal token layer (`@layer mui.tokens`) so the prototype is self-contained. In v10 this is `createTheme` output. |
| `examples/tailwind-example.js` | Overriding with Tailwind CSS v4 |
| `examples/plain-css-example.{js,css}` | Overriding with plain CSS (incl. the `styleOverrides` replacement) |
| `examples/emotion-example.js` | Overriding with Emotion (`styled(Slider)` and the `css` prop) |
| `SliderV10.test.js` | Smoke tests: selector/data-attribute/variable contract + behavior still works |

Run the tests with `pnpm test:unit SliderV10`.

To validate visually, run `pnpm docs:dev` and open
<http://localhost:3000/experiments/slider-v10> — the page
(`docs/pages/experiments/slider-v10.js`) renders a baseline parity gallery
plus all three override stacks. It reads these CSS files from this folder at
build time via `getStaticProps` (Next.js only allows global CSS imports in
`_app`; the real v10 packaging uses side-effect imports). The Tailwind section
uses hand-written stand-ins for the utilities Tailwind v4 would emit, in a
layer declared after `mui.components` — the same mechanism as the real
`utilities` layer.

## The migration recipe (generalizes to other components)

1. **Inventory the styled slots** and every `ownerState` usage inside them.
2. **Classify each style input:**
   - *Static* → plain CSS in `@layer mui.components`.
   - *Enum props* (`color`, `size`, `orientation`, `track`) and *boolean states*
     (`disabled`, `dragging`, `marked`, per-thumb `active`/`focusVisible`) →
     **data attributes** on the emitting element; CSS attribute selectors replace
     the `variants: [...]` matrix.
   - *Continuous values* (thumb offset %, track offset/leap %, mark offset %) →
     **inline CSS variables** (`--Slider-thumb-offset`, `--Slider-track-offset`,
     `--Slider-track-leap`, `--Slider-mark-offset`); static CSS maps them to
     properties per orientation.
   - *Uncooperative leftovers* (thumb z-index for the last-used thumb in range
     sliders, the visually-hidden input styles) → keep as inline `style`. Zero
     runtime doesn't mean zero inline styles; it means no style *engine*.
3. **Extract theme lookups into tokens** (`theme.palette.x` → `var(--mui-palette-x)`,
   transitions → `var(--mui-duration-shortest)` etc.).
4. **Pick the ring-2 knobs, derive the states** (see contract below). Every
   remaining hard-coded color must route through a knob or a token.
5. **Translate the styled blocks to CSS**, keeping specificity at (0,1,0):
   one slot class, qualifiers wrapped in `:where()`.
6. **Strip the engine from the JS**: no `styled`, `memoTheme`, `useDefaultProps`,
   `composeClasses`, `overridesResolver`, `ownerState`. Render plain elements
   with `clsx` for the root className merge.
7. Add override examples per stack + contract tests.

## The public contract this prototype ships

**Slot classes:** `MuiSlider-root`, `-rail`, `-track`, `-thumb`, `-mark`,
`-markLabel`, `-valueLabel` (+ the hidden `input`).

**Data attributes:**

| Attribute | On | Values |
| :--- | :--- | :--- |
| `data-orientation` | root | `horizontal` \| `vertical` |
| `data-color` | root | `primary` \| `secondary` \| `error` \| `info` \| `success` \| `warning` |
| `data-size` | root | `small` \| `medium` |
| `data-track` | root | `normal` \| `inverted` \| `false` |
| `data-disabled`, `data-dragging`, `data-marked` | root | boolean (present/absent) |
| `data-active`, `data-focus-visible` | thumb | boolean |
| `data-active` | mark, markLabel | boolean |
| `data-open` | valueLabel | boolean |
| `data-index` | thumb, mark, markLabel, input | number |

**CSS variables:**

| Ring | Variable | Meaning |
| :--- | :--- | :--- |
| 2 (knob) | `--Slider-color` | Base color; rail, track, thumb, halo all derive from it |
| 2 (knob) | `--Slider-size` | Rail/track thickness (replaces four v9 size×orientation variants) |
| 2 (knob) | `--Slider-thumbSize` | Thumb diameter |
| 3 (derived) | `--Slider-haloColor` | Hover/focus/active halo — `color-mix(16%)` of `--Slider-color`; override only to pin an exact value |
| 3 (derived) | `--Slider-invertedTrackColor` | Inverted-track fill — `light-dark()` + `color-mix()` of `--Slider-color` |
| positioning (set inline by the component, read-only for users) | `--Slider-track-offset`, `--Slider-track-leap`, `--Slider-thumb-offset`, `--Slider-mark-offset` | Continuous percentages |

## Findings

### Wins (things that got *better* than v9)

- **The variant matrix collapsed.** v9 needs separate styled-variants for
  horizontal/vertical × small/medium rail thickness (4 rules) — v10 is one
  `--Slider-size` reassignment. Disabled state is one line
  (`--Slider-color: var(--mui-palette-grey-400)`) instead of per-slot color rules.
- **`color-mix()` replaced three theme helpers.** `theme.alpha(main, 0.16)`
  (halo), `theme.lighten(main, 0.62)` and `theme.darken(main, 0.5)` (inverted
  track) are now pure CSS derivations of `--Slider-color` — which is why
  recoloring one instance recolors its hover halo with zero extra API.
- **`light-dark()` replaced `theme.applyStyles('dark', ...)`** and the generated
  `palette.Slider.*Track` channel tokens.
- **Logical properties + `:dir()` replaced the RTL machinery.** v9 needs the
  `horizontal-reverse` axis and left/right switching in JS; v10 positions with
  `inset-inline-start` and a `calc()` that centers the thumb without knowing the
  direction. `useRtl` survives only for pointer math in `useSlider`, not styling.
- **The value-label DOM simplified** (the v9 source's own TODO): no
  `React.cloneElement` wrapper component, no `valueLabelCircle/Label` spans —
  one absolutely-positioned span inside the thumb, `data-open` for state.
- **~330 lines of styled()/variants JS became ~260 lines of plain CSS** that a
  browser devtools panel shows verbatim, plus a component file that renders
  plain elements. No `'use client'` needed for styling (only for the
  interactivity hook, which Slider genuinely needs).

### Decisions this pilot forces (feed back into the RFC)

- **Custom palette colors.** v9 auto-generates color variants from
  `theme.palette` at runtime. v10's `slider.css` hardcodes the six standard
  `[data-color]` rules; the theme build step must emit one extra rule per custom
  palette color (`[data-color='brand'] { --Slider-color: var(--mui-palette-brand) }`),
  or users skip `color` and set `--Slider-color` directly. **This confirms the
  theme CLI needs a "component color variants" emission step.**
- **`slots`/`slotProps` are replaced by the composition API** (see the
  *v10 Component API — Composition* RFC): `useSlot` was never ported, and the
  component is now rebuilt on Base UI's Slider parts — findings below.
- **`useDefaultProps` dropped** per the RFC (wrapper components); this is the
  first component to actually feel that removal.
- **Breaking for `slotProps.valueLabel` users**: the value-label DOM change is a
  real migration note, not just cleanup.
- **`transform-origin` has no logical equivalent** — the vertical value label
  keeps physical `right` positioning like v9. Fine, but worth knowing the
  platform edge exists.

## Composition refactor findings (Base UI under the hood)

The pilot was rebuilt on `@base-ui/react` per the composition RFC: parts in
`parts.js`, the high-level component reduced to a thin composition. Validation
targets from the RFC, checked:

- ✅ **`slider.css` needed zero changes.** All pre-existing contract tests
  passed unchanged against the new implementation — the styling contract is
  API-agnostic, as claimed.
- ✅ **The high-level `<Slider />` is a ~70-line composition** of the public
  parts (thumb-count derivation + v9 callback-signature adapters account for
  most of it).
- ✅ **All v9 code is gone from the prototype**: `useSlider`, `useRtl`, and the
  local `valueToPercent` dependency on the v9 folder are deleted. Behavior,
  a11y, keyboard, pointer math, and RTL come from Base UI.
- ✅ **Data-attribute names aligned for free**: Base UI emits `data-dragging`,
  `data-orientation`, `data-disabled` — the exact names `slider.css` already
  targets. Material adds `data-color`/`data-size`/`data-track`/`data-marked`
  (root), `data-active`/`data-focus-visible` (thumb), `data-open` (value label).

Design choices worth knowing:

- **DOM**: `Slider.Root` renders Base UI's `Root` as a layout-neutral wrapper
  (`display: contents`) around `Control`, which carries `.MuiSlider-root` and
  the whole selector contract. Rail, Track, and Marks are Material-only plain
  spans — this keeps `track="inverted"` working (Base UI's `Indicator` has no
  inverted concept) and keeps the `--Slider-track-*` positioning vars live.
- **Thumb positioning is owned by Base UI** via inline styles
  (`insetInlineStart` + `translate`), which shadow the stylesheet's positioning
  rules. Visually equivalent; `--Slider-thumb-offset` is still set inline so the
  contract var remains readable. A follow-up could delete the shadowed CSS.

Gaps to feed back to Base UI / the RFC:

- **No public root-state access**: Material-only parts (Marks, Track, ValueLabel)
  need `values`/`min`/`max`, so `Slider.Root` mirrors the value state.
  `useSliderRootContext` exists internally but isn't exported — exposing it
  would remove the duplication.
- **Per-thumb active state isn't exposed**, so the value label auto-opens on
  hover/focus/press on the thumb but not when a drag starts from the track.
- **No v10 equivalent yet** for v9's `scale` (nonlinear display) and
  `step={null}` (marks-only stepping); Base UI offers `format`/`locale` instead.
- **Callback signatures**: Base UI uses `(value, eventDetails)`; the high-level
  component adapts to v9's `(event, value, activeThumb)`. Decide which signature
  v10 standardizes on.

### Where the effort went

Roughly: 70% translating the styled blocks into layered CSS (mechanical once the
contract table was written), 20% deciding the contract (knobs, attribute names,
what derives from what), 10% component JS (mostly deletion). The behavior hook
needed **zero changes** — good evidence the styling migration can proceed
component-by-component without touching interaction logic.
