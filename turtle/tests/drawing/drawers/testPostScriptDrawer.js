import { createTestPostScriptDrawing } from '../../helpers/createTestPostScriptDrawing.js';
import { PageSize } from '../../../modules/drawing/drawers/post-script/PageSize.js';
import { PostScriptDrawer } from '../../../modules/drawing/drawers/PostScriptDrawer.js';
import { Vector2D } from '../../../modules/drawing/vector/Vector2D.js';

export function testPostScriptDrawer(logger) {
	const drawing = createTestPostScriptDrawing();
	const pageSize = PageSize.getPageSizeClosestToDimensions(100, 100);
	const drawer = new PostScriptDrawer(1, pageSize.getCentre(), pageSize);
	drawing.drawAsSingleLayer(drawer);
	const s = drawer.toString();
	if (typeof s !== 'string')
		logger('toString() must return a string but got: ' + s);
};