/** @jsxImportSource @emotion/react */
import * as React from 'react';
import styled from '@emotion/styled';
import Slider from '../Slider';

/**
 * Overriding SliderV10 with Emotion.
 *
 * Emotion demotes gracefully in the v10 architecture: it is no longer the
 * engine under every component, just one way to produce a class name.
 * Its generated classes are UNLAYERED, so they beat @layer mui.components
 * by cascade-layer rules alone — no `&&` specificity doubling like v9.
 *
 * Note there is also no ThemeProvider: theme tokens are ambient CSS
 * variables, read with var() as plain strings instead of theme callbacks.
 */

/* The v9 docs' classic "iOS slider" demo, ported. In v9 this needs theme
   callbacks and class-name interpolation; here it is knobs + slot selectors. */
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

export default function EmotionExamples() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Reusable component via styled(). */}
      <IOSSlider defaultValue={60} valueLabelDisplay="on" />

      {/* One-off via the css prop — same layer logic applies. */}
      <Slider
        defaultValue={30}
        css={{
          maxWidth: 320,
          '--Slider-color': 'var(--mui-palette-secondary)',
        }}
      />
    </div>
  );
}
