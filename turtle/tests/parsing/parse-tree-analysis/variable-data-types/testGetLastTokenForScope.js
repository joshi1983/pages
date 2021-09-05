import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getLastTokenForScope } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getLastTokenForScope.js';
import { MaybeDecided } from '../../../../modules/MaybeDecided.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
await ParseTreeToken.asyncInit();

function validateCheckInfo(checkInfo, logger) {
	if (typeof checkInfo !== 'object')
		logger(`checkInfo must be an object.  Not: ${checkInfo}`);
	else {
		if (MaybeDecided.isMaybeDecidedValue(checkInfo.isLocalScope) === false)
			logger(`checkInfo.isLocalScope must be a MaybeDecided value.  Not: ${checkInfo.isLocalScope}`);
	}
}

export function testGetLastTokenForScope(logger) {
	const cases = [
		{'code': 'make "x 3\nprint :x',
			'checks': [
				{
					'varName': 'x',
					'isLocalScope': MaybeDecided.No,
					'startToken': {
						'val': 'print'
					},
					'result': {
						'val': 'x',
						'type': ParseTreeTokenType.VARIABLE_READ
					}
				}
			]
		},
		{
			'code': 'make "x 3\nMake "x 9\nprint :x',
			'checks': [
				{
					'varName': 'x',
					'isLocalScope': MaybeDecided.No,
					'startToken': {
						'val': 'Make'
					},
					'result': {
						'val': 9
					}
				},
				{
					'varName': 'x',
					'isLocalScope': MaybeDecided.No,
					'startToken': {
						'val': 'print'
					},
					'result': {
						'val': 'x',
						'type': ParseTreeTokenType.VARIABLE_READ
					}
				}
			]
		},
		{
			'code': `to p1
	mAke "x 0
end

To p2
	makE "x 1
	Make "x :x + 4
enD`,
	'checks': [
		{
			'varName': 'x',
			'isLocalScope': MaybeDecided.No,
			'startToken': {
				'val': 'mAke'
			},
			'result': {
				'val': 'end'
			}
		},
		{
			'varName': 'x',
			'isLocalScope': MaybeDecided.No,
			'startToken': {
				'val': 'makE'
			},
			'result': {
				'val': 'enD'
			}
		},
		{
			'varName': 'x',
			'isLocalScope': MaybeDecided.No,
			'startToken': {
				'val': 'Make'
			},
			'result': {
				'val': 'enD'
			}
		}
	]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = tree.getAllTokens();
		const variables = tree.getVariables();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			validateCheckInfo(checkInfo, clogger);
			const startToken = findToken(checkInfo.startToken, allTokens, clogger);
			const resultToken = findToken(checkInfo.result, allTokens, clogger);
			const variable = variables.getVariableByName(checkInfo.varName.toLowerCase());
			const result = getLastTokenForScope(tree, startToken, variable, checkInfo.isLocalScope);
			if (!(result instanceof ParseTreeToken))
				clogger(`expected a ParseTreeToken but got ${result}`);
			else {
				const keys = ['colIndex', 'lineIndex', 'val'];
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					if (result[key] !== resultToken[key]) {
						clogger(`expected result.${key} to be ${resultToken[key]} but got ${result[key]}`);
					}
				}
			}
		});
	});
};