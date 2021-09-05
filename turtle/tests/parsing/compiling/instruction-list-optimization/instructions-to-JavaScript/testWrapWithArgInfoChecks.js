import { Command } from '../../../../../modules/parsing/Command.js';
import { createRootToken } from '../../../../helpers/createRootToken.js';
import { wrapWithArgInfoChecks } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/wrapWithArgInfoChecks.js';
await Command.asyncInit();
const token = createRootToken();

export function testWrapWithArgInfoChecks(logger) {
	const circleCommand = Command.getCommandInfo('circle');
	const argInfo = circleCommand.args[0];
	const code = '0';
	const commandPrimaryName = circleCommand.primaryName;
	const token = createRootToken();
	const result = wrapWithArgInfoChecks(code, argInfo, commandPrimaryName, token);
	if ((typeof result) !== 'object')
		logger(`Expected an object but got ${result}`);
};