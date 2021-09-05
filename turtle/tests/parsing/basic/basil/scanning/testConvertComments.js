import { processScanTokensTestCases } from './processScanTokensTestCases.js';
import { convertComments } from
'../../../../../modules/parsing/basic/basil/scanning/convertComments.js';

export function testConvertComments(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': `// comment`, 'tokens': ['REM comment']},
		{'code': `//  comment`, 'tokens': ['REM  comment']},
		{'code': `// comment  after double space`, 'tokens': ['REM comment  after double space']},
	];
	processScanTokensTestCases(cases, convertComments, logger);
};