import * as React from 'react';
import { ClassNames } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import useTheme from '../styles/useTheme';
import { fade, lighten, darken } from '../styles/colorManipulator';
import capitalize from '../utils/capitalize';
import SliderBase from './Slider.base';

const callable = (input) => (...arg) => {
  if (typeof input === 'function') return input(...arg);
  return input;
};

export const classes = {
  /* Styles applied to the root element. */
  root: (theme, props) => ({
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
    ...(props.disabled && {
      pointerEvents: 'none',
      cursor: 'default',
      color: theme.palette.grey[400],
    }),
    ...(props.orientation === 'vertical' && {
      width: 2,
      height: '100%',
      padding: '0 13px',
    }),
    // The primary input mechanism of the device includes a pointing device of limited accuracy.
    '@media (pointer: coarse)': {
      // Reach 42px touch target, about ~8mm on screen.
      padding: '20px 0',
      ...(props.orientation === 'vertical' && {
        padding: '0 20px',
      }),
    },
    '@media print': {
      colorAdjust: 'exact',
    },
  }),
  /* Styles applied to the root element if `color="primary"`. */
  colorPrimary: {
    // TODO v5: move the style here
  },
  /* Styles applied to the root element if `color="secondary"`. */
  colorSecondary: (theme) => ({
    color: theme.palette.secondary.main,
  }),
  /* Styles applied to the root element if `marks` is provided with at least one label. */
  marked: (theme, props) => ({
    marginBottom: 20,
    ...(props.orientation === 'vertical' && {
      marginBottom: 'auto',
      marginRight: 20,
    }),
  }),
  /* Pseudo-class applied to the root element if `orientation="vertical"`. */
  vertical: {},
  /* Pseudo-class applied to the root and thumb element if `disabled={true}`. */
  disabled: {},
  /* Styles applied to the rail element. */
  rail: (theme, props) => ({
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: 'currentColor',
    opacity: 0.38,
    ...(props.orientation === 'vertical' && {
      height: '100%',
      width: 2,
    }),
  }),
  /* Styles applied to the track element. */
  track: (theme, props) => ({
    display: 'block',
    position: 'absolute',
    height: 2,
    borderRadius: 1,
    backgroundColor: 'currentColor',
    ...(props.orientation === 'vertical' && {
      width: 2,
    }),
  }),
  /* Styles applied to the track element if `track={false}`. */
  trackFalse: {
    ' .MuiSlider--track': {
      display: 'none',
    },
  },
  /* Styles applied to the track element if `track="inverted"`. */
  trackInverted: (theme) => ({
    ' .MuiSlider--track': {
      backgroundColor:
        // Same logic as the LinearProgress track color
        theme.palette.type === 'light'
          ? lighten(theme.palette.primary.main, 0.62)
          : darken(theme.palette.primary.main, 0.5),
    },
    ' .MuiSlider--rail': {
      opacity: 1,
    },
  }),
  /* Styles applied to the thumb element. */
  thumb: (theme, props) => ({
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
    '::after': {
      position: 'absolute',
      content: '""',
      borderRadius: '50%',
      // reach 42px hit target (2 * 15 + thumb diameter)
      left: -15,
      top: -15,
      right: -15,
      bottom: -15,
    },
    ':hover': {
      boxShadow: `0px 0px 0px 8px ${fade(theme.palette.primary.main, 0.16)}`,
      '@media (hover: none)': {
        boxShadow: 'none',
      },
    },
    ...(props.focusVisible && {
      boxShadow: `0px 0px 0px 8px ${fade(theme.palette.primary.main, 0.16)}`,
      '@media (hover: none)': {
        boxShadow: 'none',
      },
    }),
    '&.MuiSlider--active': {
      boxShadow: `0px 0px 0px 14px ${fade(theme.palette.primary.main, 0.16)}`,
    },
    ...(props.disabled && {
      width: 8,
      height: 8,
      marginLeft: -4,
      marginTop: -3,
      ':hover': {
        boxShadow: 'none',
      },
    }),
    ...(props.orientation === 'vertical' && {
      marginLeft: -5,
      marginBottom: -6,
    }),
    ...((props.orientation === 'vertical' || props.disabled) && {
      marginLeft: -3,
      marginBottom: -4,
    }),
  }),
  /* Styles applied to the thumb element if `color="primary"`. */
  thumbColorPrimary: {
    // TODO v5: move the style here
  },
  /* Styles applied to the thumb element if `color="secondary"`. */
  thumbColorSecondary: (theme, props) => ({
    ':hover': {
      boxShadow: `0px 0px 0px 8px ${fade(theme.palette.secondary.main, 0.16)}`,
    },
    ...(props.focusVisible && {
      boxShadow: `0px 0px 0px 8px ${fade(theme.palette.secondary.main, 0.16)}`,
    }),
    '&.MuiSlider--active': {
      boxShadow: `0px 0px 0px 14px ${fade(theme.palette.secondary.main, 0.16)}`,
    },
  }),
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
  markActive: (theme) => ({
    backgroundColor: theme.palette.background.paper,
    opacity: 0.8,
  }),
  /* Styles applied to the mark label element. */
  markLabel: (theme, props = {}) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    position: 'absolute',
    top: 26,
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    ...(props.orientation === 'vertical' && {
      top: 'auto',
      left: 26,
      transform: 'translateY(50%)',
    }),
    '@media (pointer: coarse)': {
      top: 40,
      ...(props.orientation === 'vertical' && {
        left: 31,
      }),
    },
  }),
  /* Styles applied to the mark label element if active (depending on the value). */
  markLabelActive: (theme) => ({
    color: theme.palette.text.primary,
  }),
};

