import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { evaluateTokensWithVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensWithVariables.js';
import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { setLastSingleValueTokens } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/setLastSingleValueTokens.js';

export function testSetLastSingleValueTokens(logger) {
	const cases = [
		{'code': 'print "hello'},
		{'code': 'make "x 5'},
		{'code': 'make "x 5\nprint :x'},
		{'code': 'to p\nlocalmake "x 5\nprint :x\nend\np'},
		{'code': 'to p\nlocalmake "x plistCreate\nsetProperty "x "key1 5\nprint :x\nend\np'},
		{'code': 'make "x []\nqueue "x 5\nprint :x',
		'checks': [
			{
				'name': 'x',
				'fromToken': {
					'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
					'val': 'queue'
				},
				'lastSingleValueTokenVal': 5
			}
		]},
		{
			'code': `to p :size
	while :size > 0.5 [
		localmake "size :size * 0.98
	]
end

p 100`,
			'checks': [{
				'name': 'size',
				'fromToken': {
					'type': ParseTreeTokenType.LIST,
					'hasParentVal': 'to',
					'hasChildVal': 'while'
				},
				'lastSingleValueTokenVal': 'while'
			}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const _plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const vars = tree.getVariables();
		const tokenValues = evaluateTokensBasic(tree);
		setLastSingleValueTokens(tree, vars);
		evaluateTokensWithVariables(tree, tokenValues, vars);
		if (caseInfo.checks instanceof Array) {
			const tokens = tree.getAllTokens();
			caseInfo.checks.forEach(function(checkInfo, checkIndex) {
				const plogger = prefixWrapper(`Check ${checkIndex}, variable: ${checkInfo.name}`, _plogger);
				const variable = vars.getVariableByName(checkInfo.name);
				let scopes = variable.getScopesArray();
				if (checkInfo.fromToken !== undefined) {
					const fromToken = findToken(checkInfo.fromToken, tokens, plogger);
					scopes = scopes.filter(scope => scope.fromToken === fromToken);
				}
				if (scopes.length !== 1)
					plogger(`Expected 1 filtered scope but got ${scopes.length}.  The ${checkInfo.name} variable has ${variable.getScopesArray().length} unfiltered scopes.`);
				else {
					const scope = scopes[0];
					if (scope.lastSingleValueToken === undefined) {
						if (checkInfo.lastSingleValueTokenVal !== undefined)
							plogger(`Expected lastSingleValueToken to not be undefined but got undefined`);
					}
					else if (!DeepEquality.equals(scope.lastSingleValueToken.val, checkInfo.lastSingleValueTokenVal))
						plogger(`Expected lastSingleValueToken.val to be ${checkInfo.lastSingleValueTokenVal} but got ${scope.lastSingleValueToken.val}`);
				}
			});
		}
	});
};