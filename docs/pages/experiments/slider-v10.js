import * as React from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import styled from '@emotion/styled';
import Slider from '@mui/material/SliderV10';

/**
 * Validation page for the v10 styling-architecture Slider pilot.
 * See packages/mui-material/src/SliderV10/PLAN.md.
 *
 * Run `pnpm docs:dev` and open http://localhost:3000/experiments/slider-v10
 *
 * The component's stylesheets are read from the package source at build time
 * and injected as <style> tags (Next.js only allows global CSS imports in
 * _app; in the real v10 packaging they are side-effect imports).
 */
export async function getStaticProps() {
  const dir = path.join(process.cwd(), '..', 'packages', 'mui-material', 'src', 'SliderV10');
  const read = (file) => fs.readFileSync(path.join(dir, file), 'utf8');

  return {
    props: {
      themeCss: read('theme.css'),
      sliderCss: read('slider.css'),
      plainCssExampleCss: read(path.join('examples', 'plain-css-example.css')),
    },
  };
}

/* Hand-written stand-in for Tailwind v4 output: exactly the utilities that
 * Tailwind would generate for the class names used in the Tailwind section,
 * placed in a layer declared after mui.components. The docs app's Tailwind
 * pipeline isn't wired into the mui.* layer order, but the mechanism being
 * demonstrated — utilities beating component styles purely through cascade
 * layer order — is the real one. */
const tailwindUtilitiesCss = String.raw`
@layer tw.utilities {
  .w-64 { width: 16rem; }
  .\[--Slider-color\:\#10b981\] { --Slider-color: #10b981; }
  .\[--Slider-thumbSize\:16px\] { --Slider-thumbSize: 16px; }
  .\[--Slider-size\:2px\] { --Slider-size: 2px; }
  .\[--Slider-thumbSize\:12px\] { --Slider-thumbSize: 12px; }
  .\[\&_\.MuiSlider-thumb\]\:rounded-sm .MuiSlider-thumb { border-radius: 0.25rem; }
  .\[--Slider-haloColor\:rgb\(16_185_129_\/_0\.24\)\] { --Slider-haloColor: rgb(16 185 129 / 0.24); }
}
`;

/* The Emotion example from examples/emotion-example.js: Emotion's generated
 * classes are unlayered, so they beat @layer mui.components with no `&&`
 * specificity hacks, and tokens are read with var() — no ThemeProvider. */
const IOSSlider = styled(Slider)`
  --Slider-color: #007aff;
  --Slider-size: 4px;
  --Slider-thumbSize: 28px;

  .MuiSlider-thumb {
    background-color: #fff;
    box-shadow: 0 3px 8px rgb(0 0 0 / 0.3);

    &:hover,
    &[data-focus-visible] {
      box-shadow:
        0 3px 8px rgb(0 0 0 / 0.3),
        0 0 0 8px var(--Slider-haloColor);
    }
  }

  .MuiSlider-valueLabel {
    background-color: transparent;
    color: var(--mui-palette-text-primary);
    font-weight: 700;
    top: -6px;
  }
`;

const EmotionOneOff = styled(Slider)`
  max-width: 320px;
  --Slider-color: var(--mui-palette-secondary);
`;

const marks = [
  { value: 0, label: '0°C' },
  { value: 20, label: '20°C' },
  { value: 37, label: '37°C' },
  { value: 100, label: '100°C' },
];

