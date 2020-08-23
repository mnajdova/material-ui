import capitalize from '../utils/capitalize';
/**
 * Converts to class name by using both the key and the value
 *
 * <Slider color="orimary" />
 * <span className="MuiSlider-colorPrimary"></span>
 */
export function getClassWithValueAndKey(value, key, prefix) {
  return value ? `${prefix}${capitalize(key)}${capitalize(value)}` : '';
}

/**
 * Converts to class name using the key if the value is truthy
 *
 * <Slider disabled={true} />
 * <span className="MuiSlider-disabled">
 */
export function getClassWithKeyOnly(value, key, prefix) {
  return value ? `${prefix}${capitalize(key)}` : '';
}
