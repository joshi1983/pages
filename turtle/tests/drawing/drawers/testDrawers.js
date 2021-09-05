import { prefixWrapper } from '../../helpers/prefixWrapper.js';
//import { testCanvas } from './canvas/testCanvas.js';
import { testCanvasAndSVGLooksSame } from './testCanvasAndSVGLooksSame.js';
/*import { testCanvasVector2DDrawer } from './testCanvasVector2DDrawer.js';
import { testCanvasWireDrawer } from './testCanvasWireDrawer.js';
import { testCompareCanvases } from './testCompareCanvases.js';
import { testPDF } from './pdf/testPDF.js';
import { testPDFDrawer } from './testPDFDrawer.js';
import { testPostScript } from './post-script/testPostScript.js';
import { testPostScriptDrawer } from './testPostScriptDrawer.js';
*/import { testSVG } from './svg/testSVG.js';
import { testSVGToCanvas } from './testSVGToCanvas.js';
import { testSVGVector2DDrawer } from './testSVGVector2DDrawer.js';
/*import { testTransformers } from './transformers/testTransformers.js';
import { testWire } from './wire/testWire.js';
*/
export function testDrawers(logger) {
	//testCanvas(prefixWrapper('testCanvas', logger));
	testCanvasAndSVGLooksSame(prefixWrapper('testCanvasAndSVGLooksSame', logger));
	/*testCanvasVector2DDrawer(prefixWrapper('testCanvasVector2DDrawer', logger));
	testCanvasWireDrawer(prefixWrapper('testCanvasWireDrawer', logger));
	testCompareCanvases(prefixWrapper('testCompareCanvases', logger));
	testPDF(prefixWrapper('testPDF', logger));
	testPDFDrawer(prefixWrapper('testPDFDrawer', logger));
	testPostScript(prefixWrapper('testPostScript', logger));
	testPostScriptDrawer(prefixWrapper('testPostScriptDrawer', logger));
	*/testSVG(prefixWrapper('testSVG', logger));
	testSVGToCanvas(prefixWrapper('testSVGToCanvas', logger));
	testSVGVector2DDrawer(prefixWrapper('testSVGVector2DDrawer', logger));
	/*testTransformers(prefixWrapper('testTransformers', logger));
	testWire(prefixWrapper('testWire', logger));*/
};