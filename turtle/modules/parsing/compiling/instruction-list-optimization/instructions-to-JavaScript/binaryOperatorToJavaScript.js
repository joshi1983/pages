import { getArgPushIndex } from '../getArgPushIndex.js';
import { instructionToJavaScript } from './instructionToJavaScript.js';

const jsOperatorMap = new Map();
jsOperatorMap.set('=', '===');
jsOperatorMap.set('<>', '!==');

export function getJavaScriptOperatorFromBinaryOperatorInstruction(instruction) {
	let jsOperatorSymbol = jsOperatorMap.get(instruction.operatorSymbol);
	if (jsOperatorSymbol === undefined)
		jsOperatorSymbol = instruction.operatorSymbol;
	return jsOperatorSymbol;
};

export function binaryOperatorToJavaScript(instructions, index, info, compileOptions) {
	const instruction = instructions[index];
	const index2 = getArgPushIndex(instructions, index - 1, 1);
	let jsOperatorSymbol = getJavaScriptOperatorFromBinaryOperatorInstruction(instruction);

	return '(' + instructionToJavaScript(instructions, index2, info, compileOptions) + ') ' + jsOperatorSymbol + ' (' + instructionToJavaScript(instructions, index - 1, info, compileOptions) + ')';
};