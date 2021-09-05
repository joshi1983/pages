import { Command } from
'../../../../modules/parsing/Command.js';
await Command.asyncInit();

import { getImportStatements } from
'../../../../modules/parsing/compiling/to-js/getImportStatements.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testGetImportStatements(logger) {
	const cases = [
		{'in': '', 'out': ''},
	];
	testInOutPairs(cases, getImportStatements, logger);
};