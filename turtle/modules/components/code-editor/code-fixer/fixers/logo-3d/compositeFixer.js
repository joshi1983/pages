import { clashingProcedureNameFixer } from '../clashingProcedureNameFixer.js';
import { colourStringLiteralFixer } from '../colourStringLiteralFixer.js';
import { geosphereFixer } from './geosphereFixer.js';
import { gotoFixer } from './gotoFixer.js';
import { ifElseStatementFixer } from './ifElseStatementFixer.js';
import { instructionListSquareBracketsRemoveFixer } from '../instructionListSquareBracketsRemoveFixer.js';
import { logo3DReplacementFixer } from './logo3DReplacementFixer.js';
import { makeAssignFixer } from '../makeAssignFixer.js';
import { procedureNameTypeFixer } from '../procedureNameTypeFixer.js';
import { removeErroneousNumbersFixer } from './removeErroneousNumbersFixer.js';
import { removeImportsFixer } from './removeImportsFixer.js';
import { removeUnusedMarkCalls } from './removeUnusedMarkCalls.js';
import { timeoutFixer } from './timeoutFixer.js';

const fixers = [
makeAssignFixer,
logo3DReplacementFixer,
procedureNameTypeFixer,
removeImportsFixer,
timeoutFixer,
geosphereFixer,
ifElseStatementFixer,
removeErroneousNumbersFixer,
removeUnusedMarkCalls,
gotoFixer,
clashingProcedureNameFixer,
colourStringLiteralFixer,
instructionListSquareBracketsRemoveFixer,
];

export function compositeFixer(cachedParseTree, fixLogger) {
	fixers.forEach(function(fixer) {
		fixer(cachedParseTree, fixLogger);
	});
};