import { LogoRuntimeException } from '../../../../execution/LogoRuntimeException.js';

export function minMaxToCheckFunction(argInfo, paramName, token) {
	if (argInfo.min !== undefined && argInfo.max !== undefined) {
		return function(val) {
			if (val < argInfo.min || val > argInfo.max)
				throw new LogoRuntimeException(`${paramName} must be between ${argInfo.min} and ${argInfo.max} but you specified ${val}`, token);
			return val;
		};
	}
	if (argInfo.min !== undefined) {
		return function(val) {
			if (val < argInfo.min)
				throw new LogoRuntimeException(`${paramName} must not be less than ${argInfo.min} but you specified ${val}`, token);
			return val;
		};
	}
	else
		return function(val) {
			if (val > argInfo.max)
				throw new LogoRuntimeException(`${paramName} must not be greater than ${argInfo.max} but you specified ${val}`, token);
			return val;
		};
};