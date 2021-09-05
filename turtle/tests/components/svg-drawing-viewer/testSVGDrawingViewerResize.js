import { cleanBorderSize } from '../../../modules/components/svg-drawing-viewer/cleanBorderSize.js';
import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { createTestDrawingFromDimensions } from '../../helpers/createTestDrawingFromDimensions.js';
import { DeepEquality } from '../../../modules/DeepEquality.js';
import { isNumber } from '../../../modules/isNumber.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { sleep } from '../../helpers/sleep.js';
import { SVGDrawingViewer } from '../../../modules/components/svg-drawing-viewer/SVGDrawingViewer.js';

async function createTestViewer(logger, initialAspectRatio, drawing) {
	if (drawing === undefined)
		drawing = createTestDrawing();
	const div = document.createElement('div');
	div.style.height = '10px';
	div.style.width = '20px';
	document.body.appendChild(div);
	const box = div.getBoundingClientRect();
	if (box.width === 0 || box.height === 0) {
		logger(`container div expected to have non-zero width and height but got width=${box.width}, height=${box.height}`);
	}
	const result = new SVGDrawingViewer(div, drawing, initialAspectRatio);
	await sleep(100);
	return result;
}

function doubleContainerDimensions(viewer) {
	const box = viewer.container.getBoundingClientRect();
	viewer.container.style.width = `${box.width * 2}px`;
	viewer.container.style.height = `${box.height * 2}px`;
	viewer.updateDimensions();
}

function removeViewer(viewer) {
	document.body.removeChild(viewer.container);
}

async function testSetAspectRatio(logger) {
	const viewer = await createTestViewer(logger);
	if (viewer.width <= viewer.height)
		logger(`This test needs changes because the original dimensions don't fit the intended scenario.  width=${viewer.width}, height=${viewer.height}`);
	else {
		const originalWidth = viewer.width;
		const originalHeight = viewer.height;
		viewer.setAspectRatio(1);
		if (originalWidth !== viewer.width)
			logger(`Expected width to remain the same after calling setAspectRatio.  Original width=${originalWidth}.  New width is ${viewer.width}`);
		if (originalHeight !== viewer.height)
			logger(`Expected height to remain the same after calling setAspectRatio.  Original height=${originalHeight}.  New height is ${viewer.height}`);
		if (viewer.aspectRatio !== 1)
			logger(`Expected aspectRatio to become 1 but found ${viewer.aspectRatio}`);
		const mattingElement = viewer.container.querySelector('.aspect-ratio-matting');
		if (mattingElement === null)
			logger('Expected to find an element to represent aspect-ratio matting but did not find it');
		else if (mattingElement.hasAttribute('style') !== true)
			logger('Expected to style for border-width but did not find style attribute');
		else if (mattingElement.getAttribute('style').indexOf('border-width') === -1)
			logger('Expected to style for border-width but did not find border-width in the element\'s style');
		else {
			const expectedHorizontalBorderWidth = (originalWidth - originalHeight) / 2;
			const expectedVerticalBorderWidth = 0;
			const borderWidth = mattingElement.style.borderWidth;
			if (borderWidth.indexOf(' ') === -1)
				logger(`Expected border-width value to contain a space but no space found in "${borderWidth}"`);
			else {
				const parts = borderWidth.split(' ');
				const verticalBorderWidth = cleanBorderSize(parts[0]);
				const horizontalBorderWidth = cleanBorderSize(parts[1]);
				if (horizontalBorderWidth !== expectedHorizontalBorderWidth)
					logger(`Expected the horizontal border-width to be ${expectedHorizontalBorderWidth} but got ${horizontalBorderWidth}`);
				if (verticalBorderWidth !== expectedVerticalBorderWidth)
					logger(`Expected the vertical border-width to be ${expectedVerticalBorderWidth} but got ${verticalBorderWidth}`);
			}
		}
	}
	removeViewer(viewer);
}

async function testUpdateDimensions(logger) {
	const viewer = await createTestViewer(logger);
	const originalScale = viewer.transformer.scale;
	const originalTranslation = viewer.transformer.translation.toArray();
	if (!isNumber(originalScale))
		logger(`Expected scale to be a number but got ${originalScale}`);
	viewer.updateDimensions(false);
	if (DeepEquality.equals(originalTranslation, viewer.transformer.translation.toArray()) !== true)
		logger('updateDimensions not expected to change translation when dimensions have not really '+
			`changed but they were changed from ${JSON.stringify(originalTranslation)} to ${viewer.transformer.translation.toArray()}`);
	if (originalScale !== viewer.transformer.scale)
		logger(`Expected scale to stay the same but it changed from ${originalScale} to ${viewer.transformer.scale}`);
	removeViewer(viewer);
}

/*
Simulates the way an SVGDrawingViewer is used by the PDF Exporter and PostScript Exporter
*/
async function testSimulatedUsageInDialog(logger) {
	const viewer = await createTestViewer(logger);
	const originalWidth = viewer.width;
	const originalHeight = viewer.height;
	const originalScale = viewer.transformer.scale;
	viewer.zoomIn();
	let expectedScale = originalScale * 1.1;
	if (viewer.transformer.scale !== expectedScale)
		logger(`Immediately after zoomIn(), expected scale to be ${expectedScale} but got ${viewer.transformer.scale}.  originalScale=${originalScale} before zoomIn()`);
	viewer.updateDimensions(false);
	if (viewer.transformer.scale !== expectedScale)
		logger(`Immediately after updateDimenisions(false), expected scale to be ${expectedScale} but got ${viewer.transformer.scale}.  originalScale=${originalScale} before zoomIn()`);

	doubleContainerDimensions(viewer);
	expectedScale *= 2;
	if (viewer.transformer.scale !== expectedScale)
		logger(`Immediately after doubling dimensions to double size, expected scale to be ${expectedScale} but got ${viewer.transformer.scale}.`);

	removeViewer(viewer);
}

async function testTightFitWithAspectRatio(logger) {
	const wideDrawing = createTestDrawingFromDimensions(20, 10);
	const viewer = await createTestViewer(logger, 1, wideDrawing);
	const actualScale = viewer.transformer.scale;
	const containerBox = viewer.container.getBoundingClientRect();
	const expectedMaxScale = containerBox.height / 20;
	const expectedMinScale = expectedMaxScale * 0.8;
	// scale should be between 0.4 and 0.5
	if (actualScale < expectedMinScale || actualScale > expectedMaxScale)
		logger(`scale expected to be between ${expectedMinScale} and ${expectedMaxScale} but got ${actualScale}`);
	removeViewer(viewer);
}

export function testSVGDrawingViewerResize(logger) {
	testSetAspectRatio(prefixWrapper('testSetAspectRatio', logger));
	testSimulatedUsageInDialog(prefixWrapper('testSimulatedUsageInDialog', logger));
	testTightFitWithAspectRatio(prefixWrapper('testTightFitWithAspectRatio', logger));
	testUpdateDimensions(prefixWrapper('testUpdateDimensions', logger));
};