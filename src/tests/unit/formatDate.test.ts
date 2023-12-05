import { expect } from 'chai';
import { describe, it } from 'mocha';
import { formatDate } from '../../utils/formatDate';

describe('[unit] Utils - formatDate', () => {
  it('should format correctly into a valid date', () => {
    const date = '20210324';
    const expected = '2021-03-24';
    const result = formatDate(date);
    expect(result).to.equal(expected);
  });

  it('should throw an error when input format is invalid', () => {
    const date = '2021-03-24';
    expect(() => formatDate(date)).to.throw(
      'Formato de data inválido. Esperado AAAAMMDD.',
    );
  });
});
