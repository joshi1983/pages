import { findToken } from
'../../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getMakeCommandNameForToken } from
'../../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/type-processors/helpers/getMakeCommandNameForToken.js';
import { parse } from
'../../../../../../../modules/parsing/basic/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testGetMakeCommandNameForToken(logger) {
	const cases = [
		{'code': 'x = 3',
		'token': {
			'val': 'x'
		}, 'out': 'make'},
		{'code': `sub p
	x = 3
	
end sub`,
		'token': {
			'val': 'x'
		}, 'out': 'localmake'},
		{'code': `sub p
	x = 3
end sub`,
		'token': {
			'val': 'x'
		}, 'out': 'localmake'},
		{'code': `sub p
	shared x
	x = 3
end sub`,
			'token': {
				'val': 'x',
				'hasParentType': ParseTreeTokenType.ASSIGNMENT
			}, 'out': 'make'
		},
		{
			'code': `SUB Recieve

LINE INPUT "You: ", A$
IF A$ = "" THEN A$ = "(No Response)"
 
END SUB`,
		'token': {
			'val': 'A$',
			'hasParentType': ParseTreeTokenType.ARG_LIST
		},
		'out': 'localmake'
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, allTokens, plogger);
		const result = getMakeCommandNameForToken(token, plogger);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};