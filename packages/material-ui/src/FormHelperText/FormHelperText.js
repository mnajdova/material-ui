import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useThemeVariants } from '@material-ui/styles';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import withStyles from '../styles/withStyles';

export const styles = (theme) => ({
  /* Styles applied to the root element. */
  root: {
    color: theme.palette.text.secondary,
    ...theme.typography.caption,
    textAlign: 'left',
    marginTop: 3,
    margin: 0,
    '&$disabled': {
      color: theme.palette.text.disabled,
    },
    '&$error': {
      color: theme.palette.error.main,
    },
  },
  /* Pseudo-class applied to the root element if `error={true}`. */
  error: {},
  /* Pseudo-class applied to the root element if `disabled={true}`. */
  disabled: {},
  /* Styles applied to the root element if `margin="dense"`. */
  marginDense: {
    marginTop: 4,
  },
  /* Styles applied to the root element if `variant="filled"`. */
  filled: {},
  /* Styles applied to the root element if `variant="outlined"`. */

  outlined: {},
  /* Styles applied to the root element if `variant="standard"`. */

  standard: {},
  /* Styles applied to the root element if `variant="filled"` or `variant="outlined"`. */
  contained: {
    marginLeft: 14,
    marginRight: 14,
  },
  /* Pseudo-class applied to the root element if `focused={true}`. */
  focused: {},
  /* Pseudo-class applied to the root element if `filled={true}`. */
  controlFilled: {},
  /* Pseudo-class applied to the root element if `required={true}`. */
  required: {},
});

const FormHelperText = React.forwardRef(function FormHelperText(props, ref) {
  const {
    children,
    classes,
    className,
    component: Component = 'p',
    disabled,
    error,
    filled,
    focused,
    margin,
    required,
    variant,
    ...other
  } = props;

  const muiFormControl = useFormControl();
  const fcs = formControlState({
    props,
    muiFormControl,
    states: ['variant', 'margin', 'disabled', 'error', 'filled', 'focused', 'required'],
  });

  const themeVariantsClasses = useThemeVariants(
    {
      ...props,
      component: Component,
      disabled: fcs.disabled,
      error: fcs.error,
      filled: fcs.filled,
      focused: fcs.focused,
      margin: fcs.margin,
      requred: fcs.required,
      variant: fcs.variant,
    },
    'MuiFormHelperText',
  );

  return (
    <Component
      className={clsx(
        classes.root,
        classes[fcs.variant],
        {
          [classes.contained]: fcs.variant === 'filled' || fcs.variant === 'outlined',
          [classes.marginDense]: fcs.margin === 'dense',
          [classes.disabled]: fcs.disabled,
          [classes.error]: fcs.error,
          [classes.controlFilled]: fcs.filled,
          [classes.focused]: fcs.focused,
          [classes.required]: fcs.required,
        },
        themeVariantsClasses,
        className,
      )}
      ref={ref}
      {...other}
    >
      {children === ' ' ? (
        // eslint-disable-next-line react/no-danger
        <span dangerouslySetInnerHTML={{ __html: '&#8203;' }} />
      ) : (
        children
      )}
    </Component>
  );
});

FormHelperText.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   *
   * If `' '` is provided, the component reserves one line height for displaying a future message.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the helper text should be displayed in a disabled state.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, helper text should be displayed in an error state.
   */
  error: PropTypes.bool,
  /**
   * If `true`, the helper text should use filled classes key.
   */
  filled: PropTypes.bool,
  /**
   * If `true`, the helper text should use focused classes key.
   */
  focused: PropTypes.bool,
  /**
   * If `dense`, will adjust vertical spacing. This is normally obtained via context from
   * FormControl.
   */
  margin: PropTypes.oneOf(['dense']),
  /**
   * If `true`, the helper text should use required classes key.
   */
  required: PropTypes.bool,
  /**
   * The variant to use.
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['filled', 'outlined', 'standard']),
    PropTypes.string,
  ]),
};

export default withStyles(styles, { name: 'MuiFormHelperText' })(FormHelperText);
