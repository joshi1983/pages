import { Colour } from '../../../../modules/Colour.js';
import { createTestPostScriptDrawing } from '../../../helpers/createTestPostScriptDrawing.js';
import { Transparent } from '../../../../modules/Transparent.js';
import { removeScreenColor } from '../../../../modules/drawing-menu/download/post-script/removeScreenColor.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';

export function testRemoveScreenColor(logger) {
	const drawing = createTestPostScriptDrawing();
	drawing.setScreenColor(new Colour('#f00'));
	const sanitizedDrawing = removeScreenColor(drawing);
	if (sanitizedDrawing.getScreenColor() !== Transparent && !sanitizedDrawing.getScreenColor().equals(new Colour('#fff')))
		logger('screen color should either be transparent or white after removeScreenColor but got ' + sanitizedDrawing.getScreenColor());
};