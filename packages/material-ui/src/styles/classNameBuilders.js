/**
 * Converts to class name by using both the key and the value
 *
 * <Slider color="orimary" />
 * <span className="MuiSlider__root--color-primary"></span>
 */
export function getClassWithValueAndKey(value, key, prefix) {
  return value ? `${prefix}--${key}-${value}` : '';
}

/**
 * Converts to class name using the key if the value is truthy
 *
 * <Slider disabled={true} />
 * <span className="MuiSlider__root--disabled">
 */
export function getClassWithKeyOnly(value, key, prefix) {
  return value ? `${prefix}--${key}` : '';
}
