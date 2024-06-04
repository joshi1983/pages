import { findToken } from
'../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { VariableNameSuggestions } from
'../../../../modules/components/code-editor/code-completion/VariableNameSuggestions.js';

export function testVariableNameSuggestions(logger) {
	const cases = [
	{'code': `make "x 3
forward :`, 'checks': [
	{
		'token': {'type': ParseTreeTokenType.VARIABLE_READ},
		'suggestions': ['x']
	}
]},
	{'code': `make "x123 3
forward :`, 'checks': [
	{
		'token': {'type': ParseTreeTokenType.VARIABLE_READ},
		'suggestions': ['x123']
	}
]},
	{'code': `make "xyz 2
make "x123 3
forward :`, 'checks': [
	{
		'token': {'type': ParseTreeTokenType.VARIABLE_READ},
		'suggestions': ['x123', 'xyz']
	}
]},
	{'code': `make "_s 45
make "xyz 2
make "x123 3
forward :`, 'checks': [
	{
		'token': {'type': ParseTreeTokenType.VARIABLE_READ},
		'suggestions': ['_s', 'x123', 'xyz']
	}
]},
	{'code': `make "_s 45
make "xyz 2
make "x123 3
forward :x`, 'checks': [
	{
		'token': {'val': 'x'},
		'suggestions': ['x123', 'xyz']
	}
]},
	{'code': `make "_s 45
make "xyZ 2
make "x123 3
forward :x`, 'checks': [
	{
		'token': {'val': 'x'},
		'suggestions': ['x123', 'xyZ']
	}
]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = cachedParseTree.getAllTokens();
		caseInfo.checks.forEach(function(checkInfo) {
			const token = findToken(checkInfo.token, tokens, plogger);
			if (token === undefined)
				return;
			const applicableResult = VariableNameSuggestions.isApplicableToToken(token);
			if (applicableResult !== true)
				plogger(`Expected VariableNameSuggestions.isApplicableTo(...) to return true but got ${applicableResult}`);
			const position = {'lineIndex': token.lineIndex, 'colIndex': token.colIndex + 1};
			const result = VariableNameSuggestions.getSuggestions(cachedParseTree, token, position);
			if (result.length !== checkInfo.suggestions.length)
				plogger(`Expected ${checkInfo.suggestions.length} suggestions but got ${result.length}`);
			else {
				for (let i = 0; i < result.length; i++) {
					if (result[i] !== checkInfo.suggestions[i])
						plogger(`Expected [${i}] to be ${checkInfo.suggestions[i]} but got ${result[i]}`);
				}
			}
		});
	});
};