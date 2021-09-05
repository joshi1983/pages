import { argInfoToCheckFunction } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/argInfoToCheckFunction.js';
import { Command } from '../../../../../modules/parsing/Command.js';
import { createRootToken } from '../../../../helpers/createRootToken.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
await Command.asyncInit();
const token = createRootToken();

export function testArgInfoToCheckFunction(logger) {
	Command.getAllCommandsInfo().
		filter(info => info.args.some(argInfo => argInfo.errorCases !== undefined)).
		forEach(function(info) {
			const plogger = prefixWrapper(`Command ${info.primaryName}`, logger);
			info.args.filter(argInfo => argInfo.errorCases !== undefined).
			forEach(function(argInfo) {
				const result = argInfoToCheckFunction(argInfo, '', token);
				if (typeof result !== 'function')
					plogger(`Expected function but got ${result}`);
			});
		});
};