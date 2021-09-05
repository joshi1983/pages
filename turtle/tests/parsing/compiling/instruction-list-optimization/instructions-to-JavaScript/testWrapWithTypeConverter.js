import { createRootToken } from '../../../../helpers/createRootToken.js';
import { LineCap } from '../../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';
import { wrapWithTypeConverter } from 
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/wrapWithTypeConverter.js';

const token = createRootToken();

function validateCaseInfo(caseInfo, logger) {
	if (typeof caseInfo.code !== 'string')
		logger(`code must be a string.  Not: ${caseInfo.code}`);
	if (typeof caseInfo.argInfo !== 'object')
		logger(`argInfo must be an object.  Not: ${caseInfo.argInfo}`);
	if (typeof caseInfo.result !== 'string')
		logger(`result must be a string.  Not: ${caseInfo.result}`);
}

function testWithErrorChecks(logger) {
	const cases = [
		{
			'code': '5',
			'argInfo': {
				'types': 'string',
				'errorCases': ["y"]
			},
			'productionResult': 'this.validateString(5)',
			'resultContains': 'this.validateString'
		}
	]
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		[true, false].forEach(function(isForProduction) {
			const wrapResult = wrapWithTypeConverter(caseInfo.code, caseInfo.argInfo, isForProduction, 'test', token);
			if (!(wrapResult.namedFunctionsMap instanceof Map))
				plogger(`Expected namedFunctionsMap to be a Map but got: ${wrapResult.namedFunctionsMap}`);
			const result = wrapResult.code;
			if (isForProduction === true) {
				if (result !== caseInfo.productionResult)
					plogger(`Expected ${caseInfo.productionResult} in production but got ${result}`);
			}
			else {
				if (result.indexOf(caseInfo.resultContains) === -1)
					plogger(`Expected to contain ${caseInfo.resultContains} but got ${result} which does not contain the substring`);
			}
		});
	});
}

function testGeneralCases(logger) {
	const cases = [
		{'code': '4', 'argInfo': {'types': 'num'}, 'result': '4'},
		{'code': 'true', 'argInfo': {'types': 'bool'}, 'result': 'true'},
		{'code': 'this.Transparent', 'argInfo': {'types': 'transparent'}, 'result': 'this.Transparent'},
		{'code': 'this.Transparent', 'argInfo': {'types': 'alphacolor|transparent'}, 'result': 'this.Transparent'},
		{'code': 'this.Transparent', 'argInfo': {'types': 'color|transparent'}, 'result': 'this.Transparent'},
		{'code': '"red"', 'argInfo': {'types': 'color'},
			'result': 'this.convertToColour("red")',
			'productionResult': 'this.convertToColour("red")'},
		{'code': '"red"', 'argInfo': {'types': 'alphacolor'},
			'result': 'this.convertToAlphaColour("red")',
			'productionResult': 'this.convertToAlphaColour("red")'},
		{'code': '"red"', 'argInfo': {'types': 'alphacolor|transparent'},
			'result': 'this.convertToAlphaColourOrTransparent("red")',
			'productionResult': 'this.convertToAlphaColourOrTransparent("red")'},
		{'code': '"jumpStart"',
			'argInfo': {
				'types': 'string', 
				'sanitization': 'convertToStepPosition'
			},
			'result': '0',
			'productionResult': '0'
		},
		{'code': '"butt"', 'argInfo': {'types': 'string', 'sanitization': 'lineCap'},
			'result': `${LineCap.parse("butt")}`,
			'productionResult': `${LineCap.parse("butt")}`
		},
		{'code': 'context.getCurrentExecutingProcedure().localVariables.get("cap")', 'argInfo': {'types': 'string', 'sanitization': 'lineCap'},
			'result': `this.lineCap(context.getCurrentExecutingProcedure().localVariables.get("cap"))`,
			'productionResult': `this.lineCap(context.getCurrentExecutingProcedure().localVariables.get("cap"))`
		},
		{'code': '["hello", "world"]',
			'argInfo': {
				'types': 'list|string', 
				'sanitization': 'listToString'
			},
			'result': '"hello world"',
			'productionResult': '"hello world"'
		},
		{'code': '"x"', 'argInfo': {'types': 'string', 'refTypes': 'plist'},
			'result': 'this.validatePListVariableReference("x", context)',
			'productionResult': 'context.readVariable("x")'
		},
		{'code': '"X"', 'argInfo': {'types': 'string', 'refTypes': 'plist'},
			'result': 'this.validatePListVariableReference("x", context)',
			'productionResult': 'context.readVariable("x")'
		},
		{'code': '"x"', 'argInfo': {'types': 'string', 'refTypes': 'list'},
			'result': 'this.validateListVariableReference("x", context)',
			'productionResult': 'context.readVariable("x")'
		},
		{'code': '"X"', 'argInfo': {'types': 'string', 'refTypes': 'list'},
			'result': 'this.validateListVariableReference("x", context)',
			'productionResult': 'context.readVariable("x")'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		validateCaseInfo(caseInfo, prefixWrapper('validateCaseInfo', plogger));
		[true, false].forEach(function(isForProduction) {
			const wrapResult = wrapWithTypeConverter(caseInfo.code, caseInfo.argInfo, isForProduction, 'test', token);
			if (!(wrapResult.namedFunctionsMap instanceof Map))
				plogger(`Expected namedFunctionsMap to be a Map but got: ${wrapResult.namedFunctionsMap}`);
			const result = wrapResult.code;
			let expectedResult;
			if (isForProduction === false) {
				expectedResult = caseInfo.result;
			}
			else {
				if (caseInfo.productionResult === undefined)
					expectedResult = caseInfo.code;
				else
					expectedResult = caseInfo.productionResult;
			}
			if (result !== expectedResult)
				plogger(`Expected ${expectedResult} but got ${result}`);
		});
	});
}

export function testWrapWithTypeConverter(logger) {
	wrapAndCall([
		testGeneralCases,
		testWithErrorChecks
	], logger);
};