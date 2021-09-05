import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { validateArgInfoTokenVals } from './validateArgInfoTokenVals.js';
import { validateSubArgs } from './validateSubArgs.js';

export function validateArgs(commandInfo, logger) {
	if (commandInfo.args !== undefined) {
		if (!(commandInfo.args instanceof Array))
			logger(`Expected args to be an Array but got ${commandInfo.args}`);
		else {
			commandInfo.args.forEach(function(argInfo, index) {
				if (typeof argInfo !== 'object')
					logger(`Expected argInfo to be an object but got ${argInfo} at index ${index}`);
				else {
					if (typeof argInfo.name !== 'string')
						logger(`Expected argInfo.name to be a string but got ${argInfo.name} at index ${index}`);
					if (argInfo.subArgs !== undefined)
						validateSubArgs(commandInfo, argInfo.subArgs, prefixWrapper(`subArgs`, logger));
				}
				validateArgInfoTokenVals(argInfo, prefixWrapper(`tokenVals for args[${index}]`, logger));
			});
		}
	}
};