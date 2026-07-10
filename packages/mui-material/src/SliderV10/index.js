import Slider from './Slider';
import {
  SliderRoot,
  SliderRail,
  SliderTrack,
  SliderMarks,
  SliderThumb,
  SliderValueLabel,
} from './parts';

// Namespace pattern: <Slider /> is the precomposed component, the parts it is
// built from hang off it (composition RFC, open question 1).
Slider.Root = SliderRoot;
Slider.Rail = SliderRail;
Slider.Track = SliderTrack;
Slider.Marks = SliderMarks;
Slider.Thumb = SliderThumb;
Slider.ValueLabel = SliderValueLabel;

export default Slider;
