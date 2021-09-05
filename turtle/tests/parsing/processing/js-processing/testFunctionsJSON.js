import { fetchJson } from '../../../../modules/fetchJson.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function validateTypes(types, logger, nullAllowed) {
	if (nullAllowed && types === null)
		return; // no problem.
	if (typeof types !== 'string')
		logger(`types must be a string but found ${types}`);
}

function validateArgs(args, logger) {
	args.forEach(function(argInfo, index) {
		const plogger = prefixWrapper(`Argument ${index}`, logger);
		if (typeof argInfo !== 'object')
			plogger(`Every element in args must be an object but found ${argInfo}`);
		else {
			if (typeof argInfo.name !== 'string')
				plogger(`name must be a string but found ${argInfo.name}`);
			if (argInfo.types !== undefined) {
				const types = argInfo.types;
				validateTypes(argInfo.types, prefixWrapper('argument types', plogger), false);
			}
		}
	});
}

function validateArgCount(argCount, logger) {
	if (typeof argCount !== 'object')
		logger(`argCount must be an object but found ${argCount}`);
	else {
		if (!Number.isInteger(argCount.min))
			logger(`min must be an integer but found ${argCount.min}`);
		if (!Number.isInteger(argCount.max))
			logger(`max must be an integer but found ${argCount.max}`);
	}
}

export async function testFunctionsJSON(logger) {
	const data = await fetchJson('json/logo-migrations/processing/js-processing/functions.json');
	if (!(data instanceof Array))
		logger(`Expected Array but found ${data}`);
	else {
		data.forEach(function(functionInfo, index) {
			let plogger = prefixWrapper(`index: ${index}`, logger);
			if (typeof functionInfo !== 'object')
				plogger(`Function information should be in an object but found ${functionInfo}`);
			else {
				plogger = prefixWrapper(`Function name ${functionInfo.name}`, plogger);
				if (typeof functionInfo.name !== 'string')
					plogger(`The name of a function must be a string but found ${functionInfo.name}`);
				else if (index !== 0 &&
				typeof data[index - 1] === 'object' &&
				typeof data[index - 1].name === 'string' &&
				data[index - 1].name > functionInfo.name) {
					plogger(`Function pair is out of order. ${data[index - 1].name} should be after ${functionInfo.name}.`);
				}
				if (functionInfo.translateAllParametersToSingleColor !== undefined) {
					if (typeof functionInfo.translateAllParametersToSingleColor !== 'boolean') {
						plogger(`translateAllParametersToSingleColor must either be undefined or a boolean but `
						+ `found ${functionInfo.translateAllParametersToSingleColor}`);
					}
				}
				if (functionInfo.args !== undefined) {
					const args = functionInfo.args;
					if (!(args instanceof Array))
						plogger(`args must be an Array but found ${args}`);
					else {
						validateArgs(args, plogger);
					}
				}
				if (functionInfo.argCount !== undefined) {
					validateArgCount(functionInfo.argCount, plogger);
				}
				if (functionInfo.returnTypes !== undefined) {
					validateTypes(functionInfo.returnTypes, prefixWrapper('returnTypes', plogger), true);
				}
			}
		});
	}
};