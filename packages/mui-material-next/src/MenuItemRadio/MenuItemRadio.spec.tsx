import * as React from 'react';
import { expectType } from '@mui/types';
import MenuItemRadio, { MenuItemRadioProps } from '@mui/material-next/MenuItemRadio';
import Link from '@mui/material/Link';

const CustomComponent: React.FC<{ stringProp: string; numberProp: number }> =
  function CustomComponent() {
    return <div />;
  };

const props1: MenuItemRadioProps<'div'> = {
  component: 'div',
  onChange: (event) => {
    expectType<React.FormEvent<HTMLDivElement>, typeof event>(event);
  },
};

const props2: MenuItemRadioProps = {
  onChange: (event) => {
    expectType<React.FormEvent<HTMLLIElement>, typeof event>(event);
  },
};

const props3: MenuItemRadioProps<typeof CustomComponent> = {
  component: CustomComponent,
  stringProp: '2',
  numberProp: 2,
};

const props4: MenuItemRadioProps<typeof CustomComponent> = {
  component: CustomComponent,
  stringProp: '2',
  numberProp: 2,
  // @ts-expect-error CustomComponent does not accept incorrectProp
  incorrectProp: 3,
};

// @ts-expect-error missing props
const props5: MenuItemRadioProps<typeof CustomComponent> = {
  component: CustomComponent,
};

const TestComponent = () => {
  return (
    <React.Fragment>
      <MenuItemRadio />
      <MenuItemRadio component={'a'} href="/test" />

      <MenuItemRadio component={CustomComponent} stringProp="s" numberProp={1} />
      {
        // @ts-expect-error missing props
        <MenuItemRadio component={CustomComponent} />
      }
      <MenuItemRadio
        onChange={(event) => {
          expectType<React.FormEvent<HTMLLIElement>, typeof event>(event);
        }}
      />
      <MenuItemRadio
        component="span"
        onChange={(event) => {
          expectType<React.FormEvent<HTMLSpanElement>, typeof event>(event);
        }}
      />
      <MenuItemRadio component={Link} />
    </React.Fragment>
  );
};
