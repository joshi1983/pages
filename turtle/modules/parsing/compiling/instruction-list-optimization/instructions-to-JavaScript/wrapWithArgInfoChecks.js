import { argInfoToCheckFunction, needsArgInfoCheck } from './argInfoToCheckFunction.js';
import { isSafeToNotErrorCheck } from './isSafeToNotErrorCheck.js';
let counter = 0;

/*
Do not call this for production because they are intended for debugging/troubleshooting purposes only.
They assume the developer is able to respond appropriately to problems by fixing the code.
If these checks are run by someone else who isn't going to fix the code, it just wastes processing time and
risks halting a program that would otherwise work.
A failed check almost always indicates a failure would eventually happen anyway but
WebLogo isn't bug-free and just might indicate a problem that never would have happened without the check.
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