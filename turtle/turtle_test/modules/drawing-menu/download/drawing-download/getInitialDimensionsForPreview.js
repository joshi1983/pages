import { GraphicsScreen } from '../../../components/GraphicsScreen.js';

export function getMaxPreviewDimensions(previewContainer, w, h) {
	if (!(previewContainer instanceof Element))
		throw new Error('previewContainer element must be an Element');
	if (typeof w !== 'number')
		throw new Error('w must be a number');
	if (typeof h !== 'number')
		throw new Error('h must be a number');

	const boundingRect = previewContainer.getBoundingClientRect();
	const padding = 5;
	const maxWidth = parseInt(boundingRect.width) - padding;
	const maxHeight = parseInt(boundingRect.height) - padding;
	const aspectRatio = w / h;
	if (maxWidth / aspectRatio > maxHeight) {
		return {
			'w': maxHeight * aspectRatio,
			'h': maxHeight
		};
	}
	else {
		return {
			'w': maxWidth,
			'h': maxWidth / aspectRatio
		};
	}
};

export function getInitialDimensionsForPreview(previewContainer, widthInput, heightInput) {
	const drawingDimensions = GraphicsScreen.getCanvasDimensions();
	widthInput.value = drawingDimensions.w;
	heightInput.value = drawingDimensions.h;
	return getMaxPreviewDimensions(previewContainer, drawingDimensions.w, drawingDimensions.h);
};