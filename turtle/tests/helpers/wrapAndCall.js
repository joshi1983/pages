import { exceptionToString } from '../../modules/exceptionToString.js';
import { prefixWrapper } from './prefixWrapper.js';

export async function wrapAndCall(functions, logger) {
	if (!functions instanceof Array)
		throw new Error(`functions must be an Array but got ${functions}`);
	if (functions.length === 0)
		throw new Error(`Expected at least 1 function to wrap but got 0`);
	if (typeof logger !== 'function')
		throw new Error(`Expected logger to be a function but got ${logger}`);
	const prefixArgs = [];
	for (let i = 2; i < arguments.length; i++) {
		prefixArgs.push(arguments[i]);
	}
	for (const func of functions) {
		const plogger = prefixWrapper(func.name, logger);
		try {
			const result = func(...prefixArgs, plogger);
			if (result instanceof Promise)
				await result;
		} catch (e) {
			console.error(e);
			plogger(`Caught error ${exceptionToString(e)}`);
		}
	}
};