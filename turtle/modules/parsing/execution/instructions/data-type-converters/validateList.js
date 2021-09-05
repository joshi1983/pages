import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateList(val) {
	if (!(val instanceof Array))
		throw new LogoRuntimeException('List required.  Value given is ' + val);
	return val;
};