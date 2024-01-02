'use client';
import * as React from 'react';
import clsx from 'clsx';
import { usePreviousProps } from '@mui/utils';
import { unstable_composeClasses as composeClasses } from '@mui/base/composeClasses';
import { useBadge } from '@mui/base/useBadge';
import { useSlotProps } from '@mui/base';
import { styled } from '@mui/zero-runtime';
import useThemeProps from '@mui/material/styles/useThemeProps';
import capitalize from '@mui/material/utils/capitalize';
import badgeClasses, { getBadgeUtilityClass } from './badgeClasses';

const RADIUS_STANDARD = 10;
const RADIUS_DOT = 4;

const useUtilityClasses = (ownerState) => {
  const {
    color,
    anchorOrigin,
    invisible,
    overlap,
    variant,
    classes = {},
  } = ownerState;

  const slots = {
    root: ['root'],
    badge: [
      'badge',
      variant,
      invisible && 'invisible',
      `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(
        anchorOrigin.horizontal,
      )}`,
      `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(
        anchorOrigin.horizontal,
      )}${capitalize(overlap)}`,
      `overlap${capitalize(overlap)}`,
      color !== 'default' && `color${capitalize(color)}`,
    ],
  };

  return composeClasses(slots, getBadgeUtilityClass, classes);
};

const BadgeRoot = styled('span', {
  name: 'MuiBadge',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  position: 'relative',
  display: 'inline-flex',
  // For correct alignment with the text.
  verticalAlign: 'middle',
  flexShrink: 0,
});

const BadgeBadge = styled('span', {
  name: 'MuiBadge',
  slot: 'Badge',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [
      styles.badge,
      styles[ownerState.variant],
      styles[
        `anchorOrigin${capitalize(
          ownerState.anchorOrigin.vertical,
        )}${capitalize(ownerState.anchorOrigin.horizontal)}${capitalize(
          ownerState.overlap,
        )}`
      ],
      ownerState.color !== 'default' &&
        styles[`color${capitalize(ownerState.color)}`],
      ownerState.invisible && styles.invisible,
    ];
  },
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  boxSizing: 'border-box',
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(12),
  minWidth: RADIUS_STANDARD * 2,
  lineHeight: 1,
  padding: '0 6px',
  height: RADIUS_STANDARD * 2,
  borderRadius: RADIUS_STANDARD,
  zIndex: 1, // Render the badge on top of potential ripples.
  transition: theme.transitions.create('transform', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  variants: [
    ...Object.keys((theme.vars ?? theme).palette)
      .filter(
        (key) =>
          (theme.vars ?? theme).palette[key].main &&
          (theme.vars ?? theme).palette[key].contrastText,
      )
      .map((color) => ({
        props: { color },
        style: {
          backgroundColor: (theme.vars || theme).palette[color].main,
          color: (theme.vars || theme).palette[color].contrastText,
        },
      })),
    {
      props: { variant: 'dot' },
      style: {
        borderRadius: RADIUS_DOT,
        height: RADIUS_DOT * 2,
        minWidth: RADIUS_DOT * 2,
        padding: 0,
      },
    },
    {
      props: ({ ownerState }) => {
        return (
          ownerState.anchorOrigin.vertical === 'top' &&
          ownerState.anchorOrigin.horizontal === 'right' &&
          ownerState.overlap === 'rectangular'
        );
      },
      style: {
        top: 0,
        right: 0,
        transform: 'scale(1) translate(50%, -50%)',
        transformOrigin: '100% 0%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(50%, -50%)',
        },
      },
    },
    {
      // props: (props) => {
      //   return props.anchorOrigin.vertical === 'bottom' &&
      //   props.anchorOrigin.horizontal === 'right' &&
      //   props.overlap === 'rectangular'},
      props: (props) => {
        return (
          props.anchorOrigin.vertical === 'bottom' &&
          props.anchorOrigin.horizontal === 'right' &&
          props.overlap === 'rectangular'
        );
      },
      style: {
        bottom: 0,
        right: 0,
        transform: 'scale(1) translate(50%, 50%)',
        transformOrigin: '100% 100%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(50%, 50%)',
        },
      },
    },
    {
      props: ({ ownerState }) =>
        ownerState.anchorOrigin.vertical === 'top' &&
        ownerState.anchorOrigin.horizontal === 'left' &&
        ownerState.overlap === 'rectangular',
      style: {
        top: 0,
        left: 0,
        transform: 'scale(1) translate(-50%, -50%)',
        transformOrigin: '0% 0%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(-50%, -50%)',
        },
      },
    },
    {
      props: ({ ownerState }) =>
        ownerState.anchorOrigin.vertical === 'bottom' &&
        ownerState.anchorOrigin.horizontal === 'left' &&
        ownerState.overlap === 'rectangular',
      style: {
        bottom: 0,
        left: 0,
        transform: 'scale(1) translate(-50%, 50%)',
        transformOrigin: '0% 100%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(-50%, 50%)',
        },
      },
    },
    {
      props: ({ ownerState }) =>
        ownerState.anchorOrigin.vertical === 'top' &&
        ownerState.anchorOrigin.horizontal === 'right' &&
        ownerState.overlap === 'circular',
      style: {
        top: '14%',
        right: '14%',
        transform: 'scale(1) translate(50%, -50%)',
        transformOrigin: '100% 0%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(50%, -50%)',
        },
      },
    },
    {
      props: ({ ownerState }) =>
        ownerState.anchorOrigin.vertical === 'bottom' &&
        ownerState.anchorOrigin.horizontal === 'right' &&
        ownerState.overlap === 'circular',
      style: {
        bottom: '14%',
        right: '14%',
        transform: 'scale(1) translate(50%, 50%)',
        transformOrigin: '100% 100%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(50%, 50%)',
        },
      },
    },
    {
      props: ({ ownerState }) =>
        ownerState.anchorOrigin.vertical === 'top' &&
        ownerState.anchorOrigin.horizontal === 'left' &&
        ownerState.overlap === 'circular',
      style: {
        top: '14%',
        left: '14%',
        transform: 'scale(1) translate(-50%, -50%)',
        transformOrigin: '0% 0%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(-50%, -50%)',
        },
      },
    },
    {
      props: ({ ownerState }) =>
        ownerState.anchorOrigin.vertical === 'bottom' &&
        ownerState.anchorOrigin.horizontal === 'left' &&
        ownerState.overlap === 'circular',
      style: {
        bottom: '14%',
        left: '14%',
        transform: 'scale(1) translate(-50%, 50%)',
        transformOrigin: '0% 100%',
        [`&.${badgeClasses.invisible}`]: {
          transform: 'scale(0) translate(-50%, 50%)',
        },
      },
    },
    {
      props: { invisible: true },
      style: {
        transition: theme.transitions.create('transform', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
    },
  ],
}));

