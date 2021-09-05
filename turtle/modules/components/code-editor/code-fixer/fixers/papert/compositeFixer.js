import { clashingProcedureNameFixer } from '../clashingProcedureNameFixer.js';
import { colorCallWithDataListFixer } from '../colorCallWithDataListFixer.js';
import { minusSignSpaceInsertFixer } from '../minusSignSpaceInsertFixer.js';
import { papertReplacementFixer } from './papertReplacementFixer.js';
import { penWidthCallWithValueFixer } from '../penWidthCallWithValueFixer.js';
import { variableReadSpaceInsertFixer } from '../variableReadSpaceInsertFixer.js';

const fixers = [
clashingProcedureNameFixer,
colorCallWithDataListFixer,
minusSignSpaceInsertFixer,
papertReplacementFixer,
penWidthCallWithValueFixer,
variableReadSpaceInsertFixer
];

export function compositeFixer(cachedParseTree, fixLogger) {
	fixers.forEach(function(fixer) {
		fixer(cachedParseTree, fixLogger);
	});
};