import { findToken } from
'../../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getForLoopVariableName } from
'../../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/getForLoopVariableName.js';
import { parse } from
'../../../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testGetForLoopVariableName(logger) {
	const cases = [
	{'code': `FOR K=1 TO 5
FOr I=2 TO 6
For J=3 TO 7
NEXT J,I
NEXT K`,
		'checks': [
			{
				'token': {'val': 'FOR'},
				'out': 'k'
			},
			{
				'token': {'val': 'FOr'},
				'out': 'i'
			},
			{
				'token': {'val': 'For'},
				'out': 'j'
			}
		]
	},{
		'code': `for k=pi*2+12 TO 20`,
		'checks': [
			{
				'token': {'val': 'for'},
				'out': 'k'
			}
		]
	},{
		'code': `FOR K=0 TO 2*PI STEP Q
For I=0 TO 2 STEP 2
FOr J=1 TO 2 STEP 3
NEXT J,I
NEXT K
GOTO 90`,
		'checks': [
			{
				'token': {'val': 'FOR'},
				'out': 'k'
			},
			{
				'token': {'val': 'For'},
				'out': 'i'
			},
			{
				'token': {'val': 'FOr'},
				'out': 'j'
			}
		]
	},{
		'code': `FOR K=0 TO 2
For I=1 TO 3
FOr J=2 TO 4
NEXT J,I
V=1
NEXT K`,
		'checks': [
			{
				'token': {'val': 'FOR'},
				'out': 'k'
			},
			{
				'token': {'val': 'For'},
				'out': 'i'
			},
			{
				'token': {'val': 'FOr'},
				'out': 'j'
			}
		]
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			if (token !== undefined) {
				const result = getForLoopVariableName(token);
				if (result !== checkInfo.out)
					clogger(`Expected ${checkInfo.out} but found ${result}`);
			}
		});
	});
};