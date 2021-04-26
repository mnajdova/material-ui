import { CSSProperties } from './withStyles';
import { ComponentsPropsList } from './props';

// TODO: these typings are off
export type ComponentsVariants = {
  [Name in keyof ComponentsPropsList]?: Array<{
    props: Partial<ComponentsPropsList[Name]>;
    style: CSSProperties;
  }>;
};
