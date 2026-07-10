import * as React from 'react';
import Slider from '../Slider';

/**
 * Overriding SliderV10 with Tailwind CSS v4.
 *
 * Setup (globals.css) — declare the layer order so Tailwind's `utilities`
 * layer sorts after mui.*, then bridge the tokens:
 *
 *   @layer theme, base, mui.tokens, mui.base, mui.components, components, utilities;
 *   @import 'tailwindcss';
 *   @import '@mui/material/theme.css';
 *
 *   @theme {
 *     --color-primary: var(--mui-palette-primary);
 *   }
 *
 * No plugin is needed for any of the examples below — utilities win over the
 * component styles purely through cascade-layer order.
 */
export default function TailwindExamples() {
  return (
    <div className="flex flex-col gap-8">
      {/* 1. One-off layout: utilities beat @layer mui.components by layer order. */}
      <Slider defaultValue={30} className="w-64" />

      {/* 2. Recolor via the ring-2 knob. Track, rail, and the hover/active
             halo all follow, because states are derived with color-mix(). */}
      <Slider
        defaultValue={30}
        className="[--Slider-color:var(--color-emerald-600)] [--Slider-thumbSize:16px]"
      />

      {/* 3. Structural change on a slot via an arbitrary variant:
             a squared-off thumb. */}
      <Slider defaultValue={30} className="[&_.MuiSlider-thumb]:rounded-sm" />

      {/* 4. Density on a subtree: the knobs are CSS variables, so they
             cascade — every slider below the wrapper is compact. */}
      <div className="[--Slider-size:2px] [--Slider-thumbSize:12px]">
        <Slider defaultValue={20} />
        <Slider defaultValue={60} color="secondary" />
      </div>

      {/* 5. Ring 3: pin the exact halo color instead of the derived value. */}
      <Slider defaultValue={30} className="[--Slider-haloColor:rgb(16_185_129_/_0.24)]" />
    </div>
  );
}
