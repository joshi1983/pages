import { findToken } from
'../../helpers/findToken.js';
import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getSortedFirstDescendentTokenOf } from
'../../../modules/parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

export function testGetSortedFirstDescendentTokenOf(logger) {
	const cases = [
		{
			'code': 'forward 100',
			'inToken': {
				'val': 'forward'
			},
			'outToken': {
				'val': 100
			}
		},
		{
			'code': 'repeat 2 [ forward 100 ]',
			'inToken': {
				'type': ParseTreeTokenType.LIST
			},
			'outToken': {
				'val': '['
			}
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		if (tree === undefined)
			plogger(`Unable to complete the test because unable to parse the code`);
		else {
			const tokens = flatten(tree);
			const inToken = findToken(caseInfo.inToken, tokens, plogger);
			if (inToken === undefined)
				return;

			const outToken = findToken(caseInfo.outToken, tokens, plogger);
			if (outToken === undefined)
				return;

			const token = getSortedFirstDescendentTokenOf(inToken);
			if (token !== outToken) {
				plogger(`Expected a different outToken. token.val=${token.val}, token.type is ${ParseTreeTokenType.getNameFor(token.type)}`);
			}
		}
	});
};