import React from 'react';
import clsx from 'clsx';
import { styleFunctionInversed } from '@material-ui/system';
import styled from '../styles/experimentalStyled';

export const styleFunction = styleFunctionInversed;

function omit(input, fields) {
  const output = {};

  Object.keys(input).forEach((prop) => {
    if (fields.indexOf(prop) === -1) {
      output[prop] = input[prop];
    }
  });

  return output;
}

/**
 * @ignore - do not document.
 */
const BoxRoot = React.forwardRef(function StyledComponent(props, ref) {
  const { children, clone, className, component: Component = 'div', ...other } = props;

  const spread = omit(other, styleFunction.filterProps);

  if (clone) {
    return React.cloneElement(children, {
      className: clsx(children.props.className, className),
      ...spread,
    });
  }

  if (typeof children === 'function') {
    return children({ className, ...spread });
  }

  return (
    <Component ref={ref} className={className} {...spread}>
      {children}
    </Component>
  );
});

const shouldForwardProp = (prop) => styleFunction.filterProps.indexOf(prop) === -1;

BoxRoot.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  clone: PropTypes.bool,
  component: PropTypes.elementType,
};

const shouldForwardProp = (prop) => styleFunction.filterProps.indexOf(prop) === -1;

/**
 * @ignore - do not document.
 */
const Box = styled(BoxRoot, { shouldForwardProp }, { muiName: 'MuiBox' })(styleFunction);

export default Box;
