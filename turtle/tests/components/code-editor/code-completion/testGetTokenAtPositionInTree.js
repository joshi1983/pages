import { findToken } from '../../../helpers/findToken.js';
import { flatten } from '../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getTokenAtPositionInTree } from '../../../../modules/components/code-editor/code-completion/getTokenAtPositionInTree.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function testGetTokenAtPositionInTree(logger) {
	const cases = [
	{'code': ':xyz', 'checks': [
		{
			'position': {
				'lineIndex': 0,
				'colIndex': 0
			},
			'token': undefined
		},
		{
			'position': {
				'lineIndex': 0,
				'colIndex': 1
			},
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ
			}
		},
		{
			'position': {
				'lineIndex': 0,
				'colIndex': 3
			},
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ
			}
		},
		{
			'position': {
				'lineIndex': 0,
				'colIndex': 4
			},
			'token': {
				'type': ParseTreeTokenType.VARIABLE_READ
			}
		},
		{
			'position': {
				'lineIndex': 0,
				'colIndex': 5
			},
			'token': undefined
		}
	]},
	{'code': 'fd 100', 'checks': [
			{
				'position': {
					'colIndex': 1,
					'lineIndex': 0
				}, 'token': {
					'type': ParseTreeTokenType.PARAMETERIZED_GROUP
				}
			},
			{
				'position': {
					'colIndex': 2,
					'lineIndex': 0
				}, 'token': {
					'type': ParseTreeTokenType.PARAMETERIZED_GROUP
				}
			},
			{
				'position': {
					'colIndex': 3,
					'lineIndex': 0
				}, 'token': undefined
			},
			{
				'position': {
					'colIndex': 4,
					'lineIndex': 0
				}, 'token': {
					'type': ParseTreeTokenType.NUMBER_LITERAL
				}
			},
		]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseLogger = new TestParseLogger(plogger, caseInfo.code);
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		if (tree !== undefined) {
			const allTokens = flatten(tree);
			caseInfo.checks.forEach(function(checkInfo, cIndex) {
				const clogger = prefixWrapper(`Check ${cIndex}, lineIndex: ${checkInfo.position.lineIndex}, colIndex: ${checkInfo.position.lineIndex}`, plogger);
				const token = getTokenAtPositionInTree(allTokens, checkInfo.position);
				if (checkInfo.token === undefined) {
					if (token !== undefined)
						clogger(`Expected not to find a token but found ${token}`);
				}
				else if (token === undefined) {
					clogger(`Expected to find a token but found none`);
				}
				else {
					const matchingToken = findToken(checkInfo.token, allTokens, clogger);
					if (matchingToken !== undefined && matchingToken !== token) {
						clogger(`Expected a token ${matchingToken} but got ${token}`);
					}
				}
			});
		}
	});
};