import { Command } from '../../../../modules/parsing/Command.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { validateDataTypeString } from '../../../../modules/parsing/data-types/data-type-parsing/validateDataTypeString.js';

export function testValidateTypesInCommands(logger) {
	const commandData = Command.getAllCommandsInfo();
	commandData.forEach(function(commandInfo, index) {
		const plogger = prefixWrapper(`Command ${commandInfo.primaryName}`, logger);
		if (commandInfo.returnTypes !== null) {
			const msg = validateDataTypeString(commandInfo.returnTypes);
			if (msg !== undefined)
				plogger(`Invalid returnTypes found with message: ${msg}`);
		}
		commandInfo.args.forEach(function(argInfo) {
			const msg = validateDataTypeString(argInfo.types);
			if (msg !== undefined)
				plogger(`Invalid types(${argInfo.types}) found with message: ${msg}`);
		});
	});
};