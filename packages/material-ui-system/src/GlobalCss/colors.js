import combineWithBreakpoints from './combineWithBreakpoints';

const r = (val, accumulator, colorsSelectors) => {
  if (typeof val === 'string') {
    colorsSelectors[`bg-${accumulator}`] = { backgroundColor: val };
    colorsSelectors[`text-${accumulator}`] = { color: val };
    colorsSelectors[`hover\\:bg-${accumulator}`] = {
      '&:hover': { backgroundColor: val },
    };
    colorsSelectors[`hover\\:text-${accumulator}`] = { '&:hover': { color: val } };
  } else if (typeof val === 'object' && val !== null) {
    Object.keys(val).forEach((key) => {
      r(val[key], `${accumulator}${accumulator.length > 0 ? '-' : ''}${key}`, colorsSelectors);
    });
  }
};

export default function colors(theme) {
  const colorsSelectors = {};
  r(theme.palette, '', colorsSelectors);
  return combineWithBreakpoints(theme, colorsSelectors);
}
