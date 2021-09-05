import { bindZoomItemsToViewer } from '../bindZoomItemsToViewer.js';
import { Colour } from '../../../Colour.js';
import { Dialog } from '../../../components/Dialog.js';
import { download } from './download.js';
import { drawingToLineSegments } from './drawingToLineSegments.js';
import { fetchText } from '../../../fetchText.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';
import { LineSegmentFileFormats } from './LineSegmentFileFormats.js';
import { LineSegmentsLocalStorage } from './LineSegmentsLocalStorage.js';
import { LineSegmentsPreviewer } from './LineSegmentsPreviewer.js';
import { MouseWheelZoomAdjuster } from '../MouseWheelZoomAdjuster.js';
import { RateLimiter } from '../../../RateLimiter.js';
import { RotatingTransformerModes } from '../RotatingTransformerModes.js';
const html = await fetchText('content/drawing/download/line-segments.html');
let formatSelector;
let lines;
let viewer;
let previousFormat;
let degreesPerSegment = 10;
const black = new Colour(0, 0, 0);

function downloadClicked() {
	download(drawingToLineSegments(GraphicsScreen.drawing, degreesPerSegment), 'line-segment', previousFormat);
}

function refreshLineSegments() {
	lines = drawingToLineSegments(GraphicsScreen.drawing, degreesPerSegment);
	if (viewer !== undefined) {
		const formatInfo = LineSegmentFileFormats.getFormatInfoAtIndex(formatSelector.value);
		if (!formatInfo.supportsColour)
			lines.forEach(line => {line.colour = black;});
		viewer.setLineSegments(lines);
	}
}

export function showLineSegmentsDialog() {
	let mouseWheelAdjuster, rotatingMode;
	Dialog.show(html, 'Line Segment Exporter', 400, 350, {
		'helpID': 'line-segments-exporter',
		'okClicked': function() {
			downloadClicked();
		},
		'okCaption': 'Download',
		'isCancelingOnClickOut': false,
		'onResize': function() {
			if (viewer !== undefined)
				viewer.updateDimensions();
		}
	}).then(function() {
		LineSegmentsLocalStorage.saveToLocalStorage(formatSelector, rotatingMode);
		viewer.dispose();
		viewer = undefined;
		formatSelector = undefined;
		if (mouseWheelAdjuster !== undefined) {
			mouseWheelAdjuster.unbind();
			mouseWheelAdjuster = undefined;
		}
	});
	formatSelector = document.getElementById('drawing-line-segments-file-format');
	const container = document.getElementById('drawing-line-segments-preview-container');
	rotatingMode = document.getElementById('drawing-line-segments-rotating-mode');
	const degreesPerSegmentInput = document.getElementById('drawing-line-segments-degrees-per-segment');
	degreesPerSegmentInput.addEventListener('input', function() {
		const val = parseInt(degreesPerSegmentInput.value);
		if (Number.isInteger(val)) {
			degreesPerSegment = val;
			RateLimiter.run('degrees-per-segment', refreshLineSegments, 50);
		}
	});
	RotatingTransformerModes.populateSelect(rotatingMode);
	refreshLineSegments();
	viewer = new LineSegmentsPreviewer(container, lines);
	bindZoomItemsToViewer('drawing-line-segments-', viewer);
	LineSegmentFileFormats.populateSelect(formatSelector);
	LineSegmentsLocalStorage.loadFromLocalStorage(formatSelector, rotatingMode);
	mouseWheelAdjuster = new MouseWheelZoomAdjuster(container, function(scaleFactor) {
		viewer.multiplyScaleBy(scaleFactor);
	});
	previousFormat = LineSegmentFileFormats.getFormatInfoAtIndex(formatSelector.value);
	function refreshTransformingMode() {
		viewer.setRotatingMode(parseInt(rotatingMode.value));
	}
	formatSelector.addEventListener('change', function() {
		const newFormat = LineSegmentFileFormats.getFormatInfoAtIndex(formatSelector.value);
		// if there is a need to refresh points, do it.
		if (previousFormat.supportsColour !== newFormat.supportsColour)
			refreshLineSegments();
		previousFormat = newFormat;
	});
	rotatingMode.addEventListener('change', refreshTransformingMode);
	refreshTransformingMode();
};