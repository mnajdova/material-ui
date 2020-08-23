import { expect } from 'chai';
import { getClassWithKeyOnly, getClassWithValueAndKey } from './classNameBuilders';

describe('classNameBuilders', () => {
  describe('getClassWithKeyOnly', () => {
    it('should create classname using the prefix and the key if the value is truthy', () => {
      expect(getClassWithKeyOnly(true, 'disabled', 'MuiTest-')).to.equal(
        'MuiTest-disabled',
      );
    });

    it('should return empty string it he value is undefined', () => {
      expect(getClassWithKeyOnly(undefined, 'disabled', 'MuiTest-')).to.equal('');
    });

    it('should return empty string it he value is null', () => {
      expect(getClassWithKeyOnly(null, 'disabled', 'MuiTest-')).to.equal('');
    });
  });

  describe('getClassWithValueAndKey', () => {
    it('should create classname using the prefix, the key and the value if the value is truthy', () => {
      expect(getClassWithValueAndKey('primary', 'color', 'MuiTest-')).to.equal(
        'MuiTest-colorPrimary',
      );
    });

    it('should return empty string it he value is undefined', () => {
      expect(getClassWithValueAndKey(undefined, 'color', 'MuiTest-')).to.equal('');
    });

    it('should return empty string it he value is null', () => {
      expect(getClassWithValueAndKey(null, 'color', 'MuiTest-')).to.equal('');
    });
  });
});
