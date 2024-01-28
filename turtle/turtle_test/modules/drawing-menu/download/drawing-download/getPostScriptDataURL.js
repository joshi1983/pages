import { PostScriptDrawer } from '../../../drawing/drawers/PostScriptDrawer.js';
import { PageSize } from '../../../drawing/drawers/post-script/PageSize.js';

export function drawingToPostScriptText(drawing, transformer) {
	const drawer = new PostScriptDrawer(transformer.scale, transformer.translation,
		PageSize.getPageSizeClosestToDimensions(transformer.width, transformer.height));
	drawing = drawing.clone();
	drawing.setDimensions(transformer.width, transformer.height);
	drawing.drawAsSingleLayer(drawer);
	return drawer.toString();
};

export function getPostScriptDataURL(drawing, transformer) {
	const text = drawingToPostScriptText(drawing, transformer);
	return 'data:application/postscript;base64,' + btoa(text);
};