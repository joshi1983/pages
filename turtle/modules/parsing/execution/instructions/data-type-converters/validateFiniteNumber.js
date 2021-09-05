import { LogoRuntimeException } from '../../LogoRuntimeException.js';

export function validateFiniteNumber(val) {
	if (val === Infinity || val === -Infinity)
		throw new LogoRuntimeException('A finite number required.  Value given is ' + val);
	if (typeof val !== 'number' || isNaN(val))
		throw new LogoRuntimeException('Finite number required.  Value given is ' + val + ' which is not a number of any kind.');
	return val;
};