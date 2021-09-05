import { CallCommandInstruction } from
'../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { CallProcedureInstruction } from
'../../../modules/parsing/execution/instructions/CallProcedureInstruction.js';
import { compile } from '../../../modules/parsing/compile.js';
import { compileRectProgram } from '../../../modules/parsing/compiling/compileRectProgram.js';
import { createTestTurtle } from '../../helpers/createTestTurtle.js';
import { JavaScriptFunctionCallInstruction } from
'../../../modules/parsing/execution/instructions/JavaScriptFunctionCallInstruction.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { LogoProgram } from '../../../modules/parsing/execution/LogoProgram.js';
import { LogoProgramExecuter } from '../../../modules/parsing/execution/LogoProgramExecuter.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Rect } from '../../../modules/drawing/vector/shapes/procedural-raster-rectangle/Rect.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { VariableReadInstruction } from
'../../../modules/parsing/execution/instructions/VariableReadInstruction.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function isVariableRead(varName) {
	return function(instruction) {
		return (instruction instanceof VariableReadInstruction) &&
			instruction.variableName === varName;
	};
}

function testBasics(logger) {
	const code = `to getColor :xRatio :yRatio
	output [:xRatio + :yRatio :xRatio :yRatio]
end`;
	const rect = new Rect(0, 0, 10, 10, 1, 1);
	const getColorProcedureName = 'getcolor';
	const initialVariableMap = new Map();
	const compileOptions = {'translateToJavaScript': true};
	const parseLogger = new TestParseLogger(logger, code);
	const initialProcedures = new Map();
	const treeRoot = LogoParser.getParseTree(code, parseLogger);
	const startProgram = compile(code, treeRoot, parseLogger, initialProcedures,
		compileOptions, initialVariableMap);
	const proceduresMap = startProgram.procedures;
	if (!(proceduresMap instanceof Map))
		logger(`Expected a Map but got ${proceduresMap}`);
	else if (proceduresMap.size !== 1)
		logger(`Expected to have size 1 but got ${proceduresMap.size}`);
	const finalProgram = compileRectProgram(rect, getColorProcedureName, initialVariableMap, proceduresMap, false);
	if (!(finalProgram instanceof LogoProgram))
		logger(`finalProgram expected to be a LogoProgram but got ${finalProgram}`);
	const funcCalls = finalProgram.instructions.filter(function(instruction) {
		return instruction instanceof JavaScriptFunctionCallInstruction;
	});
	const procCalls = finalProgram.instructions.filter(function(instruction) {
		return instruction instanceof CallProcedureInstruction;
	});
	const printCalls = finalProgram.instructions.filter(function(instruction) {
		return instruction instanceof CallCommandInstruction &&
			instruction.command.primaryName === 'print';
	});
	const xVarReads = finalProgram.instructions.filter(isVariableRead('x'));
	const yVarReads = finalProgram.instructions.filter(isVariableRead('y'));
	if (funcCalls.length !== 1)
		logger(`Expected 1 call to a JavaScript function but got ${funcCalls.length}`);
	if (procCalls.length !== 1)
		logger(`Expected 1 call to a procedure but got ${procCalls.length}`);
	if (printCalls.length !== 0)
		logger(`Expected 0 calls to print but got ${printCalls.length}`);
	if (xVarReads < 1 || xVarReads > 2)
		logger(`Expected 1 or 2 x variable reads expected but got ${xVarReads.length}`);
	if (yVarReads < 1 || yVarReads > 2)
		logger(`Expected 1 or 2 y variable reads expected but got ${yVarReads.length}`);
}

function testRun(logger) {
	const code = `to getColor :xRatio :yRatio
		output "#10203040
	end`;
	const rect = new Rect(0, 0, 2, 3, 1, 1);
	const getColorProcedureName = 'getcolor';
	const initialVariableMap = new Map();
	const compileOptions = {'translateToJavaScript': true};
	const parseLogger = new TestParseLogger(logger, code);
	const initialProcedures = new Map();
	const treeRoot = LogoParser.getParseTree(code, parseLogger);
	const startProgram = compile(code, treeRoot, parseLogger, initialProcedures,
		compileOptions, initialVariableMap);
	const proceduresMap = startProgram.procedures;
	const finalProgram = compileRectProgram(rect, getColorProcedureName, initialVariableMap, proceduresMap, false);
	const turtle = createTestTurtle();
	const executer = new LogoProgramExecuter(turtle, finalProgram);
	executer.executeInstructionsSync(2000);
	// verify all rgba values match expectations.
	const pixels = rect.imageData.data;
	if (pixels.length !== 6 * 4)
		logger(`Expected pixels.length to be 6 * 4 or 24 but got ${pixels.length}`);
	if (executer.executionContext.valueStack.length !== 0)
		logger(`Expected valueStack.length to be 0 but got ${executer.executionContext.valueStack.length}.  The values are: ${executer.executionContext.valueStack.map(v => '' + v).join(',')}`);
	for (let i = (pixels.length - 1) & 0xffffffc; i >= 0; i -= 4) {
		const red = pixels[i];
		const green = pixels[i + 1];
		const blue = pixels[i + 2];
		const alpha = pixels[i + 3];
		const plogger = prefixWrapper(`i=${i}`, logger);
		if (red !== 0x20)
			plogger(`red value expected to be ${0x20} but got ${red}`);
		if (green !== 0x30)
			plogger(`green value expected to be ${0x30} but got ${green}`);
		if (blue !== 0x40)
			plogger(`blue value expected to be ${0x40} but got ${blue}`);
		if (alpha !== 0x10)
			plogger(`alpha value expected to be ${0x10} but got ${alpha}`);
	}
}

export function testCompileRectProgram(logger) {
	wrapAndCall([
		testBasics,
		testRun
	], logger);
};