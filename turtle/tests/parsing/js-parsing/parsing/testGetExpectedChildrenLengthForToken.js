import { getExpectedChildrenLengthForToken } from
'../../../../modules/parsing/js-parsing/parsing/getExpectedChildrenLengthForToken.js';
import { ParseTreeToken } from
'../../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';

export function testGetExpectedChildrenLengthForToken(logger) {
	const cases = [
	{
		'val': null,
		'type': ParseTreeTokenType.TREE_ROOT,
		'result': undefined
	}
	];
	cases.forEach(function(caseInfo, index) {
		const token = new ParseTreeToken(caseInfo.val, 0, 0, caseInfo.type);
		const numChildrenExpected = getExpectedChildrenLengthForToken(token);
		if (numChildrenExpected !== caseInfo.result) {
			plogger(`Expected ${caseInfo.result} but got ${numChildrenExpected}`);
		}
	});
};