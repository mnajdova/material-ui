// TODO: add definition files and tests
// <Slider color="orimary">
// <span className="MuiSlider__root--color-primary">
export const useValueAndKey = (value, key, prefix) => {
  return value ? `${prefix}--${key}-${value}` : '';
};
// <Slider disabled={true}> => {
// <span className="MuiSlider__root--disabled">
export const useKeyOnly = (value, key, prefix) => {
  return value ? `${prefix}--${key}` : '';
};
