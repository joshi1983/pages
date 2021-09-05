import { getStartPositionOfToken } from '../../modules/parsing/getStartPositionOfToken.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { Token } from '../../modules/parsing/Token.js';

export function testGetStartPositionOfToken(logger) {
	const cases = [
		{'code': 'penDown', 's': 'penDown', 'colIndex': 6, 'lineIndex': 0,
		'result': [0, 0]},
		{'code': ' penDown', 's': 'penDown', 'colIndex': 7, 'lineIndex': 0,
		'result': [1, 0]},
		{'code': '  penDown', 's': 'penDown', 'colIndex': 8, 'lineIndex': 0,
		'result': [2, 0]},
		{'code': '\npenDown', 's': 'penDown', 'colIndex': 6, 'lineIndex': 1,
		'result': [0, 1]},
		{'code': ' \n', 's': '\n', 'colIndex': 1, 'lineIndex': 0,
		'result': [1, 0]},
		{'code': ' \n', 's': ' \n', 'colIndex': 0, 'lineIndex': 0,
		'result': [0, 0]},
		{'code': '  \n', 's': ' \n', 'colIndex': 1, 'lineIndex': 0,
		'result': [1, 0]},
		{'code': '\n\n', 's': '\n\n', 'colIndex': 0, 'lineIndex': 1,
		'result': [0, 0]},
		{'code': '\n\n \n', 's': '\n \n', 'colIndex': 0, 'lineIndex': 2,
		'result': [0, 1]},
		{'code': '4\n', 's': '\n', 'colIndex': 1, 'lineIndex': 0,
		'result': [1, 0]},
		{'code': '4\n', 's': '4', 'colIndex': 0, 'lineIndex': 0,
		'result': [0, 0]},
		{'code': '4\n ', 's': '\n ', 'colIndex': 0, 'lineIndex': 1,
		'result': [1, 0]},
		{'code': '\n\n\n', 's': '\n', 'colIndex': 0, 'lineIndex': 2,
		'result': [0, 2]},
		{'code': '\n\n\n', 's': '\n', 'colIndex': 0, 'lineIndex': 1,
		'result': [0, 1]},
		{'code': '\n\n\n', 's': '\n', 'colIndex': 0, 'lineIndex': 0,
		'result': [0, 0]},
		{'code': '\n \n\n', 's': '\n', 'colIndex': 1, 'lineIndex': 1,
		'result': [1, 1]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}, token.s="${caseInfo.s}"`, logger);
		const token = new Token(caseInfo.s, caseInfo.colIndex, caseInfo.lineIndex);
		const result = getStartPositionOfToken(token, caseInfo.code);
		if (result[0] !== caseInfo.result[0])
			plogger(`Expected result[0] to be ${caseInfo.result[0]} but got ${result[0]}`);
		if (result[1] !== caseInfo.result[1])
			plogger(`Expected result[1] to be ${caseInfo.result[1]} but got ${result[1]}`);
	});
};