const Badge = React.forwardRef(function Badge(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiBadge' });
  const {
    anchorOrigin: anchorOriginProp = {
      vertical: 'top',
      horizontal: 'right',
    },
    className,
    classes: classesProp,
    component,
    components = {},
    componentsProps = {},
    children,
    overlap: overlapProp = 'rectangular',
    color: colorProp = 'default',
    invisible: invisibleProp = false,
    max: maxProp = 99,
    badgeContent: badgeContentProp,
    slots,
    slotProps,
    showZero = false,
    variant: variantProp = 'standard',
    ...other
  } = props;

  const {
    badgeContent,
    invisible: invisibleFromHook,
    max,
    displayValue: displayValueFromHook,
  } = useBadge({
    max: maxProp,
    invisible: invisibleProp,
    badgeContent: badgeContentProp,
    showZero,
  });

  const prevProps = usePreviousProps({
    anchorOrigin: anchorOriginProp,
    color: colorProp,
    overlap: overlapProp,
    variant: variantProp,
    badgeContent: badgeContentProp,
  });

  const invisible =
    invisibleFromHook || (badgeContent == null && variantProp !== 'dot');

  const {
    color = colorProp,
    overlap = overlapProp,
    anchorOrigin = anchorOriginProp,
    variant = variantProp,
  } = invisible ? prevProps : props;

  const displayValue = variant !== 'dot' ? displayValueFromHook : undefined;

  const ownerState = {
    ...props,
    badgeContent,
    invisible,
    max,
    displayValue,
    showZero,
    anchorOrigin,
    color,
    overlap,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  // support both `slots` and `components` for backward compatibility
  const RootSlot = slots?.root ?? components.Root ?? BadgeRoot;
  const BadgeSlot = slots?.badge ?? components.Badge ?? BadgeBadge;

  const rootSlotProps = slotProps?.root ?? componentsProps.root;
  const badgeSlotProps = slotProps?.badge ?? componentsProps.badge;

  const rootProps = useSlotProps({
    elementType: RootSlot,
    externalSlotProps: rootSlotProps,
    externalForwardedProps: other,
    additionalProps: {
      ref,
      as: component,
    },
    ownerState,
    className: clsx(rootSlotProps?.className, classes.root, className),
  });

  const badgeProps = useSlotProps({
    elementType: BadgeSlot,
    externalSlotProps: badgeSlotProps,
    ownerState,
    className: clsx(classes.badge, badgeSlotProps?.className),
  });

  return (
    <RootSlot {...rootProps}>
      {children}
      <BadgeSlot {...badgeProps}>{displayValue}</BadgeSlot>
    </RootSlot>
  );
});

export default Badge;
