# Material-UI style system

<p class="description">Utility-first style functions for rapidly building custom design systems.</p>

The style system lets you quickly build custom UI components leveraging the design tokens defined in your theme.

## Demo

{{"demo": "pages/system/basics/Demo.js", "bg": true, "defaultCodeOpen": true}}

## Why use the style system

There are several reasons why you may want to use the style system. Here are few:

### 1. Simplfy building consistent UIs

Building consistent UIs is hard. This is especially true when more than one person is building the application, as there has to be some coordination amongst members of the team regardingchoice of design tokens and how they are used, what parts of the theme structure should be used with what CSS properties, and so on.

### 2. Reduce context switching

We often find ourselves jumping from JS to CSS, or from a component definition to an instance in order to understand where and how some styles are defined. This is particularly true as the complexity (LOCs/# of elements) of the component we are working on increases. We could save a lot of time by removing this overhead.

### 3. Type less code

Usually when defining styles for a React component we need to either define a separate stylesheet, use a factory for creating the component (e.g. `styled()`), or use a hook for generating the styles (e.g. `makeStyles()` & `useStyles()`). This not only means we need to switch to another part of the code, but we also need much more code than just the styles we want to have on some element.

## The `sx` prop

The `sx` prop, as part of the style system, solves these problems by providing a simple way of applying the correct design tokens for specific CSS properties directly to a React element. The [demo above](#demo) shows how it can be used in Material-UI components.

This prop provides a superset of CSS that maps values directly from the theme, depending on the CSS property used. In addition, it allows a simple way of defining responsive values that correspond to the breakpoints defined in the theme.

With it you can easily build your custom visual components, such as `Card`, `Badge`, `Chip`, exactly as your design system specifies. In the sections following this one, we will dive deeper into the features of the `sx` prop.

## Installation

```jsx
// with npm
npm install @material-ui/system

// with yarn
yarn add @material-ui/system
```

## Usage

### Design tokens in the theme

You can explore the [System properties](/system/properties/) page to discover how the different CSS (and custom) properties are mapped to the theme keys.

### Shorthands

There are lots of shorthands available for the CSS properties. Here are few examples:

```jsx
  <Box
    sx={{
      boxShadow: 1, // theme.shadows[1]
      color: 'primary.main', // theme.palette.primary.main
      m: 1, // margin: theme.spacing(1)
      p: {
        sx: 1, // [theme.breakpoints.up('sx')]: : { padding: theme.spacing(1) }
      },
      zIndex: 'tooltip', // theme.zIndex.tooltip
    }}
  >
```

These are documented in the following sections.

### Superset of CSS

As the prop supports a superset of CSS, you can use child or pseudo selectors, media queries, raw CSS values etc. Here are few examples:

```jsx
  // Using pseudo selectors
  <Box
    sx={{
      // some styles
      ":hover": {
        '& .ChildSelector': {
          bgcolor: `${props.color}.dark`,
        },
        '& .OtherChildSelector': {
          color: `${props.color}.dark`,
        },
        boxShadow: 6,
      },
    }}
  >
```

```jsx
  // Using media queries
  <Box
    sx={{
      // some styles
      "@media screen and (max-width: 992px)": {
        width: 300,
      },
    }}
  >
```

### Responsive values

If you would like to have responsive values for a CSS property, you can use the breakpoints shorthand syntax. There are two ways of defining the breakpoints:

#### 1. Breakpoints as an array

The first option is to define your breakpoints as an array, from the smallest to the largest breakpoint.

{{"demo": "pages/system/basics/BreakpointsAsArray.js"}}

#### 2. Breakpoints as an object

The second option for defining breakpoints is to define them as an object, using the breakpoints as keys. Here is the previous example again, using the object syntax.

{{"demo": "pages/system/basics/BreakpointsAsObject.js"}}

### Custom breakpoints

You can also specify your own custom breakpoints, and use them as keys when defining the breakpoints object. Here is an example of how to do that.

```jsx
import * as React from 'react';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  breakpoints: {
    values: {
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  },
});

export default function CustomBreakpoints() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: {
            tablet: 100,
            laptop: 300,
            desktop: 500,
          },
        }}
      >
        This box has a responsive width
      </Box>
    </ThemeProvider>
  );
}
```

If you are using TypeScript, you will also need to use [module augmentation](/guides/typescript/#customization-of-theme) for the theme to accept the above values.

```ts
declare module '@material-ui/core/styles/createBreakpoints' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    tablet: true; // adds the `tablet` breakpoint
    laptop: true;
    desktop: true;
  }
}
```

### Theme getter

If you wish to use the theme for a CSS property that is not supported natively by the style system, you can use a function as the value, in which you can access the theme object.

{{"demo": "pages/system/basics/ValueAsFunction.js"}}

### Implementations
The `sx` prop can be used in four different locations:

#### 1. Core components

All core Material-UI components will support the `sx` prop.

#### 2. Box

[`Box`](/components/box/) is a lightweight component that gives access to the `sx` prop, and can be used as a utility component, and as a wrapper for other components.

#### 3. Custom components

In addition to Material-UI components, you can add the `sx` prop to your custom components too, by using the `experimentalStyled` utility from `@material-ui/core/styles`.

```jsx
import { experimentalStyled as styled } from '@material-ui/core/styles';

const Div = styled('div')``;
```

> <b>Note:</b>
>
> You should use this prop whenever you need to add or override a component style. If you find you are repeatedly applying the same styles to a component, then `styled()` may be a better option, as it allows you to specify the styles only once, and reuse them in all component instances. See [Customizing components](/customization/components/) for all the alternatives.

#### 4. Babel plugin

TODO: For #23220
