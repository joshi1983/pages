import { Command } from '../../modules/parsing/Command.js';
import { isNumber } from '../../modules/isNumber.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await Command.asyncInit();

export function testCommandsJSONLengthRangeInfo(logger) {
	const commands = Command.getAllCommandsInfo();
	commands.forEach(function(info) {
		if (info.returnLengthInfo !== undefined) {
			const plogger = prefixWrapper(`Command ${info.primaryName}`, logger);
			const returnLengthInfo = info.returnLengthInfo;
			if (typeof returnLengthInfo !== 'object')
				plogger(`Expected either undefined or an object but got ${rangeLengthInfo}`);
			else if (returnLengthInfo === null)
				plogger(`Expected either undefined or an object but got null`);
			else if (returnLengthInfo.max === undefined && returnLengthInfo.min === undefined)
				plogger(`Expected either max or min to be specified but got ${returnLengthInfo}`);
			else if (returnLengthInfo.max !== undefined && !isNumber(returnLengthInfo.max))
				plogger(`returnLengthInfo.max must be a number or be left undefined but got ${returnLengthInfo.max}`);
			else if (returnLengthInfo.min !== undefined && !isNumber(returnLengthInfo.min))
				plogger(`returnLengthInfo.min must be a number or be left undefined but got ${returnLengthInfo.min}`);
		}
	});
};