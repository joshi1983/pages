import { processScanTokensTestCases } from
'../basil/scanning/processScanTokensTestCases.js';
import { convertDoubleSlashSingleLineComments } from
'../../../../../modules/parsing/other-languages/basic/helpers/convertDoubleSlashSingleLineComments.js';

export function testConvertDoubleSlashSingleLineComments(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': `// comment`, 'tokens': ['REM comment']},
		{'code': `//  comment`, 'tokens': ['REM  comment']},
		{'code': `// comment  after double space`, 'tokens': ['REM comment  after double space']},
	];
	processScanTokensTestCases(cases, convertDoubleSlashSingleLineComments, logger);
};