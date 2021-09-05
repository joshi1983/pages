import { genericInsertArgBrackets } from
'../../../../modules/parsing/basic/helpers/genericInsertArgBrackets.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { scan as scanQBasic } from
'../../../../modules/parsing/basic/qbasic/scanning/scan.js';

const mockFunctionsData = [
	{
		'name': 'exp',
		'args': [
			{"name": "num", "types": "num"}
		]
	},
	{
		'name': 'twoParamFunc',
		'args': [
			{"name": "param1"},
			{"name": "param2"}
		]
	},
	{
		'name': 'noParamFunc',
		'args': [
		]
	}
];
const functionsMap = new Map();
for (const funcInfo of mockFunctionsData) {
	functionsMap.set(funcInfo.name.toLowerCase(), funcInfo);
}

function mockGetFunctionInfo(name) {
	return functionsMap.get(name.toLowerCase());
}

export function testGenericInsertArgBrackets(logger) {
	const cases = [
		{'code': 'print 3', 'tokens': ['print', '3']},
			// print doesn't need brackets so none should be added.

		{'code': 'print exp 3', 'tokens': ['print', 'exp', '(', '3', ')']},
		{'code': 'print exp x + 3', 'tokens': ['print', 'exp', '(', 'x', '+', '3', ')']},
		{'code': 'print exp x + y * z', 'tokens': ['print', 'exp', '(', 'x', '+', 'y', '*', 'z', ')']},
		{'code': 'print exp 3,', 'tokens': ['print', 'exp', '(', '3', ')', ',']},
		{'code': 'print twoParamFunc 3,', 'tokens': ['print', 'twoParamFunc', '(', '3', ',', ')']},
		{'code': 'print twoParamFunc 3,x', 'tokens': ['print', 'twoParamFunc', '(', '3', ',', 'x', ')']},
		{'code': 'print twoParamFunc 3,x\nbla', 'tokens': ['print', 'twoParamFunc', '(', '3', ',', 'x', ')', 'bla']},
		{'code': 'print noParamFunc', 'tokens': ['print', 'noParamFunc']},
	];
	cases.forEach(function(caseInfo, index) {
		const tokens = scanQBasic(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		genericInsertArgBrackets(tokens, mockGetFunctionInfo);
		if (tokens.length !== caseInfo.tokens.length)
			plogger(`Expected ${caseInfo.tokens.length} tokens but found ${tokens.length}.  The actual token s values are ${tokens.map(t => t.s).join(',')}`);
		else {
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];
				const info = caseInfo.tokens[i];
				const tplogger = prefixWrapper(`Checking token ${i}`, plogger);
				let s;
				if (typeof info === 'string')
					s = info;
				else if (typeof info === 'object') {
					s = info.s;
				}
				if (s !== token.s)
					tplogger(`Expected s to have a value of ${s} but found ${token.s}`);
			}
		}
	});
};