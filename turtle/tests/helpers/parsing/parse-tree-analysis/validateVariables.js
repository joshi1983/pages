import { validateVariable } from './validateVariable.js';

export function validateVariables(variables, logger) {
	if (typeof logger !== 'function')
		throw new Error('logger must be a function but got ' + logger);
	const varArray = variables.getAllVariablesAsArray();
	varArray.forEach(function(variable) {
		validateVariable(variable, logger);
	});
};