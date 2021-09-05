import { testCanvas } from './canvas/testCanvas.js';
import { testCanvasAndSVGLooksSameWithCode } from './testCanvasAndSVGLooksSameWithCode.js';
import { testCanvasAndSVGLooksSameWithShapes } from './testCanvasAndSVGLooksSameWithShapes.js';
import { testCanvasVector2DDrawer } from './testCanvasVector2DDrawer.js';
import { testCanvasWireDrawer } from './testCanvasWireDrawer.js';
import { testCompareCanvases } from './testCompareCanvases.js';
import { testPDF } from './pdf/testPDF.js';
import { testPDFDrawer } from './testPDFDrawer.js';
import { testPostScript } from './post-script/testPostScript.js';
import { testPostScriptDrawer } from './testPostScriptDrawer.js';
import { testSVG } from './svg/testSVG.js';
import { testSVGToCanvas } from './testSVGToCanvas.js';
import { testSVGVector2DDrawer } from './testSVGVector2DDrawer.js';
import { testTransformers } from './transformers/testTransformers.js';
import { testWire } from './wire/testWire.js';
import { testX3D } from './x3d/testX3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testDrawers(logger) {
	wrapAndCall([
		testCanvas,
		testCanvasAndSVGLooksSameWithCode,
		testCanvasAndSVGLooksSameWithShapes,
		testCanvasVector2DDrawer,
		testCanvasWireDrawer,
		testCompareCanvases,
		testPDF,
		testPDFDrawer,
		testPostScript,
		testPostScriptDrawer,
		testSVG,
		testSVGToCanvas,
		testSVGVector2DDrawer,
		testTransformers,
		testWire,
		testX3D
	], logger);
};