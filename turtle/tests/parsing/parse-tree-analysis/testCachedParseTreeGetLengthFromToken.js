import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testCachedParseTreeGetLengthFromToken(logger) {
	const cases = [
		{'code': `make "x []\nprint :x`, 'checks': [
			{
				'token': {
					'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 0
			}
		]},
		{'code': `make "x []\nmake "y [1 2 3]\nprint :x\nprint :y`, 'checks': [
			{
				'token': {
					'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 0
			},
			{
				'token': {
					'val': 'y', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 3,
				'value': [1, 2, 3]
			}
		]},
		{'code': `make "x []\nsetItem 1 "x 123\nprint :x`, 'checks': [
			{
				'token': {
					'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 1
			}
		]},
		{'code': `make "x []\nqueue "x 123\nprint :x`, 'checks': [
			{
				'token': {
					'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 1
			}
		]},
		{'code': `make "x []\nqueue2 "x 123\nprint :x`, 'checks': [
			{
				'token': {
					'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 1
			}
		]},
		{'code': `make "x [1 2 3]\nsetItem 1 "x 123\nprint :x`, 'checks': [
			{
				'token': {
					'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 3
			}
		]},
		{'code': `make "x [1 2 3]\nsetItem 1 "X 123\nprint :x`, 'checks': [
			{// same as previous case but using upper case for "X in the setItem call.
				'token': {
					'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ
				},
				'length': 3
			}
		]},
		{'code': `to p
	localmake "oldPos pos
	Print :oldPos
	localmake "arcsInfo1 [
		[5 1.55] [54 0.2] [25 0.255]
	]
	setFillColor "red
	jumpRight 5
	localmake "pos1 pos
	print :pos1
	polyStart
	setItem 1 "arcsInfo1 [12 0.33]
	print :oldPos
	jumpForward distanceToLine :oldPos :pos1
	polyEnd
end`,
	'checks': [
	{
		'token': {
			'val': 'oldPos', 'type': ParseTreeTokenType.VARIABLE_READ, 'hasParentVal': 'print'
		},
		'length': 3
	},
	{
		'token': {
			'val': 'oldPos', 'type': ParseTreeTokenType.VARIABLE_READ, 'hasParentVal': 'Print'
		},
		'length': 3
	},
	{
		'token': {
			'val': 'pos1', 'type': ParseTreeTokenType.VARIABLE_READ, 'hasParentVal': 'print'
		},
		'length': 3
	}
]}
];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const code = caseInfo.code;
		const cachedParseTree = getCachedParseTreeFromCode(code, plogger);
		const allTokens = cachedParseTree.getAllTokens();
		const tokenValues = cachedParseTree.getTokenValues();
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}`, plogger);
			const token = findToken(checkInfo.token, allTokens, clogger);
			if (token === undefined)
				clogger(`Unable to find token.  Update the token object in testCachedParseTreeGetLengthFromToken.js.`);
			else {
				const len = cachedParseTree.getLengthFromToken(token);
				if (checkInfo.length !== len) {
					clogger(`length expected to be ${checkInfo.length} but got ${len}`);
				}
				if (checkInfo.value !== undefined) {
					const actualValue = tokenValues.get(token);
					if (actualValue === undefined)
						clogger(`Expected to get a value from tokenValues map but did not find one for the checked token`);
					else if (actualValue.length === undefined) {
						clogger(`Expected the actual value to have a length property but it does not.  actualValue = ${actualValue}`);
					}
					else if (actualValue.length !== checkInfo.value.length) {
						clogger(`Expected actualValue to have a length of ${checkInfo.value.length} but got a length of ${actualValue.length}`);
					}
					else {
						for (let i = 0; i < checkInfo.value.length; i++) {
							if (actualValue[i] !== checkInfo.value[i]) {
								clogger(`Expected [${i}] to be ${checkInfo.value[i]} but got ${actualValue[i]}`);
							}
						}
					}
				}
			}
		});
	});
};