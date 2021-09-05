import { geosphereFixer } from './geosphereFixer.js';
import { gotoFixer } from './gotoFixer.js';
import { ifElseStatementFixer } from './ifElseStatementFixer.js';
import { logo3DReplacementFixer } from './logo3DReplacementFixer.js';
import { makeAssignFixer } from '../makeAssignFixer.js';
import { removeImportsFixer } from './removeImportsFixer.js';
import { removeUnusedMarkCalls } from './removeUnusedMarkCalls.js';
import { timeoutFixer } from './timeoutFixer.js';

const fixers = [
makeAssignFixer,
logo3DReplacementFixer,
removeImportsFixer,
timeoutFixer,
geosphereFixer,
ifElseStatementFixer,
removeUnusedMarkCalls,
gotoFixer
];

export function compositeFixer(cachedParseTree, fixLogger) {
	fixers.forEach(function(fixer) {
		fixer(cachedParseTree, fixLogger);
	});
};