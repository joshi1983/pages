import { clamp } from '../../../../clamp.js';

export class SmartRounder {
	constructor(maxRoundingError) {
		if (typeof maxRoundingError !== 'number')
			throw new Error('maxRoundingError must be a number.  Got: ' + maxRoundingError);
		this.maxRoundingError = maxRoundingError;
		const decimals = -Math.log10(maxRoundingError);
		this.maxDecimalPlaces = 1 + clamp(decimals, 3, 8);
	}

	formatNumber(val) {
		if (Math.abs(val) < this.maxRoundingError)
			return '0';
		let s = '' + val;
		const decimalIndex = s.indexOf('.');
		if (s.indexOf('e') === -1 && decimalIndex !== -1) {
			// chop off some characters at the end if they're beyond the maxDecimalPlaces limit.
			if (s.length - decimalIndex > this.maxDecimalPlaces) {
				s = val.toFixed(this.maxDecimalPlaces);

				// remove any trailing 0's.
				for (let i = s.length - 1; i > 0; i--) {
					const c = s[i];
					if (c !== '0') {
						if (i < s.length - 1)
							s = s.substring(0, i + 1);
						break;
					}
				}
			}
		}
		if (s.endsWith('.'))
			return s.substring(0, s.length - 1); // remove the trailing '.'.
		else
			return s;
	}
};