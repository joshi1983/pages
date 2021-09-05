import { AsyncParser } from '../../../../../modules/parsing/AsyncParser.js';
import { AsyncParseTask } from '../../../../../modules/parsing/AsyncParseTask.js';
import { createTestTurtle } from '../../../../helpers/createTestTurtle.js';
import { getProceduresMap } from '../../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { ProceduralRasterRectangleShape } from
'../../../../../modules/drawing/vector/shapes/ProceduralRasterRectangleShape.js';
import { Rect } from
'../../../../../modules/drawing/vector/shapes/procedural-raster-rectangle/Rect.js';
import { RectRenderer } from
'../../../../../modules/drawing/vector/shapes/procedural-raster-rectangle/RectRenderer.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

const parser = new AsyncParser();
const turtle = createTestTurtle();

async function createTestRenderer(logger) {
	const code = `to getColor :xRatio :yRatio
		output "red
	end

	proceduralImage "p 100 100`;
	const parseLogger = new TestParseLogger(logger, code);
	let procedures = new Map();
	const treeRoot = await parser.parse(code, AsyncParseTask.HIGH_PRIORITY, parseLogger, procedures);
	const rect = new Rect(0, 0, 2, 3, 1, 1);
	const position = new Vector3D();
	const initialVariables = new Map();
	const style = new ShapeStyle();
	const shape = new ProceduralRasterRectangleShape(position, 100, 100, Math.PI, 'getcolor', 
		initialVariables, style);
	procedures = getProceduresMap(treeRoot);
	const renderer = new RectRenderer(rect, shape, treeRoot, procedures, true);
	return renderer;
}

async function testAbort(logger) {
	const renderer = await createTestRenderer(logger);
	renderer.abort();
	const renderer2 = await createTestRenderer(logger);
	renderer2.start(turtle);
	renderer2.abort();
}

async function testSuccess(logger) {
	let isSuccessCalled = false;
	function success() {
		isSuccessCalled = true;
	}
	const renderer = await createTestRenderer(logger);
	const maxDelay = 10000;
	renderer.addEventListener('success', success);
	renderer.start(turtle);
	setTimeout(function() {
		if (isSuccessCalled !== true) {
			logger(`Expected success to be called in less than ${maxDelay}ms but that did not happen`);
		}
		renderer.dispose();
	}, maxDelay);
}

export async function testRectRenderer(logger) {
	wrapAndCall([
		testAbort,
		testSuccess
	], logger);
};