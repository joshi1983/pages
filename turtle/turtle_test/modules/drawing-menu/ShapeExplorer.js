import { Dialog } from '../components/Dialog.js';
import { downloadShapesJSON } from './shape-explorer/downloadShapesJSON.js';
import { fetchText } from '../fetchText.js';
import { getNumberOfShapes } from './shape-explorer/getNumberOfShapes.js';
import { refreshShapeElements } from './shape-explorer/refreshShapeElements.js';
import { refreshSliderVisibility } from './shape-explorer/refreshSliderVisibility.js';
const html = await fetchText('content/drawing/shapes/shape-explorer.html');
const shapesMenuItem = document.getElementById('drawing-shapes');
var header;
var slider;
var shapeExplorerElement;
var shapesContainer;
var shapeRangeDescription;
const maxConcurrentShapesForRestoredState = 10;
let maxConcurrentShapes = maxConcurrentShapesForRestoredState;
let lastUserSelectedMinIndex = 0;

function refreshShapes(preferredMinIndex) {
	lastUserSelectedMinIndex = parseInt(slider.value) * maxConcurrentShapes;
	refreshShapeElements(maxConcurrentShapes, shapeExplorerElement, slider, shapeRangeDescription, shapesContainer, preferredMinIndex);
}

function _refreshSliderVisibility() {
	const numShapes = getNumberOfShapes();
	refreshSliderVisibility(maxConcurrentShapes, numShapes, slider, shapeRangeDescription, header);
}

function windowResized() {
	if (Dialog.isMaximized())
		dialogResized();
}

function dialogClosed() {
	slider.removeEventListener('input', refreshShapes);
	window.removeEventListener('resize', windowResized);
	slider = undefined;
	shapesContainer = undefined;
	shapeRangeDescription = undefined;
}

function dialogResized() {
	if (shapesContainer === undefined)
		return;
	const dialogBody = document.querySelector('.dialog-body');
	const headingSize = header.getBoundingClientRect();
	const heading2Size = dialogBody.querySelector('header').getBoundingClientRect();
	const shapesContainerSize = dialogBody.getBoundingClientRect();
	let height = shapesContainerSize.height - headingSize.height - heading2Size.height;
	let newMaxConcurrentShapes;
	if (Dialog.isMaximized())
		newMaxConcurrentShapes = Math.max(maxConcurrentShapesForRestoredState, Math.floor(height / 19.8));
	else {
		newMaxConcurrentShapes = maxConcurrentShapesForRestoredState;
	}
	if (newMaxConcurrentShapes !== maxConcurrentShapes) {
		let oldLastUserSelectedMinIndex = lastUserSelectedMinIndex;
		maxConcurrentShapes = newMaxConcurrentShapes;
		const newSliderValue = '' + Math.round(lastUserSelectedMinIndex / maxConcurrentShapes);
		// try to stay at roughly the same shape index range even though the number of concurrent shapes changed.
		refreshShapes(oldLastUserSelectedMinIndex);
		_refreshSliderVisibility();
		slider.value = newSliderValue;
		lastUserSelectedMinIndex = oldLastUserSelectedMinIndex; // restore the old value because user did not select it.
	}
}

function showShapeExplorer() {
	Dialog.show(html, 'Shapes Explorer', 400, 350, {
		'okCaption': 'Download JSON',
		'okClicked': downloadShapesJSON,
		'onResize': function() {setTimeout(dialogResized, 0); },
		'helpID': 'shapes-explorer'
	}).then(dialogClosed);
	shapeExplorerElement = document.getElementById('shape-explorer');
	slider = document.getElementById('shape-explorer-slider');
	shapesContainer = document.getElementById('shapes-container');
	shapeRangeDescription = document.getElementById('shape-explorer-range-description');
	header = shapeExplorerElement.querySelector('#shape-explorer header');
	slider.addEventListener('input', refreshShapes);
	_refreshSliderVisibility();
	refreshShapes();
	window.addEventListener('resize', windowResized);
}

shapesMenuItem.addEventListener('click', showShapeExplorer);