function Demo({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: '0.8125rem', opacity: 0.7 }}>{label}</span>
      {children}
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h2>
        {description ? (
          <p style={{ margin: '8px 0 0', fontSize: '0.875rem', opacity: 0.8 }}>{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function SliderV10Experiment({ themeCss, sliderCss, plainCssExampleCss }) {
  const [appWideOverrides, setAppWideOverrides] = React.useState(false);
  const [dynamicColor, setDynamicColor] = React.useState('#e91e63');

  return (
    <React.Fragment>
      <Head>
        <title>SliderV10 — v10 styling architecture pilot</title>
      </Head>
      {/* mui.tokens / mui.base / mui.components layer order is declared in theme.css */}
      {/* eslint-disable react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      <style dangerouslySetInnerHTML={{ __html: sliderCss }} />
      <style dangerouslySetInnerHTML={{ __html: tailwindUtilitiesCss }} />
      {appWideOverrides ? <style dangerouslySetInnerHTML={{ __html: plainCssExampleCss }} /> : null}
      {/* eslint-enable react/no-danger */}
      <main
        style={{
          minHeight: '100vh',
          margin: 0,
          padding: '48px 32px 96px',
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
          fontFamily: 'var(--mui-font-family)',
          background: 'var(--mui-palette-background-paper)',
          color: 'var(--mui-palette-text-primary)',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SliderV10</h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            Zero-runtime Slider prototype: static layered CSS, data attributes, CSS variable
            knobs. Compare against{' '}
            <Link href="/material-ui/react-slider/" style={{ color: 'inherit' }}>
              the v9 Slider demos
            </Link>
            . The page follows the OS light/dark scheme via <code>light-dark()</code>.
          </p>
        </div>

        <Section
          title="Baseline parity"
          description="The v9 demo matrix rendered by the converted component. Interactions (pointer, keyboard, touch) come from the unchanged useSlider hook."
        >
          <Demo label="Continuous (primary, medium)">
            <Slider defaultValue={30} aria-label="Volume" />
          </Demo>
          <Demo label='color="secondary"'>
            <Slider defaultValue={30} color="secondary" aria-label="Volume" />
          </Demo>
          <Demo label='size="small"'>
            <Slider defaultValue={30} size="small" aria-label="Volume" />
          </Demo>
          <Demo label="Disabled — one knob reassignment, every slot follows">
            <Slider defaultValue={30} disabled aria-label="Volume" />
          </Demo>
          <Demo label="Range">
            <Slider defaultValue={[20, 60]} aria-label="Range" />
          </Demo>
          <Demo label='Marks with labels + valueLabelDisplay="auto"'>
            <Slider defaultValue={37} marks={marks} valueLabelDisplay="auto" aria-label="Temperature" />
          </Demo>
          <Demo label='track="inverted" — light-dark() + color-mix() derivation'>
            <Slider defaultValue={30} track="inverted" aria-label="Volume" />
          </Demo>
          <Demo label="track={false}">
            <Slider defaultValue={30} track={false} aria-label="Volume" />
          </Demo>
          <Demo label="Vertical">
            <div style={{ height: 200 }}>
              <Slider defaultValue={30} orientation="vertical" aria-label="Volume" />
            </div>
          </Demo>
        </Section>

        <Section
          title="Tailwind CSS"
          description="Utilities live in a layer declared after mui.components, so they win by cascade-layer order alone — no plugin, no !important. (The utility rules on this page are hand-written stand-ins for what Tailwind v4 emits; see the source.)"
        >
          <Demo label='className="w-64" — layout utility beats the component width'>
            <Slider defaultValue={30} className="w-64" aria-label="Volume" />
          </Demo>
          <Demo label='className="[--Slider-color:#10b981] [--Slider-thumbSize:16px]" — hover halo follows via color-mix()'>
            <Slider
              defaultValue={30}
              className="[--Slider-color:#10b981] [--Slider-thumbSize:16px]"
              aria-label="Volume"
            />
          </Demo>
          <Demo label='className="[&_.MuiSlider-thumb]:rounded-sm" — structural change on a slot'>
            <Slider defaultValue={30} className="[&_.MuiSlider-thumb]:rounded-sm" aria-label="Volume" />
          </Demo>
          <Demo label="Density on a subtree — the knobs cascade">
            <div
              className="[--Slider-size:2px] [--Slider-thumbSize:12px]"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <Slider defaultValue={20} aria-label="Volume" />
              <Slider defaultValue={60} color="secondary" aria-label="Volume" />
            </div>
          </Demo>
          <Demo label="Ring 3: pin the exact halo instead of the derived value">
            <Slider
              defaultValue={30}
              className="[--Slider-color:#10b981] [--Slider-haloColor:rgb(16_185_129_/_0.24)]"
              aria-label="Volume"
            />
          </Demo>
        </Section>

        <Section
          title="Plain CSS"
          description="examples/plain-css-example.css, injected unlayered. The first rules restyle every slider on this page — that is the point: it is the theme.styleOverrides replacement. Toggle it and watch the whole page react."
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              checked={appWideOverrides}
              onChange={(event) => setAppWideOverrides(event.target.checked)}
            />
            Apply the app-wide overrides (6px rail, colored value labels, white active marks)
          </label>
          <Demo label='className="volume-slider" — the reusable-component tier, squared 24px thumb'>
            <Slider
              defaultValue={70}
              className="volume-slider"
              valueLabelDisplay="auto"
              aria-label="Volume"
            />
          </Demo>
          <Demo label="Runtime-dynamic value — inline CSS variable, no styling engine involved">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <input
                type="color"
                value={dynamicColor}
                onChange={(event) => setDynamicColor(event.target.value)}
                aria-label="Slider color"
              />
              <Slider
                defaultValue={50}
                style={{ '--Slider-color': dynamicColor }}
                aria-label="Volume"
              />
            </div>
          </Demo>
        </Section>

        <Section
          title="Emotion"
          description="styled(Slider) keeps working: Emotion's class is unlayered so it beats mui.components — no && specificity doubling, no ThemeProvider; tokens are read with var()."
        >
          <Demo label="styled(Slider) — the docs' iOS slider, ported">
            <IOSSlider defaultValue={60} valueLabelDisplay="on" aria-label="Volume" />
          </Demo>
          <Demo label="One-off styled() with a token: --Slider-color: var(--mui-palette-secondary)">
            <EmotionOneOff defaultValue={30} aria-label="Volume" />
          </Demo>
        </Section>
      </main>
    </React.Fragment>
  );
}
