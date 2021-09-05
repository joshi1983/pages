import { errorCasesToCheckFunction } from './runtime-validation/errorCasesToCheckFunction.js';
import { minMaxLenToCheckFunction } from './runtime-validation/minMaxLenToCheckFunction.js';
import { minMaxToCheckFunction } from './runtime-validation/minMaxToCheckFunction.js';

export function needsArgInfoCheck(argInfo) {
	return argInfo.errorCases !== undefined ||
		argInfo.min !== undefined ||
		argInfo.max !== undefined ||
		argInfo.minLen !== undefined ||
		argInfo.maxLen !== undefined;
};

export function argInfoToCheckFunction(argInfo, paramName, token) {
	if (typeof argInfo !== 'object')
		throw new Error('argInfo expected to be an object but got ' + argInfo);
	if (needsArgInfoCheck(argInfo) === false)
		return function(val) { return val; };
	const errorCases = argInfo.errorCases;
	const checkFunctions = [];
	if (errorCases !== undefined && errorCases.length > 0) {
		checkFunctions.push(errorCasesToCheckFunction(errorCases, paramName, token));
	}
	if (argInfo.min !== undefined || argInfo.max !== undefined) {
		checkFunctions.push(minMaxToCheckFunction(argInfo, paramName, token));
	}
	if (argInfo.minLen !== undefined || argInfo.maxLen !== undefined) {
		checkFunctions.push(minMaxLenToCheckFunction(argInfo, paramName, token));
	}

	if (checkFunctions.length === 1)
		return checkFunctions[0];
	else if (checkFunctions.length === 2)
		return function(val) {
			return checkFunctions[1](checkFunctions[0](val));
		}; // for a little extra performance than the loop below.
	else
		return function(val) {
			for (let i = 0; i < checkFunctions.length; i++) {
				val = checkFunctions[i](val);
			}
			return val;
		};
};