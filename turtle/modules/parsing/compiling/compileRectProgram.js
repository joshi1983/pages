import { AlphaColour } from '../../AlphaColour.js';
import { ArrayUtils } from '../../ArrayUtils.js';
import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { CallProcedureInstruction } from '../execution/instructions/CallProcedureInstruction.js';
import { Colour } from '../../Colour.js';
import { compile } from '../compile.js';
import { IncrementForCounterInstruction } from
'../execution/instructions/IncrementForCounterInstruction.js';
import { isNumber } from
'../../isNumber.js';
import { JavaScriptFunctionCallInstruction } from
'../execution/instructions/JavaScriptFunctionCallInstruction.js';
import { LogoParser } from '../LogoParser.js';
import { ParseLogger } from '../loggers/ParseLogger.js';
import { PopInstruction } from
'../execution/instructions/PopInstruction.js';
import { PushForCountInstruction } from
'../execution/instructions/PushForCountInstruction.js';
import { removeInstructions } from './instruction-list-optimization/removeInstructions.js';
import { simplifyInstructions } from './instruction-list-optimization/simplifyInstructions.js';
import { Transparent } from '../../Transparent.js';
import { VariableReadInstruction } from
'../execution/instructions/VariableReadInstruction.js';

const compileOptions = {
	'translateToJavaScript': false
};

const productionCompileOptions = {
	'translateToJavaScript': true,
	'mergeJavaScriptInstructions': true,
	'forProduction': true,
	'parsedOptimize': true
};

function getInsertIndex(instructions) {
	return ArrayUtils.indexOfMatch(instructions, function(instruction) {
		return instruction instanceof IncrementForCounterInstruction;
	});
}

function getXandYReadIndex(instructions) {
	for (let i = instructions.length - 1; i >= 0; i--) {
		const instruction = instructions[i];
		if ((instruction instanceof PushForCountInstruction)) {
			return i + 1;
		}
	}
	return -1;
}

function isPop(instruction) {
	return instruction instanceof PopInstruction;
}

function isPrintCall(instruction) {
	return ((instruction instanceof CallCommandInstruction) &&
		instruction.methodName === 'print');
}

export function compileRectProgram(rect, getColorProcedureName, initialVariableMap,
proceduresMap, isForProduction) {
	if (!(initialVariableMap instanceof Map))
		throw new Error(`initialVariableMap must be a Map but got ${initialVariableMap}`);
	if (!(proceduresMap instanceof Map))
		throw new Error(`proceduresMap must be a Map but got ${proceduresMap}`);
	if (!proceduresMap.has(getColorProcedureName))
		throw new Error(
	`getColorProcedureName must be defined but it is not.  getColorProcedureName=${getColorProcedureName}, proceduresMap keys are ${Array.from(proceduresMap.keys()).join(',')}`
	);
	if (isNaN(rect.sampleWidth))
		throw new Error(`rect must be an object with sampleWidth but rect.sampleWidth=${rect.sampleWidth}`);
	if (isNaN(rect.sampleHeight))
		throw new Error(`rect must be an object with sampleHeight but rect.sampleHeight=${rect.sampleHeight}`);
	if (typeof rect.setPixel !== 'function')
		throw new Error(`rect.setPixel must be a function but got ${rect.setPixel}`);
	if (typeof isForProduction !== 'boolean')
		throw new Error(`isForProduction must be boolean but got ${isForProduction}`);
	const code = `for ["x 0 ${rect.sampleWidth - 1}] [
	for ["y 0 ${rect.sampleHeight - 1}] [
		print :x * ${1/rect.sampleWidth}
		print :y * ${1/rect.sampleHeight}
	]
]`;
	const logger = new ParseLogger();
	const rootToken = LogoParser.getParseTree(code, logger, proceduresMap);
	let program = compile(code, rootToken, logger, proceduresMap,
		compileOptions, initialVariableMap);
	const instructions = program.instructions;
	let printIndex = ArrayUtils.indexOfMatch(instructions, isPrintCall);
	if (printIndex === -1)
		throw new Error(`Unable to find print call in compiled rect program`);
	const printToken = instructions[printIndex].parseTreeToken;
	for (let i = instructions.length - 1; i >= 0; i--) {
		const instruction = instructions[i];
		if (isPrintCall(instruction)) {
			if (isPop(instructions[i + 1]))
				removeInstructions(instructions, i, 2);
			else
				removeInstructions(instructions, i, 1);
		}
	}
	// insert a call to the procedure(getColorProcedureName).
	const proc = proceduresMap.get(getColorProcedureName);
	const procInstruction = new CallProcedureInstruction(proc, printToken);
	// insert an instruction to call a JavaScript function.
	function setPixel(x, y, color) {
		if (!isNumber(x))
			throw new Error(`x must be a number.  Not: ${x}`);
		if (!isNumber(y))
			throw new Error(`y must be a number.  Not: ${y}`);
		let red, green, blue, alpha;
		if (color === Transparent) {
			red = 0;
			green = 0;
			blue = 0;
			alpha = 0;
		}
		else if (color instanceof Colour) {
			red = color.rgbArray[0];
			green = color.rgbArray[1];
			blue = color.rgbArray[2];
			alpha = 255;
		}
		else {
			if (!(color instanceof AlphaColour))
				color = new AlphaColour(color);
			red = color.rgbArray[0];
			green = color.rgbArray[1];
			blue = color.rgbArray[2];
			alpha = color.alpha;
		}
		if (Math.random() < 0.0001) {
			console.log(`setPixel about to be called. x=${x}, y=${y}, red=${red}, green=${green}, blue=${blue}, alpha=${alpha}`);
		}
		rect.setPixel(x, y, red, green, blue, alpha);
	}
	const index = getXandYReadIndex(instructions);
	const readXInstruction = new VariableReadInstruction('x', printToken);
	const readYInstruction = new VariableReadInstruction('y', printToken);
	instructions.splice(index, 0, readXInstruction, readYInstruction);
	const jsCallInstruction = new JavaScriptFunctionCallInstruction(setPixel, 3, false, printToken);
	const insertIndex = getInsertIndex(instructions);
	instructions.splice(insertIndex, 0, procInstruction, jsCallInstruction);
	if (isForProduction) {
		simplifyInstructions(instructions, [], false, productionCompileOptions);
	}
	return program;
};