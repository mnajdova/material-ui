import * as React from 'react';
import clsx from 'clsx';
import useTheme from '../styles/useTheme';
import withStyles from '../styles/withStyles';
import { fade, lighten, darken } from '../styles/colorManipulator';
import capitalize from '../utils/capitalize';
import SliderBase from './Slider.base';

export const styles = (theme) => ({
  /* Styles applied to the root element. */
  root: {
    height: 2,
    width: '100%',
    boxSizing: 'content-box',
    padding: '13px 0',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
    touchAction: 'none',
    color: theme.palette.primary.main,
    WebkitTapHighlightColor: 'transparent',
    '&$disabled': {
      pointerEvents: 'none',
      cursor: 'default',
      color: theme.palette.grey[400],
    },
    '&$vertical': {
      width: 2,
      height: '100%',
      padding: '0 13px',
    },
    // The primary input mechanism of the device includes a pointing device of limited accuracy.
    '@media (pointer: coarse)': {
      // Reach 42px touch target, about ~8mm on screen.
      padding: '20px 0',
      '&$vertical': {
        padding: '0 20px',
      },
    },
    '@media print': {
      colorAdjust: 'exact',
    },
  },
  /* Styles applied to the root element if `color="primary"`. */
  colorPrimary: {
    // TODO v5: move the style here
  },
  /* Styles applied to the root element if `color="secondary"`. */
  colorSecondary: {
    color: theme.palette.secondary.main,
  },
  /* Styles applied to the root element if `marks` is provided with at least one label. */
  marked: {
    marginBottom: 20,
    '&$vertical': {
      marginBottom: 'auto',
      marginRight: 20,
    },
  },
  /* Pseudo-class applied to the root element if `orientation="vertical"`. */
  vertical: {},
  /* Pseudo-class applied to the root and thumb element if `disabled={true}`. */
  disabled: {},
  /* Styles applied to the rail element. */
  rail: {
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: 'currentColor',
    opacity: 0.38,
    '$vertical &': {
      height: '100%',
      width: 2,
    },
  },
  /* Styles applied to the track element. */
  track: {
    display: 'block',
    position: 'absolute',
    height: 2,
    borderRadius: 1,
    backgroundColor: 'currentColor',
    '$vertical &': {
      width: 2,
    },
  },
  /* Styles applied to the track element if `track={false}`. */
  trackFalse: {
    '& $track': {
      display: 'none',
    },
  },
  /* Styles applied to the track element if `track="inverted"`. */
  trackInverted: {
    '& $track': {
      backgroundColor:
        // Same logic as the LinearProgress track color
        theme.palette.type === 'light'
          ? lighten(theme.palette.primary.main, 0.62)
          : darken(theme.palette.primary.main, 0.5),
    },
    '& $rail': {
      opacity: 1,
    },
  },
  /* Styles applied to the thumb element. */
  thumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    marginLeft: -6,
    marginTop: -5,
    boxSizing: 'border-box',
    borderRadius: '50%',
    outline: 0,
    backgroundColor: 'currentColor',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.create(['box-shadow'], {
      duration: theme.transitions.duration.shortest,
    }),
    '&::after': {
      position: 'absolute',
      content: '""',
      borderRadius: '50%',
      // reach 42px hit target (2 * 15 + thumb diameter)
      left: -15,
      top: -15,
      right: -15,
      bottom: -15,
    },
    '&$focusVisible,&:hover': {
      boxShadow: `0px 0px 0px 8px ${fade(theme.palette.primary.main, 0.16)}`,
      '@media (hover: none)': {
        boxShadow: 'none',
      },
    },
    '&$active': {
      boxShadow: `0px 0px 0px 14px ${fade(theme.palette.primary.main, 0.16)}`,
    },
    '&$disabled': {
      width: 8,
      height: 8,
      marginLeft: -4,
      marginTop: -3,
      '&:hover': {
        boxShadow: 'none',
      },
    },
    '$vertical &': {
      marginLeft: -5,
      marginBottom: -6,
    },
    '$vertical &$disabled': {
      marginLeft: -3,
      marginBottom: -4,
    },
  },
  /* Styles applied to the thumb element if `color="primary"`. */
  thumbColorPrimary: {
    // TODO v5: move the style here
  },
  /* Styles applied to the thumb element if `color="secondary"`. */
  thumbColorSecondary: {
    '&$focusVisible,&:hover': {
      boxShadow: `0px 0px 0px 8px ${fade(theme.palette.secondary.main, 0.16)}`,
    },
    '&$active': {
      boxShadow: `0px 0px 0px 14px ${fade(theme.palette.secondary.main, 0.16)}`,
    },
  },
  /* Pseudo-class applied to the thumb element if it's active. */
  active: {},
  /* Pseudo-class applied to the thumb element if keyboard focused. */
  focusVisible: {},
  /* Styles applied to the thumb label element. */
  valueLabel: {
    // IE 11 centering bug, to remove from the customization demos once no longer supported
    left: 'calc(-50% - 4px)',
  },
  /* Styles applied to the mark element. */
  mark: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'currentColor',
  },
  /* Styles applied to the mark element if active (depending on the value). */
  markActive: {
    backgroundColor: theme.palette.background.paper,
    opacity: 0.8,
  },
  /* Styles applied to the mark label element. */
  markLabel: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    position: 'absolute',
    top: 26,
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    '$vertical &': {
      top: 'auto',
      left: 26,
      transform: 'translateY(50%)',
    },
    '@media (pointer: coarse)': {
      top: 40,
      '$vertical &': {
        left: 31,
      },
    },
  },
  /* Styles applied to the mark label element if active (depending on the value). */
  markLabelActive: {
    color: theme.palette.text.primary,
  },
});

const useSliderClasses = (props) => {
  const {
    classes,
    className,
    color = 'primary',
    disabled = false,
    marks: marksProp = false,
    orientation = 'horizontal',
    step = 1,
    track = 'normal',
    max = 100,
    min = 0,
  } = props;

  const marks =
    marksProp === true && step !== null
      ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
          value: min + step * index,
        }))
      : marksProp || [];

  return {
    root: clsx(
      classes.root,
      classes[`color${capitalize(color)}`],
      {
        [classes.disabled]: disabled,
        [classes.marked]: marks.length > 0 && marks.some((mark) => mark.label),
        [classes.vertical]: orientation === 'vertical',
        [classes.trackInverted]: track === 'inverted',
        [classes.trackFalse]: track === false,
      },
      className,
    ),
    rail: classes.rail,
    track: classes.track,
    mark: classes.mark,
    markActive: classes.markActive,
    markLabel: classes.markLabel,
    markLabelActive: classes.markLabelActive,
    valueLabel: classes.valueLabel,
    thumb: clsx(classes.thumb, classes[`thumbColor${capitalize(color)}`], {
      [classes.disabled]: disabled,
    }),
    thumbActive: classes.active,
    thumbFocusVisible: classes.focusVisible,
  };
};

const Slider = React.forwardRef(function Slider(props, ref) {
  const cs = useSliderClasses(props);
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  return <SliderBase isRtl={isRtl} {...props} ref={ref} classes={cs} />;
});

export default withStyles(styles, { name: 'MuiSlider' })(Slider);
