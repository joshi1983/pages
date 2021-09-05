import { Command } from
'../../../../../../../modules/parsing/Command.js';
import { fitToDefinedCommands } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/fitToDefinedCommands.js';
import { processScanTokenProcessCases } from
'./processScanTokenProcessCases.js';

await Command.asyncInit();

export function testFitToDefinedCommands(logger) {
	const cases = [
		{'code': 'center', 'tokens': ['center']},
		{'code': 'center.', 'tokens': ['center']},
		{'code': 'center....', 'tokens': ['center']},
		{'code': 'center3', 'tokens': ['center']},
		{'code': 'center.3.', 'tokens': ['center']},
	];
	processScanTokenProcessCases(cases, fitToDefinedCommands, logger);
};