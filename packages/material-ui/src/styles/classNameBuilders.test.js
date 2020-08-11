import { expect } from 'chai';
import { getClassWithKeyOnly, getClassWithValueAndKey } from './classNameBuilders';

describe('classNameBuilders', () => {
  describe('getClassWithKeyOnly', () => {
    it('should create classname using the prefix and the key if the value is truthy', () => {
      expect(getClassWithKeyOnly(true, 'disabled', 'MuiTest__root')).to.equal(
        'MuiTest__root--disabled',
      );
    });

    it('should return empty string it he value is undefined', () => {
      expect(getClassWithKeyOnly(undefined, 'disabled', 'MuiTest__root')).to.equal();
    });

    it('should return empty string it he value is null', () => {
      expect(getClassWithKeyOnly(null, 'disabled', 'MuiTest__root')).to.equal();
    });
  });

  describe('getClassWithValueAndKey', () => {
    it('should create classname using the prefix, the key and the value if the value is truthy', () => {
      expect(getClassWithValueAndKey('primary', 'color', 'MuiTest__root')).to.equal(
        'MuiTest__root--color-primary',
      );
    });

    it('should return empty string it he value is undefined', () => {
      expect(getClassWithValueAndKey(undefined, 'color', 'MuiTest__root')).to.equal();
    });

    it('should return empty string it he value is null', () => {
      expect(getClassWithValueAndKey(null, 'color', 'MuiTest__root')).to.equal();
    });
  });
});
