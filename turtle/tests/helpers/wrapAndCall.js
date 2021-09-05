import { prefixWrapper } from './prefixWrapper.js';

export function wrapAndCall(functions, logger) {
	if (!functions instanceof Array)
		throw new Error(`functions must be an Array but got ${functions}`);
	if (functions.length === 0)
		throw new Error(`Expected at least 1 function to wrap but got 0`);
	if (typeof logger !== 'function')
		throw new Error(`Expected logger to be a function but got ${logger}`);
	functions.forEach(function(func) {
		func(prefixWrapper(func.name, logger));
	});
};