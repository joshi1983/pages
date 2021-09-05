import { quotedParameterFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/quotedParameterFixer.js';
import { processTestCases } from './processTestCases.js';

export function testQuotedParameterFixer(logger) {
	const cases = [
		{'code': 'to p\nend', 'logged': false},
		{'code': 'to p "x\nend', 'to': 'to p :x\nend', 'ignoreParseErrors': true, 'logged': true},
		{'code': 'to p "x "y\nend', 'to': 'to p :x :y\nend', 'ignoreParseErrors': true, 'logged': true},
	];
	processTestCases(cases, quotedParameterFixer, logger);
};