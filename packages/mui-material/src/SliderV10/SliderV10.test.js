import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import Slider from './index';

describe('<SliderV10 />', () => {
  const { render } = createRenderer();

  it('renders the selector and data-attribute contract', () => {
    const { container } = render(
      <Slider defaultValue={30} color="secondary" size="small" marks={[{ value: 0, label: '0' }]} />,
    );

    const root = container.querySelector('.MuiSlider-root');
    expect(root).not.to.equal(null);
    expect(root).to.have.attribute('data-orientation', 'horizontal');
    expect(root).to.have.attribute('data-color', 'secondary');
    expect(root).to.have.attribute('data-size', 'small');
    expect(root).to.have.attribute('data-track', 'normal');
    expect(root).to.have.attribute('data-marked');
    expect(root).not.to.have.attribute('data-disabled');

    expect(container.querySelector('.MuiSlider-rail')).not.to.equal(null);
    expect(container.querySelector('.MuiSlider-track')).not.to.equal(null);
    expect(container.querySelector('.MuiSlider-thumb')).not.to.equal(null);
    expect(container.querySelector('.MuiSlider-mark')).not.to.equal(null);
    expect(container.querySelector('.MuiSlider-markLabel')).not.to.equal(null);
  });

  it('exposes continuous values as inline CSS variables', () => {
    const { container } = render(<Slider value={[20, 60]} onChange={() => {}} />);

    const root = container.querySelector('.MuiSlider-root');
    expect(root.style.getPropertyValue('--Slider-track-offset')).to.equal('20%');
    expect(root.style.getPropertyValue('--Slider-track-leap')).to.equal('40%');

    const thumbs = container.querySelectorAll('.MuiSlider-thumb');
    expect(thumbs).to.have.length(2);
    expect(thumbs[0].style.getPropertyValue('--Slider-thumb-offset')).to.equal('20%');
    expect(thumbs[1].style.getPropertyValue('--Slider-thumb-offset')).to.equal('60%');
  });

  it('marks disabled state on the root and the hidden input', () => {
    const { container } = render(<Slider defaultValue={30} disabled />);

    expect(container.querySelector('.MuiSlider-root')).to.have.attribute('data-disabled');
    expect(container.querySelector('input[type="range"]')).to.have.property('disabled', true);
  });

  it('reflects the value label open state via data-open', () => {
    const { container } = render(<Slider defaultValue={30} valueLabelDisplay="on" />);

    const valueLabel = container.querySelector('.MuiSlider-valueLabel');
    expect(valueLabel).not.to.equal(null);
    expect(valueLabel).to.have.attribute('data-open');
    expect(valueLabel).to.have.text('30');
  });

  it('flags active marks with data-active', () => {
    const { container } = render(
      <Slider
        defaultValue={50}
        marks={[
          { value: 0, label: '0' },
          { value: 100, label: '100' },
        ]}
      />,
    );

    const marksEls = container.querySelectorAll('.MuiSlider-mark');
    expect(marksEls[0]).to.have.attribute('data-active');
    expect(marksEls[1]).not.to.have.attribute('data-active');
  });

  it('keeps the interaction behavior from useSlider', () => {
    const handleChange = spy();
    const { container } = render(<Slider defaultValue={30} onChange={handleChange} />);

    const input = container.querySelector('input[type="range"]');
    fireEvent.change(input, { target: { value: 31 } });

    expect(handleChange.callCount).to.equal(1);
    expect(handleChange.firstCall.args[1]).to.equal(31);
  });

  describe('composition API', () => {
    it('renders a custom composition with the same selector contract', () => {
      const { container } = render(
        <Slider.Root defaultValue={30} color="secondary">
          <Slider.Rail />
          <Slider.Track />
          <Slider.Thumb>
            <Slider.ValueLabel open>{(value) => `${value}%`}</Slider.ValueLabel>
          </Slider.Thumb>
        </Slider.Root>,
      );

      const root = container.querySelector('.MuiSlider-root');
      expect(root).to.have.attribute('data-color', 'secondary');
      expect(root).to.have.attribute('data-orientation', 'horizontal');
      expect(root.style.getPropertyValue('--Slider-track-leap')).to.equal('30%');
      expect(container.querySelector('.MuiSlider-rail')).not.to.equal(null);
      expect(container.querySelector('input[type="range"]')).not.to.equal(null);

      const valueLabel = container.querySelector('.MuiSlider-valueLabel');
      expect(valueLabel).to.have.attribute('data-open');
      expect(valueLabel).to.have.text('30%');
    });

    it('supports structural changes: no rail, extra thumb content', () => {
      const { container } = render(
        <Slider.Root defaultValue={[20, 60]}>
          <Slider.Track />
          <Slider.Thumb index={0}>
            <span className="custom-thumb-icon" />
          </Slider.Thumb>
          <Slider.Thumb index={1} />
        </Slider.Root>,
      );

      expect(container.querySelector('.MuiSlider-rail')).to.equal(null);
      expect(container.querySelectorAll('.MuiSlider-thumb')).to.have.length(2);
      expect(
        container.querySelector('.MuiSlider-thumb .custom-thumb-icon'),
      ).not.to.equal(null);
      expect(container.querySelectorAll('input[type="range"]')).to.have.length(2);
    });

    it('throws a helpful error when a part is used outside Slider.Root', () => {
      expect(() => render(<Slider.Rail />)).to.throw(
        'MUI: <Slider.Rail> must be used within <Slider.Root>.',
      );
    });
  });

  it('merges user className and style with the contract intact', () => {
    const { container } = render(
      <Slider defaultValue={30} className="volume-slider" style={{ '--Slider-color': 'hotpink' }} />,
    );

    const root = container.querySelector('.MuiSlider-root');
    expect(root).to.have.class('volume-slider');
    expect(root.style.getPropertyValue('--Slider-color')).to.equal('hotpink');
    // user style does not clobber the component-provided positioning vars
    expect(root.style.getPropertyValue('--Slider-track-leap')).to.equal('30%');
  });
});
