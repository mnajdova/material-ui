import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { useThemeProps } from '@mui/system';
import composeClasses from '@mui/base/composeClasses';
import useSwitch from '@mui/base/useSwitch';
import { useSlotProps } from '@mui/base/utils';
import useTouchRipple from '../Button/useTouchRipple';
import TouchRipple from '../Button/TouchRipple';
import { TouchRippleActions } from '../Button/TouchRipple.types';
import { getSwitchUtilityClass } from './switchClasses';
import styled from '../styles/styled';

const useUtilityClasses = (ownerState: any) => {
  const { classes, edge, variant, color, checked, disabled } = ownerState;

  const slots = {
    root: ['root', edge && `edge${capitalize(edge.toString())}`, variant, checked && 'checked', disabled && 'disabled', `color${capitalize(color)}`],
    thumb: ['thumb'],
    track: ['track'],
    input: ['input'],
    touchRipple: ['touchRipple'],
  };

  const composedClasses = composeClasses(slots, getSwitchUtilityClass, classes);

  return {
    ...classes, // forward the disabled and checked classes to the SwitchBase
    ...composedClasses,
  };
};

const SwitchRoot = styled('span')`
  display: inline-block;
  position: relative;
  width: 52px;
  height: 32px;
  cursor: pointer;
  border-radius: 16px;
  background: red;
`;

const SwitchTrack = styled('span')`background: green`;

const SwitchInput = styled('input')`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`;

const SwitchThumb = styled('span')`
  display: block;
  width: 16px;
  height: 16px;
  top: 4px;
  left: 4px;
  border-radius: 16px;
  background-color: #fff;
  position: relative;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;
  background: blue;
`;

const Switch = React.forwardRef((inProps, ref) => {
  const props = useThemeProps({ props: inProps, name: 'MuiSwitch' });
  const { getInputProps, checked, disabled, focusVisible, readOnly } = useSwitch(props);
  // @ts-ignore
  const { icon, checkedIcon, edge = false, color='primary', disableRipple, disableTouchRipple, slots = {}, variant = 'filled', slotProps = {}, ...other } = props;

  const rippleRef = React.useRef<TouchRippleActions>(null);

  const { enableTouchRipple, getRippleHandlers } = useTouchRipple({
    disabled,
    disableRipple,
    disableTouchRipple,
    rippleRef,
  });

  const ownerState = {
    ...props,
    color,
    edge,
    variant,
    checked,
    disabled,
    focusVisible,
    readOnly
  }

  const classes = useUtilityClasses(ownerState);

  const Root: React.ElementType = slots.root ?? 'span';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref,
      ...getRippleHandlers(props),
    },
    ownerState,
    className: classes.root,
  });

  const Track: React.ElementType = slots.track ?? 'span';
  const trackProps = useSlotProps({
    elementType: Track,
    externalSlotProps: slotProps.track,
    ownerState,
    className: classes.track,
  });

  const Thumb: React.ElementType = slots.thumb ?? 'span';
  const thumbProps = useSlotProps({
    elementType: Thumb,
    externalSlotProps: slotProps.thumb,
    ownerState,
    className: classes.thumb,
  });

  const Input: React.ElementType = slots.input ?? 'span';
  const inputProps = useSlotProps({
    elementType: Input,
    getSlotProps: getInputProps,
    externalSlotProps: slotProps.input,
    ownerState,
    className: classes.input,
  });

  return (
    <SwitchRoot {...rootProps}>
      <SwitchTrack {...trackProps}>
        <SwitchThumb {...thumbProps}>{checked ? checkedIcon : icon}      {enableTouchRipple ? (
        <TouchRipple {...slots.touchRipple} className={clsx(classes.touchRipple, slots.touchRipple?.className)} ref={rippleRef} />
      ) : null}</SwitchThumb>
      </SwitchTrack>
      <SwitchInput {...inputProps} />
    </SwitchRoot>
  );
});

export default Switch;