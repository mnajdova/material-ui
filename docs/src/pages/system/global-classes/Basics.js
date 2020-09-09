import * as React from 'react';
import { GlobalCss } from '@material-ui/system';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  debug: {
    '& *': {
      border: '1px dashed grey',
    },
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.debug}>
      <GlobalCss />
      <div className="m-2 p-1-5">
        <div className="m-4 p-2" />
      </div>
    </div>
  );
}