// This implementatino uses the ClassNames component https://emotion.sh/docs/class-names
const Slider = React.forwardRef(function Slider(props, ref) {
  const {
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
  const theme = useTheme();

  const marks =
    marksProp === true && step !== null
      ? [...Array(Math.floor((max - min) / step) + 1)].map((_, index) => ({
          value: min + step * index,
        }))
      : marksProp || [];
  const isRtl = theme.direction === 'rtl';

  return (
    <ThemeProvider theme={theme}>
      <ClassNames>
        {({ css, cx }) => {
          const cs = {
            root: cx(
              css(callable(classes.root)(theme, props)),
              css(callable(classes[`color${capitalize(color)}`])(theme, props)),
              {
                [css(callable(classes.disabled)(theme, props))]: disabled,
                [css(callable(classes.marked)(theme, props))]:
                  marks.length > 0 && marks.some((mark) => mark.label),
                [css(callable(classes.vertical)(theme, props))]: orientation === 'vertical',
                [css(callable(classes.trackInverted)(theme, props))]: track === 'inverted',
                [css(callable(classes.trackFalse)(theme, props))]: track === false,
              },
              className,
            ),
            rail: cx(css(callable(classes.rail)(theme, props)), 'MuiSlider--rail'),
            track: cx(css(callable(classes.track)(theme, props)), 'MuiSlider--rail'),
            mark: css(callable(classes.mark)(theme, props)),
            markActive: css(callable(classes.markActive)(theme, props)),
            markLabel: css(callable(classes.markLabel)(theme, props)),
            markLabelActive: css(callable(classes.markLabelActive)(theme, props)),
            valueLabel: css(callable(classes.valueLabel)(theme, props)),
            thumb: cx(
              css(callable(classes.thumb)(theme, props)),
              css(callable(classes[`thumbColor${capitalize(color)}`])(theme, props)),
              {
                [css(callable(classes.disabled)(theme, props))]: disabled,
              },
            ),
            thumbActive: 'MuiSlider--active',
            thumbFocusVisible: cx(
              css(callable(classes.focusVisible)(theme, props)),
              'MuiSlider--focusVisible',
            ),
          };

          return <SliderBase isRtl={isRtl} {...props} ref={ref} classes={cs} />;
        }}
      </ClassNames>
    </ThemeProvider>
  );
});

export default Slider;
