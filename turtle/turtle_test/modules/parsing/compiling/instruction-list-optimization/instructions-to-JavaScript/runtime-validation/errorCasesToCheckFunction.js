import { LogoRuntimeException } from '../../../../execution/LogoRuntimeException.js';

export function errorCasesToCheckFunction(errorCases, paramName, token) {
	if (errorCases.length === 1)
		return function(val) {
			if (errorCases[0] === val)
				throw new LogoRuntimeException(`${paramName} must not be ${val}`, token);
			else
				return val;
		};
	const vals = new Set(errorCases);
	return function(val) {
		if (vals.has(val))
			throw new LogoRuntimeException(`${paramName} must not be ${val}`, token);
		return val;
	};
};