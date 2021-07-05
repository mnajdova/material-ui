import * as React from 'react';
import { EmotionCache, withEmotionCache, ClassNames } from "@emotion/react";
import createCache from "@emotion/cache";
import { CSSInterpolation, serializeStyles } from "@emotion/serialize";
import { insertStyles } from "@emotion/utils";
import { styled, useTheme } from '@material-ui/core/styles';
import { createUseClassNamesFactory } from "tss-react";

const { createUseClassNames } = createUseClassNamesFactory({ useTheme });

const makeStylesTss = createUseClassNames;

const useMakeStylesTssResult = makeStylesTss()(
  (theme)=> ({
    root: {
      color: 'lightgreen',
      // backgroundColor: theme.palette.primary.main
    },
  })
);

const { useClassNames } = useMakeStylesTssResult;
console.log(useMakeStylesTssResult);

const useStylesTss = useClassNames;

const defaultCache = createCache({ key: "css" });
const CacheContext = React.createContext<EmotionCache>(defaultCache);
export const useEmotionCache = () => React.useContext(CacheContext);

// We wrap our App with this
export const CacheProvider = withEmotionCache(
  ({ children }: { children: React.ReactNode }, cache: EmotionCache) => {
    return (
      <CacheContext.Provider value={cache}>{children}</CacheContext.Provider>
    );
  }
);

// export function useCssClassName(
//   ...args: Array<CSSInterpolation>
// ): () => string {
//   const cache = useEmotionCache();
//   return useCallback(() => {
//     if (!cache) {
//       console.log("No cache");
//     }
//     const serialized = serializeStyles(args, cache.registered);
//     insertStyles(cache, serialized, false);
//     return cache.key + "-" + serialized.name;
//   }, [cache, args]);
// }

export function makeStyles(styles) {
  return (props = {}): Record<string, string> => {
    const cache = useEmotionCache();
    if (!cache) {
      console.log("No cache");
    }

    const result = Object.keys(styles).reduce((acc, key) => {
      // TODO: handle props
      const serialized = serializeStyles(
        [styles[key]],
        cache.registered,
        props
      );
      insertStyles(cache, serialized, false);
      acc[key] = (cache.key || "css") + "-" + serialized.name;
      return acc;
    }, {});

    return result;

    // const serialized = serializeStyles(args, cache.registered);
    // insertStyles(cache, serialized, false);
    // return cache.key + "-" + serialized.name;
  };
}

const useStyles = makeStyles({
  root: {
    color: "lightgreen"
  }
});

export let isBrowser = typeof document !== 'undefined'

const Div = styled('div')({
  background: 'green',
  color: 'white',
  margin: 'auto',
  textAlign: 'center',
  fontSize: 30,
  height: 100,
});

export function makeStyles2(...args) {
  
  let rules = ''
  let serializedHashes = ''
  let hasRendered = false

  let css = () => {
    const cache = useEmotionCache();
    if (hasRendered && process.env.NODE_ENV !== 'production') {
      throw new Error('css can only be used during render')
    }
    let serialized = serializeStyles(args, cache.registered)
    if (isBrowser) {
      insertStyles(cache, serialized, false)
    } else {
      let res = insertStyles(cache, serialized, false)
      if (res !== undefined) {
        rules += res
      }
    }
    if (!isBrowser) {
      serializedHashes += ` ${serialized.name}`
    }
    return `${cache.key}-${serialized.name}`
  }
  return css;
}

const useStyles2 = makeStyles2({color: 'lightgreen'});

export default function App(){
  const classes = useStyles();
  const c = useStyles2();
  const result = useStylesTss({});
  const { classNames } = result;
  console.log(result);
  return (<>
    <Div className={classes.root}>Some content</Div>
    <Div className={c}>Some content</Div>
    <Div className={classNames.root}>Some content</Div>
  </>);
}