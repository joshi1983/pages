import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateBool(val) {
	if (typeof val !== 'boolean')
		throw new LogoRuntimeException('Bool required.  Value given is ' + val);
	return val;
};