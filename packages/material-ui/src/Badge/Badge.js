import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useThemeVariants } from '@material-ui/styles';
import capitalize from '@material-ui/utils/capitalize';
import withStyles from '../styles/withStyles';

const RADIUS_STANDARD = 10;
const RADIUS_DOT = 4;

export const styles = (theme) => ({
  /* Styles applied to the root element. */
  root: {
    position: 'relative',
    display: 'inline-flex',
    // For correct alignment with the text.
    verticalAlign: 'middle',
    flexShrink: 0,
  },
  /* Styles applied to the badge `span` element. */
  badge: {
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
  },
  /* Styles applied to the root element if `color="primary"`. */
  colorPrimary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  /* Styles applied to the root element if `color="secondary"`. */
  colorSecondary: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  /* Styles applied to the root element if `color="error"`. */
  colorError: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  /* Styles applied to the root element if `variant="dot"`. */
  dot: {
    borderRadius: RADIUS_DOT,
    height: RADIUS_DOT * 2,
    minWidth: RADIUS_DOT * 2,
    padding: 0,
  },
  /* Styles applied to the root element if `variant="standard"`. */
  standard: {},
  /* Styles applied to the root element if `anchorOrigin={{ 'top', 'right' }} overlap="rectangular"`. */
  anchorOriginTopRightRectangular: {
    top: 0,
    right: 0,
    transform: 'scale(1) translate(50%, -50%)',
    transformOrigin: '100% 0%',
    '&$invisible': {
      transform: 'scale(0) translate(50%, -50%)',
    },
  },
  /* Styles applied to the root element if `anchorOrigin={{ 'bottom', 'right' }} overlap="rectangular"`. */
  anchorOriginBottomRightRectangular: {
    bottom: 0,
    right: 0,
    transform: 'scale(1) translate(50%, 50%)',
    transformOrigin: '100% 100%',
    '&$invisible': {
      transform: 'scale(0) translate(50%, 50%)',
    },
  },
  /* Styles applied to the root element if `anchorOrigin={{ 'top', 'left' }} overlap="rectangular"`. */
  anchorOriginTopLeftRectangular: {
    top: 0,
    left: 0,
    transform: 'scale(1) translate(-50%, -50%)',
    transformOrigin: '0% 0%',
    '&$invisible': {
      transform: 'scale(0) translate(-50%, -50%)',
    },
  },
  /* Styles applied to the root element if `anchorOrigin={{ 'bottom', 'left' }} overlap="rectangular"`. */
  anchorOriginBottomLeftRectangular: {
    bottom: 0,
    left: 0,
    transform: 'scale(1) translate(-50%, 50%)',
    transformOrigin: '0% 100%',
    '&$invisible': {
      transform: 'scale(0) translate(-50%, 50%)',
    },
  },
  /* Styles applied to the root element if `anchorOrigin={{ 'top', 'right' }} overlap="circular"`. */
  anchorOriginTopRightCircular: {
    top: '14%',
    right: '14%',
    transform: 'scale(1) translate(50%, -50%)',
    transformOrigin: '100% 0%',
    '&$invisible': {
      transform: 'scale(0) translate(50%, -50%)',
    },
  },
  /* Styles applied to the root element if `anchorOrigin={{ 'bottom', 'right' }} overlap="circular"`. */
  anchorOriginBottomRightCircular: {
    bottom: '14%',
    right: '14%',
    transform: 'scale(1) translate(50%, 50%)',
    transformOrigin: '100% 100%',
    '&$invisible': {
      transform: 'scale(0) translate(50%, 50%)',
    },
  },
  /* Styles applied to the root element if `anchorOrigin={{ 'top', 'left' }} overlap="circular"`. */
  anchorOriginTopLeftCircular: {
    top: '14%',
    left: '14%',
    transform: 'scale(1) translate(-50%, -50%)',
    transformOrigin: '0% 0%',
    '&$invisible': {
      transform: 'scale(0) translate(-50%, -50%)',
    },
  },
  /* Styles applied to the root element if `anchorOrigin={{ 'bottom', 'left' }} overlap="circular"`. */
  anchorOriginBottomLeftCircular: {
    bottom: '14%',
    left: '14%',
    transform: 'scale(1) translate(-50%, 50%)',
    transformOrigin: '0% 100%',
    '&$invisible': {
      transform: 'scale(0) translate(-50%, 50%)',
    },
  },
  /* Pseudo-class to the badge `span` element if `invisible={true}`. */
  invisible: {
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
});

const usePreviousProps = (value) => {
  const ref = React.useRef({});
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Badge = React.forwardRef(function Badge(props, ref) {
  const {
    anchorOrigin: anchorOriginProp = {
      vertical: 'top',
      horizontal: 'right',
    },
    badgeContent: badgeContentProp,
    children,
    classes,
    className,
    color: colorProp = 'default',
    component: ComponentProp = 'span',
    invisible: invisibleProp,
    max: maxProp = 99,
    overlap: overlapProp = 'rectangular',
    showZero = false,
    variant: variantProp = 'standard',
    ...other
  } = props;

  const prevProps = usePreviousProps({
    anchorOrigin: anchorOriginProp,
    badgeContent: badgeContentProp,
    color: colorProp,
    max: maxProp,
    overlap: overlapProp,
    variant: variantProp,
  });

  let invisible = invisibleProp;

  if (
    invisibleProp == null &&
    ((badgeContentProp === 0 && !showZero) || (badgeContentProp == null && variantProp !== 'dot'))
  ) {
    invisible = true;
  }

  const {
    anchorOrigin = anchorOriginProp,
    badgeContent,
    color = colorProp,
    max = maxProp,
    overlap = overlapProp,
    variant = variantProp,
  } = invisible ? prevProps : props;

  const themeVariantsClasses = useThemeVariants(
    {
      ...props,
      anchorOrigin,
      badgeContent,
      color,
      component: ComponentProp,
      invisible,
      max,
      overlap,
      showZero,
      variant,
    },
    'MuiBadge',
  );

  let displayValue = '';

  if (variant !== 'dot') {
    displayValue = badgeContent > max ? `${max}+` : badgeContent;
  }

  return (
    <ComponentProp className={clsx(classes.root, className)} ref={ref} {...other}>
      {children}
      <span
        className={clsx(
          classes.badge,
          classes[variant],
          classes[
            `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(
              anchorOrigin.horizontal,
            )}${capitalize(overlap)}`
          ],
          {
            [classes[`color${capitalize(color)}`]]: color !== 'default',
            [classes.invisible]: invisible,
          },
          themeVariantsClasses,
        )}
      >
        {displayValue}
      </span>
    </ComponentProp>
  );
});

Badge.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The anchor of the badge.
   * @default {
   *   vertical: 'top',
   *   horizontal: 'right',
   * }
   */
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'top']).isRequired,
  }),
  /**
   * The content rendered within the badge.
   */
  badgeContent: PropTypes.node,
  /**
   * The badge will be added relative to this node.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'default'
   */
  color: PropTypes.oneOf(['default', 'error', 'primary', 'secondary']),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the badge will be invisible.
   */
  invisible: PropTypes.bool,
  /**
   * Max count to show.
   * @default 99
   */
  max: PropTypes.number,
  /**
   * Wrapped shape the badge should overlap.
   * @default 'rectangular'
   */
  overlap: PropTypes.oneOf(['circular', 'rectangular']),
  /**
   * Controls whether the badge is hidden when `badgeContent` is zero.
   * @default false
   */
  showZero: PropTypes.bool,
  /**
   * The variant to use.
   * @default 'standard'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['dot', 'standard']),
    PropTypes.string,
  ]),
};

export default withStyles(styles, { name: 'MuiBadge' })(Badge);
