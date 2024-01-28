import { argInfoToCheckFunction, needsArgInfoCheck } from './argInfoToCheckFunction.js';
import { isSafeToNotErrorCheck } from './isSafeToNotErrorCheck.js';
let counter = 0;

/*
Do not call this for production.
*/
export function wrapWithArgInfoChecks(code, argInfo, commandPrimaryName, token) {
	if (needsArgInfoCheck(argInfo) === false)
		return {
			'code': code,
			'namedFunctionsMap': new Map()
		}; // never do error case checks for production.
	let paramName;
	if (argInfo.name === undefined)
		paramName = `A parameter to command ${commandPrimaryName}`;
	else
		paramName = `Parameter ${argInfo.name} in command ${commandPrimaryName}`;
	const func = argInfoToCheckFunction(argInfo, paramName, token);
	if (isSafeToNotErrorCheck(code, func))
		return {'code': code,
		'namedFunctionsMap': new Map()
		};
	const funcName = `errorCaseCheck${counter++}`;
	return {
		'code': `this.${funcName}(${code})`,
		'namedFunctionsMap': new Map([[funcName, func]])
	};
};