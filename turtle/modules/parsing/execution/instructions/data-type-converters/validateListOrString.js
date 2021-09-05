import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateListOrString(val) {
	if (val instanceof Array || typeof val === 'string')
		return val;
	else
		throw new LogoRuntimeException('List or string required.  Value given is ' + val);
};