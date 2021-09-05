import { compile } from '../../modules/parsing/compile.js';
import { compileOptionsArray } from '../../tests/parsing/execution/compileOptionsArray.js';
import { HaltType } from './HaltType.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { LogoProgramExecuter } from '../../modules/parsing/execution/LogoProgramExecuter.js';
import { ParseLogger } from '../../modules/parsing/loggers/ParseLogger.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { Vector } from '../../modules/drawing/vector/Vector.js';
import { VectorDrawing } from '../../modules/drawing/vector/VectorDrawing.js';
const maxInstructions = 40000;

function getResultsFromOptions(code, compileOptions) {
	const parseLogger = new ParseLogger();
	const parseTree = LogoParser.getParseTree(code, parseLogger);
	const extraProcedures = new Map();
	const initialVariables = new Map();
	const program = compile(code, parseTree, parseLogger, extraProcedures, compileOptions, initialVariables);
	const result = {'messages': [], 'shapes': [], 'haltType': undefined};
	function handleException() {
		result.haltType = HaltType.EXCEPTION;
	}
	const drawing = new VectorDrawing();
	const turtle = new Turtle({
		'animationDurationSeconds': 10,
		'animationTime': 0,
		'print': function(msg) {
			result.messages.push(msg);
		}
	}, drawing);
	const executer = new LogoProgramExecuter(turtle, program);
	executer.addEventListener('exception', handleException);
	executer.executeInstructionsSync(maxInstructions);
	if (result.haltType !== HaltType.EXCEPTION) {
		if (executer.isPausedOrHalted())
			result.haltType = HaltType.NORMAL;
		else
			result.haltType = HaltType.MAX_TIME;
	}
	result.shapes = drawing.getShapesArray();
	return result;
}

function isShapeEqual(shape1, shape2) {
	if (shape1.constructor.name !== shape2.constructor.name)
		return false;
	if (!Vector.coordsEqual(shape1.position.coords, shape2.position.coords))
		return false;
	const box1 = shape1.getBoundingBox();
	const box2 = shape2.getBoundingBox();
	if (!Vector.coordsEqual(box1.min.coords, box2.min.coords))
		return false;
	if (!Vector.coordsEqual(box1.max.coords, box2.max.coords))
		return false;
	if (!shape1.style.equals(shape2.style))
		return false;
	return true;
}

function areShapesEqual(shapes1, shapes2) {
	if (shapes1.length !== shapes2.length)
		return false;
	for (let i = 0; i < shapes1.length; i++) {
		if (!isShapeEqual(shapes1[i], shapes2[i]))
			return false;
	}
	return true;
}

function areMessagesEqual(messages1, messages2) {
	if (messages1.length !== messages2.length)
		return false;
	for (let i = 0; i < messages1.length; i++) {
		if (messages1[i] !== messages2[i])
			return false;
	}
	return true;
}

export function getResultsForCode(code) {
	const result = compileOptionsArray.map(function(compileOptions) {
		return getResultsFromOptions(code, compileOptions);
	});
	for (let i = 1; i < result.length; i++) {
		const single = result[i];
		single.isMessageError = !areMessagesEqual(single.messages, result[0].messages);
		single.isShapeError = !areShapesEqual(single.shapes, result[0].shapes);
		single.isError = single.isMessageError || single.isShapeError || single.haltType === HaltType.EXCEPTION;
	}
	return result;
};