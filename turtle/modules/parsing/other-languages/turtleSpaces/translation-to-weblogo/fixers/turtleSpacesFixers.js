import { arrayLiteralFixer } from
'../../../../../components/code-editor/code-fixer/fixers/arrayLiteralFixer.js';
import { clashingProcedureNameFixer } from
'../../../../../components/code-editor/code-fixer/fixers/clashingProcedureNameFixer.js';
import { foreachFixer } from
'./foreachFixer.js';
import { forLoopVariableFixer } from
'../../../../../components/code-editor/code-fixer/fixers/forLoopVariableFixer.js';
import { localFixer } from
'../../../../../components/code-editor/code-fixer/fixers/localFixer.js';
import { repAboveFixer } from
'./repAboveFixer.js';

const fixers = [
	arrayLiteralFixer,
	clashingProcedureNameFixer,
	foreachFixer,
	forLoopVariableFixer,
	localFixer,
	repAboveFixer,
];

export function turtleSpacesFixers(cachedParseTree, fixLogger) {
	for (const fixer of fixers) {
		fixer(cachedParseTree, fixLogger);
	}
};