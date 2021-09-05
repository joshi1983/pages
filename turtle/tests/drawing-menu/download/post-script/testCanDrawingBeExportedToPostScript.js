import { canDrawingBeExportedToPostScript } from '../../../../modules/drawing-menu/download/post-script/canDrawingBeExportedToPostScript.js';
import { createTestDrawing } from '../../../helpers/createTestDrawing.js';
import { createTestPostScriptDrawing } from '../../../helpers/createTestPostScriptDrawing.js';

export function testCanDrawingBeExportedToPostScript(logger) {
	const drawing = createTestDrawing();
	if (canDrawingBeExportedToPostScript(drawing) !== false)
		logger('Did not expect the test drawing to be exportable to PostScript because it contains elliptical arcs, a sphere, and gradient');
	const drawing2 = createTestPostScriptDrawing();
	if (canDrawingBeExportedToPostScript(drawing2) !== true)
		logger('Expected drawing to be exportable to PostScript');
};