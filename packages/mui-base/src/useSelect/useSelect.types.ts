import * as React from 'react';
import { ListAction, ListState, UseListRootSlotProps } from '../useList';
import { SelectOption } from '../useOption/useOption.types';
import { EventHandlers } from '../utils/types';
import { SelectProviderValue } from './SelectProvider';
import { MuiCancellableEventHandler } from '../utils/MuiCancellableEvent';

export type SelectChangeEventType =
  | React.MouseEvent<Element, MouseEvent>
  | React.KeyboardEvent<Element>
  | React.FocusEvent<Element, Element>
  | null;

export type SelectValue<Value, Multiple> = Multiple extends true ? Value[] : Value | null;

export interface SelectOptionDefinition<Value> {
  value: Value;
  disabled?: boolean;
  label: string;
}

export interface UseSelectParameters<OptionValue, Multiple extends boolean = false> {
  /**
   * A function used to determine if two options' values are equal.
   * By default, reference equality is used.
   *
   * There is a performance impact when using the `areOptionsEqual` prop (proportional to the number of options).
   * Therefore, it's recommented to use the default reference equality comparison whenever possible.
   */
  areOptionsEqual?: (a: OptionValue, b: OptionValue) => boolean;
  /**
   * If `true`, the select will be open by default.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * The default selected value. Use when the component is not controlled.
   */
  defaultValue?: SelectValue<OptionValue, Multiple>;
  /**
   * If `true`, the select is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The ref of the trigger button element.
   */
  buttonRef?: React.Ref<Element>;
  /**
   * The `id` attribute of the listbox element.
   */
  listboxId?: string;
  /**
   * The ref of the listbox element.
   */
  listboxRef?: React.Ref<Element>;
  /**
   * If `true`, the end user can select multiple values.
   * This affects the type of the `value`, `defaultValue`, and `onChange` props.
   *
   * @default false
   */
  multiple?: Multiple;
  /**
   * Callback fired when an option is selected.
   */
  onChange?: (
    event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<OptionValue, Multiple>,
  ) => void;
  /**
   * Callback fired when an option is highlighted.
   */
  onHighlightChange?: (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    highlighted: OptionValue | null,
  ) => void;
  /**
   * Callback fired when the listbox is opened or closed.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Controls the open state of the select's listbox.
   * This is the controlled equivalent of the `defaultOpen` prop.
   */
  open?: boolean;
  /**
   * An alternative way to specify the options.
   * If this parameter is set, options defined as JSX children are ignored.
   */
  options?: SelectOptionDefinition<OptionValue>[];
  /**
   * A function used to convert the option label to a string.
   * This is useful when labels are elements and need to be converted to plain text
   * to enable keyboard navigation with character keys.
   *
   * @default defaultOptionStringifier
   */
  getOptionAsString?: (option: SelectOption<OptionValue>) => string;
  /**
   * The selected value.
   * Set to `null` to deselect all options.
   */
  value?: SelectValue<OptionValue, Multiple>;
}

interface UseSelectButtonSlotEventHandlers {
  onClick: MuiCancellableEventHandler<React.MouseEvent>;
}

export type UseSelectButtonSlotProps<TOther = {}> = UseListRootSlotProps<
  Omit<TOther, keyof UseSelectButtonSlotEventHandlers>
> &
  UseSelectButtonSlotEventHandlers & {
    'aria-expanded': React.AriaAttributes['aria-expanded'];
    'aria-controls': React.AriaAttributes['aria-controls'];
    role: React.HTMLAttributes<Element>['role'];
    ref: React.RefCallback<Element> | null;
  };

interface UseSelectListboxSlotEventHandlers {
  onMouseDown: React.MouseEventHandler;
}

export type UseSelectListboxSlotProps<TOther = {}> = Omit<
  TOther,
  keyof UseSelectListboxSlotEventHandlers
> &
  UseSelectListboxSlotEventHandlers & {
    'aria-multiselectable': React.AriaAttributes['aria-multiselectable'];
    id: string | undefined;
    ref: React.RefCallback<Element> | null;
    role: React.HTMLAttributes<Element>['role'];
  };

export interface UseSelectReturnValue<Value, Multiple> {
  /**
   * If `true`, the trigger button is active (pressed).
   */
  buttonActive: boolean;
  /**
   * If `true`, the trigger button has a visible focus.
   */
  buttonFocusVisible: boolean;
  /**
   * Ref to the button slot DOM node.
   */
  buttonRef: React.RefCallback<Element> | null;
  /**
   * If `true`, the select is disabled.
   */
  disabled: boolean;
  /**
   * Action dispatcher for the select component.
   * Allows to programmatically control the select.
   */
  dispatch: (action: ListAction<Value> | SelectAction) => void;
  /**
   * Resolver for the button slot's props.
   * @param otherHandlers event handlers for the button slot
   * @returns props that should be spread on the button slot
   */
  getButtonProps: <OtherHandlers extends EventHandlers = {}>(
    otherHandlers?: OtherHandlers,
  ) => UseSelectButtonSlotProps<OtherHandlers>;
  /**
   * Resolver for the listbox slot's props.
   * @param otherHandlers event handlers for the listbox slot
   * @returns props that should be spread on the listbox slot
   */
  getListboxProps: <OtherHandlers extends EventHandlers = {}>(
    otherHandlers?: OtherHandlers,
  ) => UseSelectListboxSlotProps<OtherHandlers>;
  /**
   * A function that returns the metadata of an option with a given value.
   *
   * @param optionValue the value of the option
   * @returns
   */
  getOptionMetadata: (optionValue: Value) => SelectOption<Value> | undefined;
  /**
   * A value to be passed to the `SelectProvider` component.
   */
  contextValue: SelectProviderValue<Value>;
  /**
   * The value of the highlighted option.
   */
  highlightedOption: Value | null;
  /**
   * Ref to the listbox slot DOM node.
   */
  listboxRef: React.RefCallback<Element> | null;
  /**
   * If `true`, the listbox is open.
   */
  open: boolean;
  /**
   * Values of all the registered options.
   */
  options: Value[];
  /**
   * The value of the selected option(s).
   */
  value: SelectValue<Value, Multiple>;
}

export const SelectActionTypes = {
  buttonClick: 'buttonClick',
} as const;

export interface ButtonClickAction {
  type: typeof SelectActionTypes.buttonClick;
  event: React.MouseEvent;
}

export type SelectAction = ButtonClickAction;

export interface SelectInternalState<OptionValue> extends ListState<OptionValue> {
  open: boolean;
}
