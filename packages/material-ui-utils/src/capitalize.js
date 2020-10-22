// TODO: Error: D:\workspace\material-ui\packages\material-ui-utils\src\capitalize.js: Cannot find module '../utils/macros/MuiError.macro' from 'D:\workspace\material-ui\packages\material-ui-utils\src'
// import MuiError from '../utils/macros/MuiError.macro';
// It should to be noted that this function isn't equivalent to `text-transform: capitalize`.
//
// A strict capitalization should uppercase the first letter of each word a the sentence.
// We only handle the first word.
export default function capitalize(string) {
  if (typeof string !== 'string') {
    throw new Error('Material-UI: capitalize(string) expects a string argument.');
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}
