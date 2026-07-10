import * as React from 'react';
import Slider from '../Slider';
import './plain-css-example.css';

/**
 * Overriding SliderV10 with plain CSS — see plain-css-example.css.
 * Works identically with CSS Modules; only where the class name string
 * comes from changes.
 */
export default function PlainCssExamples() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Picks up the app-wide overrides from the stylesheet. */}
      <Slider defaultValue={30} />

      {/* The reusable class. */}
      <Slider defaultValue={70} className="volume-slider" />

      {/* Runtime-dynamic value: inline variable, no styling engine involved. */}
      <Slider defaultValue={50} style={{ '--Slider-color': 'hotpink' }} />
    </div>
  );
}
