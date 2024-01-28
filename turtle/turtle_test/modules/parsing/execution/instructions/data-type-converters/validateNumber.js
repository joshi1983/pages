import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateNumber(val) {
	if (typeof val !== 'number' || isNaN(val))
		throw new LogoRuntimeException('Number required.  Value given is ' + val);
	return val;
};