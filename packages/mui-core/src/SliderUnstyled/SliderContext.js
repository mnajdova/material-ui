import * as React from 'react';

const SliderContext = React.createContext();
SliderContext.displayName = 'SliderContext';

export const useSliderContext = () => {
  const context = React.useContext(SliderContext);
  if (!context) {
    throw new Error("MUI: You are using useSliderContext outside of SliderUnstyled")
  }
  return context;
}

export default SliderContext;