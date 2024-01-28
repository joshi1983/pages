import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateString(val) {
	if (typeof val !== 'string')
		throw new LogoRuntimeException('String required.  Value given is ' + val);
	return val;
};