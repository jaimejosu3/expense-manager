import { CurrencyFormatPipe } from './currency-format.pipe';

describe('CurrencyFormatPipe', () => {
  const pipe = new CurrencyFormatPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms number to currency format', () => {
    expect(pipe.transform(1234.56)).toBe('$1,234.56');
  });
});