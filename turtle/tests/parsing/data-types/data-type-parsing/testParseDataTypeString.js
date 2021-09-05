import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { parseDataTypeString } from '../../../../modules/parsing/data-types/data-type-parsing/parseDataTypeString.js';
import { toString } from '../../../../modules/parsing/data-types/data-type-parsing/toString.js';

function countTokens(token) {
	let result = 1;
	for (let i = 0; i < token.children.length; i++) {
		result += countTokens(token.children[i]);
	}
	return result;
}

function getHeight(token) {
	let result = 0;
	for (let i = 0; i < token.children.length; i++) {
		result = Math.max(result, getHeight(token.children[i]));
	}
	return 1 + result;
}

export function testParseDataTypeString(logger) {
	const cases = [
	{'in': '*', 'tokenCount': 2, 'rootChildCount': 1, 'height': 2},
	{'in': 'num', 'tokenCount': 2, 'rootChildCount': 1, 'height': 2},
	{'in': 'list|num', 'tokenCount': 3, 'rootChildCount': 2, 'height': 2},
	{'in': 'list|num|string', 'tokenCount': 4, 'rootChildCount': 3, 'height': 2},
	{'in': 'list<num>|num', 'tokenCount': 5, 'rootChildCount': 2, 'height': 4},
	{'in': 'list<list<num>>|num', 'tokenCount': 7, 'rootChildCount': 2, 'height': 6},
	{'in': 'list', 'tokenCount': 2, 'rootChildCount': 1, 'height': 2},
	{'in': 'list<>', 'tokenCount': 2, 'rootChildCount': 1, 'height': 2, 'str': 'list'},
	{'in': 'list()', 'tokenCount': 2, 'rootChildCount': 1, 'height': 2, 'str': 'list'},
	{'in': 'list(minlen=3)', 'tokenCount': 6, 'rootChildCount': 1, 'height': 5},
	{'in': 'list<list<int>(minlen=2)>(minlen=2)', 'tokenCount': 14, 'rootChildCount': 1, 'height': 7},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in: ${caseInfo.in}`, logger);
		const result = parseDataTypeString(caseInfo.in);
		const count = countTokens(result);
		const height = getHeight(result);
		const str = toString(result);
		const expectedStr = caseInfo.str === undefined ? caseInfo.in : caseInfo.str;
		if (count !== caseInfo.tokenCount)
			plogger(`Expected ${caseInfo.tokenCount} tokens but got ${count}`);
		if (height !== caseInfo.height)
			plogger(`Expected height to be ${caseInfo.height} but got ${height}`);
		if (result.children.length !== caseInfo.rootChildCount)
			plogger(`Expected result.children.length to be ${caseInfo.rootChildCount} but got ${result.children.length}`);
		if (str !== expectedStr)
			plogger(`Expected toString to return ${expectedStr} but got ${str}`);
	});
};