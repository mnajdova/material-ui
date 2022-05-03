import * as React from 'react';
import { ExtendButtonBase, ExtendButtonBaseTypeMap } from '../ButtonBase';
import { OverrideProps } from '../OverridableComponent';
import { AccordionSummaryClasses } from './accordionSummaryClasses';

export type AccordionSummaryTypeMap<
  P = {},
  D extends React.ElementType = 'div',
> = ExtendButtonBaseTypeMap<{
  props: P & {
    /**
     * The content of the component.
     */
    children?: React.ReactNode;
    /**
     * Override or extend the styles applied to the component.
     */
    classes?: Partial<AccordionSummaryClasses>;
    /**
     * The icon to display as the expand indicator.
     */
    expandIcon?: React.ReactNode;
  };
  defaultComponent: D;
}>;

/**
 *
 * Demos:
 *
 * - [Accordion](https://mui.com/material-ui/react-accordion/)
 *
 * API:
 *
 * - [AccordionSummary API](https://mui.com/material-ui/api/accordion-summary/)
 * - inherits [ButtonBase API](https://mui.com/material-ui/api/button-base/)
 */
declare const AccordionSummary: ExtendButtonBase<AccordionSummaryTypeMap>;

export type AccordionSummaryProps<
  D extends React.ElementType = AccordionSummaryTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<AccordionSummaryTypeMap<P, D>, D>;

export default AccordionSummary;
