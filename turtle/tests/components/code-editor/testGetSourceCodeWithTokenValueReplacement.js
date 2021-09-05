import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { getSourceCodeWithTokenValueReplacement } from '../../../modules/components/code-editor/getSourceCodeWithTokenValueReplacement.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testGetSourceCodeWithTokenValueReplacement(logger) {
	const cases = [
	{'code': 'fd 100',
		'token': {
			'val': 100
		},
		'newVal': 100,
		'out': 'fd 100'
	},
	{'code': 'fd 100',
		'token': {
			'val': 100
		},
		'newVal': 23,
		'out': 'fd 23'
	},
	{'code': 'setFillColor "123',
		'token': {
			'val': '123'
		},
		'newVal': '#123',
		'out': 'setFillColor "#123'
	},
	{'code': 'setFillColor \'123\'',
		'token': {
			'val': '123'
		},
		'newVal': '#123',
		'out': 'setFillColor \'#123\''
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = cachedParseTree.getAllTokens();
		const token = findToken(caseInfo.token, tokens, plogger);
		const result = getSourceCodeWithTokenValueReplacement(caseInfo.code, token, caseInfo.newVal);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};