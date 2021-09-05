import { getArgPushIndex } from '../getArgPushIndex.js';
import { instructionToJavaScript } from './instructionToJavaScript.js';
import { MapUtils } from '../../../../MapUtils.js';
import { wrapWithBracketsIfNeeded } from './wrapWithBracketsIfNeeded.js';

const jsOperatorMap = new Map([
	['=', '==='],
	['<>', '!==']
]);

export function getJavaScriptOperatorFromBinaryOperatorInstruction(instruction) {
	let jsOperatorSymbol = jsOperatorMap.get(instruction.operatorSymbol);
	if (jsOperatorSymbol === undefined)
		jsOperatorSymbol = instruction.operatorSymbol;
	return jsOperatorSymbol;
};

function addFunctionsAndGetCode(instructions, index, info, compileOptions, namedFunctionsMap) {
	const wrappedResult = instructionToJavaScript(instructions, index, info, compileOptions);
	MapUtils.merge(namedFunctionsMap, wrappedResult.namedFunctionsMap);
	return wrappedResult.code;
}

export function binaryOperatorToJavaScript(instructions, index, info, compileOptions) {
	const instruction = instructions[index];
	const index2 = getArgPushIndex(instructions, index - 1, 1);
	let jsOperatorSymbol = getJavaScriptOperatorFromBinaryOperatorInstruction(instruction);
	const namedFunctionsMap = new Map();
	const leftHandSide = wrapWithBracketsIfNeeded(addFunctionsAndGetCode(instructions, index2, info, compileOptions, namedFunctionsMap));
	const rightHandSide = wrapWithBracketsIfNeeded(addFunctionsAndGetCode(instructions, index - 1, info, compileOptions, namedFunctionsMap));
	return {
		'code': `${leftHandSide} ${jsOperatorSymbol} ${rightHandSide}`,
		'namedFunctionsMap': namedFunctionsMap
	};
};