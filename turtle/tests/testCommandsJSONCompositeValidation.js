import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
const commands = await fetchJson('json/commands.json');

function validate2Args(commandInfo, info, logger) {
	if (typeof info !== 'object')
		logger(`info must be an object.  Not: ${info}`);
	else if (typeof info.arg1 !== 'string')
		logger(`arg1 must be a string.  Not ${info.arg1}`);
	else if (typeof info.arg2 !== 'string')
		logger(`arg2 must be a string.  Not ${info.arg2}`);
	else if (info.arg1 === info.arg2)
		logger(`arg1 and arg2 must have distinct names.  ${arg1} === ${arg2}`);
	else {
		if (!commandInfo.args.some(argInfo => argInfo.name === info.arg1))
			logger(`Unable to find argument named ${info.arg1}`);
		if (!commandInfo.args.some(argInfo => argInfo.name === info.arg2))
			logger(`Unable to find argument named ${info.arg2}`);
	}
}

function validateEqualLengthList(commandInfo, info, logger) {
	validate2Args(commandInfo, info, logger);
}

function validateNotEqual(commandInfo, info, logger) {
	validate2Args(commandInfo, info, logger);
}

const validatorsMap = new Map([
	['equalLengthList', validateEqualLengthList],
	['notEqual', validateNotEqual],
]);

export function testCommandsJSONCompositeValidation(logger) {
	commands.
		forEach(function(commandInfo) {
		if (commandInfo.compositeValidation === undefined)
			return;
		const plogger = prefixWrapper(`Command ${commandInfo.primaryName}`, logger);
		if (!(commandInfo.compositeValidation instanceof Array))
			plogger(`compositeValidation must either be undefined or an Array.  Not: ${commandInfo.compositeValidation}`);
		else {
			commandInfo.compositeValidation.forEach(function(validationInfo) {
				if (typeof validationInfo.type !== 'string')
					plogger(`type must be a string.  Not: ${validationInfo.type}`);
				else {
					const validator = validatorsMap.get(validationInfo.type);
					if (validator === undefined)
						plogger(`Unrecognized compositeValidation type: ${validationInfo.type}`);
					else {
						validator(commandInfo, validationInfo, prefixWrapper(validator.name, plogger));
					}
				}
			});
		}
	});
};