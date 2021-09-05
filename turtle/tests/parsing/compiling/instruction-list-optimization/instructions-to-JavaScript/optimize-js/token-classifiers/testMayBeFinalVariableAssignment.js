import { findToken } from
'../../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { isVariableAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isVariableAssignment.js';
import { mayBeFinalVariableAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/mayBeFinalVariableAssignment.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';
import { processTokenCheckTests } from
'./processTokenCheckTests.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

function testAdvancedCases(logger) {
	const cases = [
	{'code': `localVariables. set("arcradius", arcradius );`, 'checks': [
	{'token': {
		'val': null,
		'type': ParseTreeTokenType.FUNCTION_CALL,
		'hasChildVal': 'localVariables'
	},
	'result': true
	}
]},
	{'code': `localVariables. set("arcradius", 3 );
context.valueStack.push( arcradius < 0);`, 'checks': [
	{'token': {
		'val': null,
		'type': ParseTreeTokenType.FUNCTION_CALL,
		'hasChildVal': 'localVariables'
	},
	'result': false
	}
]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			if (token !== undefined) {
				const result = mayBeFinalVariableAssignment(token);
				if (result !== checkInfo.result) {
					if (checkInfo.result === true) {
						if (!isVariableAssignment(token))
							clogger(`Expected mayBeFinalVariableAssignment to return true but it didn't.  isVariableAssignment returns false too.`);
					}
					clogger(`Expected ${checkInfo.result} but got ${result}`);
				}
			}
		});
	});
}

function testSimpleCases(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': `context.localmake("zx",1)`,
	'numResults': 0},
	{'code': `context.localmake("zx","x")`,
	'numResults': 0},
	{'code': `context.localmake("zx",x)`,
	'numResults': 1},
	{'code': `context.localmake("zx",zx)`,
	'numResults': 1},
	{'code': `localVariables.set("zx",zx)`,
	'numResults': 1},
	{'code': `context.localmake('numintervals', numintervals);`, 'numResults': 1}
	];
	processTokenCheckTests(cases, mayBeFinalVariableAssignment, logger);
}

export function testMayBeFinalVariableAssignment(logger) {
	wrapAndCall([
		testAdvancedCases,
		testSimpleCases
	], logger);
};