import { getMaxPreviewDimensions } from './getInitialDimensionsForPreview.js';
import { isNumber } from '../../../isNumber.js';
import { SVGTransformer } from '../../../components/svg-drawing-viewer/SVGTransformer.js';

export function bindDimensionsToResizablePreviewer(previewContainer, resizableContainer, widthInput, heightInput, transformer) {
	if (!(previewContainer instanceof Element))
		throw new Error('previewContainer must be an Element');
	if (!(resizableContainer instanceof Element))
		throw new Error('resizableContainer must be an Element');
	if (!(widthInput instanceof Element))
		throw new Error('widthInput must be an Element');
	if (!(heightInput instanceof Element))
		throw new Error('heightInput must be an Element');
	if (!previewContainer.contains(resizableContainer))
		throw new Error('previewContainer must contain resizableContainer');
	if (!(transformer instanceof SVGTransformer))
		throw new Error('transformer must be an SVGTransformer');

	const max = 20000;
	const svg = resizableContainer.querySelector('svg');

	function refreshContainerSize(eventInfo) {
		const w = parseInt(widthInput.value.trim());
		const h = parseInt(heightInput.value.trim());
		if (isNaN(w) || isNaN(h) || w < 5 || h < 5 || w > max || h > max)
			return;

		const newDimensions = getMaxPreviewDimensions(previewContainer, w, h);
		const s = resizableContainer.style;
		s.width = newDimensions.w + 'px';
		s.height = newDimensions.h + 'px';
		s.marginTop = (-newDimensions.h * 0.5) + 'px';
		s.marginLeft = (-newDimensions.w * 0.5) + 'px';
		transformer.setDimensions(newDimensions.w, newDimensions.h);
		if (typeof eventInfo === 'object' && isNumber(eventInfo.previousWidth) && isNumber(eventInfo.newWidth)) {
			transformer.setScale(transformer.scale * eventInfo.newWidth / eventInfo.previousWidth);
			svg.setAttribute('height', '' + eventInfo.newHeight);
			svg.setAttribute('width', '' + eventInfo.newWidth);
		}
	}

	widthInput.addEventListener('input', refreshContainerSize);
	heightInput.addEventListener('input', refreshContainerSize);
	refreshContainerSize();
	return refreshContainerSize;
};