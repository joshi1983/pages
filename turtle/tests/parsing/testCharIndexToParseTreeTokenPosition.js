import { charIndexToParseTreeTokenPosition } from '../../modules/parsing/charIndexToParseTreeTokenPosition.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testCharIndexToParseTreeTokenPosition(logger) {
	const cases = [
		{'in': [ 1, 'hello'], 'out': {'colIndex': 1, 'lineIndex': 0}},
		{'in': [ 1, '\nhello'], 'out': {'colIndex': 0, 'lineIndex': 1}},
		{'in': [ 0, 'hello'], 'out': {'colIndex': 0, 'lineIndex': 0}},
		{'in': [ 2, '\n\n\n\nhello'], 'out': {'colIndex': 0, 'lineIndex': 2}},
		{'in': [ 4, 'fd 5\nprint "hi'], 'out': {'colIndex': 4, 'lineIndex': 0}},
		{'in': [ 7, 'fd 5\nprint "hi'], 'out': {'colIndex': 2, 'lineIndex': 1}},
	];
	cases.forEach(function(caseInfo, index) {
		const result = charIndexToParseTreeTokenPosition(...caseInfo.in);
		const plogger = prefixWrapper('Case ' + index + ' with in: ' + JSON.stringify(caseInfo.in), logger);
		if (result.colIndex !== caseInfo.out.colIndex)
			plogger(`Expected colIndex of ${caseInfo.out.colIndex} but got ${result.colIndex}`);
		if (result.lineIndex !== caseInfo.out.lineIndex)
			plogger(`Expected lineIndex of ${caseInfo.out.lineIndex} but got ${result.lineIndex}`);
	});
};