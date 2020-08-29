import React from 'react';
import Slider from '@material-ui/core/Slider';

const PerfExample = () => {
  function valuetext(value) {
    return `${value}°C`;
  }

  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 37,
      label: '37°C',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];

  return (
    <>
      <Slider
        track={false}
        aria-labelledby="track-false-slider"
        getAriaValueText={valuetext}
        defaultValue={30}
        marks={marks}
      />
      <Slider
        track={false}
        aria-labelledby="track-false-range-slider"
        getAriaValueText={valuetext}
        defaultValue={[20, 37, 50]}
        marks={marks}
      />
      <Slider
        track="inverted"
        aria-labelledby="track-inverted-slider"
        getAriaValueText={valuetext}
        defaultValue={30}
        marks={marks}
      />
      <Slider
        track="inverted"
        aria-labelledby="track-inverted-range-slider"
        getAriaValueText={valuetext}
        defaultValue={[20, 37]}
        marks={marks}
      />
      <Slider
        orientation="vertical"
        getAriaValueText={valuetext}
        defaultValue={30}
        aria-labelledby="vertical-slider"
      />
      <Slider
        disabled
        orientation="vertical"
        getAriaValueText={valuetext}
        defaultValue={30}
        aria-labelledby="vertical-slider"
      />
      <Slider
        orientation="vertical"
        defaultValue={[20, 37]}
        aria-labelledby="vertical-slider"
        getAriaValueText={valuetext}
        marks={marks}
      />
    </>
  );
};

export default PerfExample;
