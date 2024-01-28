import { formatNumber } from '../../../formatNumber.js';
import { isNumber } from '../../../isNumber.js';

export class SimpleDisplay {
	constructor(val) {
		if (typeof val !== 'string' && typeof val !== 'number' && typeof val !== 'boolean')
			throw new Error('val must be either a number or a string.  Not: ' + val);
		this.val = val;
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('simple-display');
			if (typeof this.val === 'boolean')
				this.div.classList.add('boolean');
			let v = '' + this.val;
			if (isNumber(this.val))
				v = formatNumber(this.val, 2);
			this.div.innerText = v;
		}
		return this.div;
	}
};