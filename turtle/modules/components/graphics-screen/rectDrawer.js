import { Code } from '../code-editor/Code.js';
import { compileRectProgram } from '../../parsing/compiling/compileRectProgram.js';
import { createEmptyProgram } from '../../parsing/compiling/createEmptyProgram.js';
import { GraphicsScreen } from '../GraphicsScreen.js';
import { LogoProgramExecuter } from '../../parsing/execution/LogoProgramExecuter.js';
import { RateLimiter } from '../../RateLimiter.js';
import { Rect } from '../../drawing/vector/shapes/procedural-raster-rectangle/Rect.js';
import { Settings } from '../../Settings.js';
import { Turtle } from '../../command-groups/Turtle.js';
import { Vector2DDrawing } from '../../drawing/vector/Vector2DDrawing.js';

const initProgram = createEmptyProgram();
const settings = {
	'animationDurationSeconds': 10,
	'animationTime': 0,
};
const drawing = new Vector2DDrawing();
const turtle = new Turtle(settings, drawing);
const executer = new LogoProgramExecuter(turtle, initProgram);
const procRectMap = new Map();
const rateKey = 'rectDrawer';
function refreshGraphics() {
	RateLimiter.run(rateKey, function() {
		GraphicsScreen.redraw();
	}, 30);
}

executer.addEventListener('execution-stopped', function() {
	const rectsNeedingImages = getRectsNeedingImages();
	if (rectsNeedingImages.length === 0) {
		refreshGraphics();
	}
	console.log(`execution-stopped, rectsNeedingImages.length = ${rectsNeedingImages.length}`);
});

function getRectsNeedingImages() {
	const result = [];
	for (let rect of procRectMap.values()) {
		if (rect.image === undefined) {
			console.log('calling getImage()');
			rect.getImage().then(refreshGraphics);
			result.push(rect);
		}
	}
	return result;
}

function redraw() {
	if (!Settings.executer.isPausedOrHalted())
		return;

	const proceduralRects = GraphicsScreen.drawing.getShapesArray().
		filter(shape => shape.constructor.name === 'ProceduralRasterRectangleShape');

	if (proceduralRects.length !== 0) {
		const isForProduction = false;
		const currentProgram = Code.getCurrentProgram();
		if (currentProgram !== undefined) {
			const initialVariableMap = new Map();
			const proceduresMap = currentProgram.procedures;
			proceduralRects.forEach(function(proceduralRect) {
				/*
				FIXME: Do we need to compile again?
				FIXME: Do we need to call compileRectProgram?
				
				*/
				const offsetXRatio = 0;
				const offsetYRatio = 0;
				const sampleWidth = proceduralRect.width;
				const sampleHeight = proceduralRect.height;
				const widthRatio = 1;
				const heightRatio = 1;
				if (procRectMap.has(proceduralRect)) {
					const r = procRectMap.get(proceduralRect);
					if (r.equalsBasic(offsetXRatio, offsetYRatio, sampleWidth, sampleHeight, widthRatio, heightRatio))
						return; // no need to recompute the same rect.
				}
				const rect = new Rect(offsetXRatio, offsetYRatio, sampleWidth, sampleHeight, widthRatio, heightRatio);
				procRectMap.set(proceduralRect, rect);
				proceduralRect.rects.push(rect);
				const program = compileRectProgram(rect, proceduralRect.procedureName.toLowerCase(), initialVariableMap, proceduresMap, isForProduction);
				executer.setProgram(program);
				executer.startContinuousExecution();
			});
		}
	}
}

GraphicsScreen.addEventListener('redraw', redraw);