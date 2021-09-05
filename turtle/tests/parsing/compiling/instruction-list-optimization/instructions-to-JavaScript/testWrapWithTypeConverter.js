import { createRadialGradient } from
'../../../../helpers/createRadialGradient.js';
import { createRootToken } from
'../../../../helpers/createRootToken.js';
import { createTestTurtle } from
'../../../../helpers/createTestTurtle.js';
import { EaseInOut } from
'../../../../../modules/drawing/vector/easing/EaseInOut.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { ExecutionContext } from
'../../../../../modules/parsing/execution/ExecutionContext.js';
import { JavaScriptInstruction } from
'../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { LineCap } from
'../../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { LogoRuntimeException } from
'../../../../../modules/parsing/execution/LogoRuntimeException.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from
'../../../../helpers/testCodeToProgram.js';
import { Transparent } from
'../../../../../modules/Transparent.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';
import { wrapWithTypeConverter } from 
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/wrapWithTypeConverter.js';

const token = createRootToken();

function testExecution(logger) {
	const cases = [
		{
			'argInfo': {
				'types': 'bool|easing|gradient|num|plist|string(minlen=2)|transparent',
				'minLen': 2
			},
			'inputCases': [
				{'in': '', 'errorExpected': true},
				{'in': 'a', 'errorExpected': true},
				{'in': 'ab', 'errorExpected': false},
				{'in': 'abc', 'errorExpected': false},
				{'in': 4, 'errorExpected': false},
				{'in': 123, 'errorExpected': false},
				{'in': true, 'errorExpected': false},
				{'in': false, 'errorExpected': false},
				{'in': createRadialGradient(), 'errorExpected': false},
				{'in': new EaseInOut(), 'errorExpected': false},
				{'in': Transparent, 'errorExpected': false},
				{'in': new Map(), 'errorExpected': false},
			]
		},
		{
			'argInfo': {
				'types': 'string(minlen=2),list(minlen=2)',
				'minLen': 2,
				'maxLen': 3
			},
			'inputCases': [
				{'in': '', 'errorExpected': true},
				{'in': 'a', 'errorExpected': true},
				{'in': 'ab', 'errorExpected': false},
				{'in': 'abc', 'errorExpected': false},
				{'in': 'abcd', 'errorExpected': true},
				{'in': [], 'errorExpected': true},
				{'in': [1], 'errorExpected': true},
				{'in': [1,2], 'errorExpected': false},
				{'in': [1,2,3], 'errorExpected': false},
				{'in': [1,2,3,4], 'errorExpected': true},
			]
		},
		{
			'argInfo': {
				'types': 'string,list',
				'maxLen': 2
			},
			'inputCases': [
				{'in': '', 'errorExpected': false},
				{'in': 'a', 'errorExpected': false},
				{'in': 'ab', 'errorExpected': false},
				{'in': 'abc', 'errorExpected': true},
				{'in': [], 'errorExpected': false},
				{'in': [1], 'errorExpected': false},
				{'in': [1,2], 'errorExpected': true}
			]
		}
	];
	const program = testCodeToProgram('', logger);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const primaryName = 'test';
		const forProduction = false;
		const code = 'context.valueStack[context.valueStack.length - 1]';
		const result = wrapWithTypeConverter(code, caseInfo.argInfo, forProduction, primaryName, token);
		if (typeof result !== 'object') {
			plogger(`Expected an object but found result to be ${result}`);
		}
		else if (typeof result.code !== 'string')
			plogger(`Expected result.code to be a string but found ${result.code}`);
		else if (!(result.namedFunctionsMap instanceof Map))
			plogger(`Expected result.namedFunctionsMap to be a Map but found ${result.namedFunctionsMap}`);
		else {
			const mockInstruction = new JavaScriptInstruction(result.code, token, result.namedFunctionsMap);
			caseInfo.inputCases.forEach(function(inputCase, icIndex) {
				const ilogger = prefixWrapper(`Input case ${icIndex}`, plogger);
				const turtle = createTestTurtle();
				const context = new ExecutionContext(turtle, program);
				context.valueStack.push(inputCase.in);
				try {
					mockInstruction.execute(context);
				}
				catch (e) {
					if (inputCase.errorExpected === false)
						ilogger(`Expected no error but found one.  e=${exceptionToString(e)}`);
					if (!(e instanceof LogoRuntimeException)) {
						console.error(e);
						ilogger(`An error or exception was thrown that was not at LogoRuntimeException. e=${exceptionToString(e)}`);
					}
				}
			});
		}
	});
}

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
		testExecution,
		testGeneralCases,
		testWithErrorChecks
	], logger);
};