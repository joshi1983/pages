import { GraphicsScreen } from '../../components/GraphicsScreen.js';
import { isRefreshNeeded } from './isRefreshNeeded.js';
import { refreshIndexColumnWidth } from './refreshIndexColumnWidth.js';
import { ShapeDisplay } from './ShapeDisplay.js';

const shapeDisplays = [];

function freeAllShapeDisplays() {
	for (let i = 0; i < shapeDisplays.length; i++) {
		shapeDisplays[i].unbind();
	}
	shapeDisplays.length = 0;
}

function blurAllDisplaysExcept(shapeDisplay) {
	return function() {
		for (let i = 0; i < shapeDisplays.length; i++) {
			const _shapeDisplay = shapeDisplays[i];
			if (shapeDisplay !== _shapeDisplay)
				_shapeDisplay.blur();
		}
	};
}

export function refreshShapeElements(maxConcurrentShapes, shapeExplorerElement, slider, 
shapeRangeDescription, shapesContainer, preferredMinIndex) {
	const shapes = GraphicsScreen.drawing.foreground.shapes;
	const numShapes = shapes.length;
	slider.setAttribute('max', Math.max(0, Math.ceil((numShapes - maxConcurrentShapes) / maxConcurrentShapes)));
	let min = parseInt(slider.value) * maxConcurrentShapes;
	if (Number.isInteger(preferredMinIndex))
		min = preferredMinIndex;
	let max = min + maxConcurrentShapes;
	if (max >= numShapes) {
		max = numShapes;
		min = Math.max(0, max - maxConcurrentShapes);
	}
	if (numShapes !== 0)
		shapeRangeDescription.innerText = `Shapes ${min + 1}..${max} of ${numShapes}`;
	refreshIndexColumnWidth(max, shapeExplorerElement);
	if (isRefreshNeeded(shapesContainer, min, max)) {
		shapesContainer.innerText = '';
		freeAllShapeDisplays();
		for (let i = min; i < max; i++) {
			const display = new ShapeDisplay(shapes[i], i + 1);
			shapesContainer.appendChild(display.toDiv());
			display.addEventListener('focus', blurAllDisplaysExcept(display));
			shapeDisplays.push(display);
		}
	}
};