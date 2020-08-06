import * as React from 'react';
import styled from '@emotion/styled';
import useTheme from '../styles/useTheme';
import { ThemeProvider } from 'emotion-theming';
import { fade, lighten, darken } from '../styles/colorManipulator';
import SliderBase from './SliderComponents.base';
import ValueLabel from './ValueLabel';

const callable = (input) => (...arg) => {
  if (typeof input === 'function') return input(...arg);
  return input;
};

const StyledComponent = styled.span((props) => ({
  height: 2,
  width: '100%',
  boxSizing: 'content-box',
  padding: '13px 0',
  display: 'inline-block',
  position: 'relative',
  cursor: 'pointer',
  touchAction: 'none',
  color: props.theme.palette.primary.main,
  WebkitTapHighlightColor: 'transparent',
  ...(props.color === 'secondary' && {
    color: props.theme.palette.secondary.main,
  }),
  ...(props.disabled && {
    pointerEvents: 'none',
    cursor: 'default',
    color: props.theme.palette.grey[400],
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
  ...(props.marked && {
    marginBottom: 20,
    ...(props.orientation === 'vertical' && {
      marginBottom: 'auto',
      marginRight: 20,
    }),
  }),
}));

const StyledRail = styled.span((props) => ({
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
  ...(props.track === 'inverted' && {
    opacity: 1,
  }),
}));

const StyledTrack = styled.span((props) => ({
  display: 'block',
  position: 'absolute',
  height: 2,
  borderRadius: 1,
  backgroundColor: 'currentColor',
  ...(props.orientation === 'vertical' && {
    width: 2,
  }),
  ...(props.track === false && {
    display: 'none',
  }),
  ...(props.track === 'inverted' && {
    backgroundColor:
      // Same logic as the LinearProgress track color
      props.theme.palette.type === 'light'
        ? lighten(props.theme.palette.primary.main, 0.62)
        : darken(props.theme.palette.primary.main, 0.5),
  }),
}));

const StyledThumb = styled.span(
  props => ({
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
    transition: props.theme.transitions.create(['box-shadow'], {
      duration: props.theme.transitions.duration.shortest,
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
      boxShadow: `0px 0px 0px 8px ${fade(props.theme.palette.primary.main, 0.16)}`,
      '@media (hover: none)': {
        boxShadow: 'none',
      },
    },
    ...(props.focusVisible && {
      boxShadow: `0px 0px 0px 8px ${fade(props.theme.palette.primary.main, 0.16)}`,
      '@media (hover: none)': {
        boxShadow: 'none',
      },
    }),
    '&.MuiSlider--active': {
      boxShadow: `0px 0px 0px 14px ${fade(props.theme.palette.primary.main, 0.16)}`,
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
    ...(props.color === 'secondary' && {
      ':hover': {
        boxShadow: `0px 0px 0px 8px ${fade(props.theme.palette.secondary.main, 0.16)}`,
      },
      ...(props.focusVisible && {
        boxShadow: `0px 0px 0px 8px ${fade(props.theme.palette.secondary.main, 0.16)}`,
      }),
      '&.MuiSlider--active': {
        boxShadow: `0px 0px 0px 14px ${fade(props.theme.palette.secondary.main, 0.16)}`,
      },
    })  
  })
);

const StyledValueLabel = styled(ValueLabel)({
  // IE 11 centering bug, to remove from the customization demos once no longer supported
  left: 'calc(-50% - 4px)',
});

const StyledMark = styled.span(
  props => ({
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'currentColor',
    ...(props.markActive && {
      backgroundColor: props.theme.palette.background.paper,
      opacity: 0.8,
    })
  })
);

const StyledMarkLabel = styled.span(
  props => ({
    ...props.theme.typography.body2,
    color: props.theme.palette.text.secondary,
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
    ...(props.markLabelActive && {
      color: props.theme.palette.text.primary,
    })
  })
);

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
    // components: componentsProp = {}
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
      <SliderBase
        isRtl={isRtl}
        {...props}
        components={{ 
          root: StyledComponent,
          rail: StyledRail,
          track: StyledTrack,
          thumb: StyledThumb,
          valueLabel: StyledValueLabel,
          mark: StyledMark,
          markLabel: StyledMarkLabel
        }}
        componentsProps={{
          // TODO: do not add these props on the element rendered
          root: {
            color,
            disabled,
            orientation,
            marked: marks.length > 0 && marks.some((mark) => mark.label),
          },
          rail: {
            orientation,
            track,
          },
          track: {
            orientation,
            track,
          },
          thumb: {
            disabled,
            orientation,
            color,
          },
          markLabel: {
            orientation,
          }
        }}
        ref={ref}
      />
    </ThemeProvider>
  );
});

export default Slider;
