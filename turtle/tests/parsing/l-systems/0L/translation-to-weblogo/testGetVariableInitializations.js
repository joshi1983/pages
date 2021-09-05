import { getReferencedVariables, getVariableInitializations } from
'../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/getVariableInitializations.js';
import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../modules/parsing/loggers/ParseLogger.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

function testGetReferencedVariables(logger) {
	const cases = [
		{'code': 'print :angle', 'variables': ['angle']},
		{'code': 'print :angleIncrement', 'variables': ['angleincrement']},
		{'code': 'print :lengthScaleFactor', 'variables': ['lengthscalefactor']},
		{'code': 'push "states turtleState', 'variables': ['states']},
		{'code': 'pop "states', 'variables': ['states']},
		{'code': `to popState
	pop "states
end`, 'variables': ['states']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseLogger = new ParseLogger();
		const root = LogoParser.getParseTree(caseInfo.code, parseLogger);
		const result = getReferencedVariables(root);
		if (!(result instanceof Set))
			plogger(`Expected a Set but found ${result}`);
		else if (result.size !== caseInfo.variables.length)
			plogger(`Expected ${caseInfo.variables.length} variables but found ${result.size}`);
		else {
			for (const name of caseInfo.variables) {
				if (!result.has(name))
					plogger(`Expected variable name ${name} but not found in result(${Array.from(result).join(', ')})`);
			}
		}
	});
}

function testInOut(logger) {
	const cases = [
		{'in': `to axiom :n
make "length :length / :lengthScaleFactor
forward :length
make "length :length * :lengthScaleFactor
end`, 'outContains': 'make "lengthScaleFactor '}
	];
	cases.forEach(function(caseInfo) {
		caseInfo.inArgs = [caseInfo.in, new Map()];
		delete caseInfo.in;
	});
	testInOutPairs(cases, getVariableInitializations, logger);
}

export function testGetVariableInitializations(logger) {
	wrapAndCall([
		testGetReferencedVariables,
		testInOut
	], logger);
};