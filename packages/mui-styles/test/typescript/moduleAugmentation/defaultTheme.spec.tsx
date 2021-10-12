import {  makeStyles } from '@mui/styles';

declare module '@mui/styles' {
  interface DefaultTheme {
    someProperty: string;
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.someProperty,
  }
}));
