import * as React from 'react';
import { StandardProps } from '@material-ui/core';

export interface CarouselProps extends StandardProps<{}, CarouselClassKey> {
  /**
   * The variant to use.
   */
  variant?: 'standard' | 'outlined';
}

export type CarouselClassKey =
  | 'root'

/**
 *
 * Demos:
 *
 * - [Carousel](https://material-ui.com/components/carousel/)
 *
 * API:
 *
 * - [Carousel API](https://material-ui.com/api/carousel/)
 */
export default function Carousel(props: CarouselProps): JSX.Element;
