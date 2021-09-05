import { refreshNoShapes } from './refreshNoShapes.js';

export function refreshSliderVisibility(maxConcurrentShapes, numShapes, slider, shapeRangeDescription, header) {
	const newVisible = maxConcurrentShapes < numShapes;
	refreshNoShapes(numShapes, shapeRangeDescription, header);
	if (newVisible !== slider.classList.contains('hidden'))
		return; // nothing to do.
	if (newVisible) {
		slider.classList.remove('hidden');
	}
	else {
		slider.classList.add('hidden');
	}
};