import { LogoRuntimeException } from '../../../../execution/LogoRuntimeException.js';

export function minMaxLenToCheckFunction(argInfo, paramName, token) {
	if (argInfo.minLen !== undefined && argInfo.maxLen !== undefined) {
		return function(val) {
			if (val.length < argInfo.minLen || val.length > argInfo.maxLen)
				throw new LogoRuntimeException(`${paramName} must have a length/count between ${argInfo.minLen} and ${argInfo.maxLen} but you gave something with a length of ${val.length}`, token);
			return val;
		};
	}
	else if (argInfo.minLen !== undefined) {
		return function(val) {
			if (val.length < argInfo.minLen)
				throw new LogoRuntimeException(`${paramName} must have a length/count of at least ${argInfo.minLen} but you gave something with a length of ${val.length}`, token);
			return val;
		};
	}
	return function(val) {
		if (val.length > argInfo.maxLen)
			throw new LogoRuntimeException(`${paramName} must have a length/count of at most ${argInfo.maxLen} but you gave something with a length of ${val.length}`, token);
		return val;
	};
};