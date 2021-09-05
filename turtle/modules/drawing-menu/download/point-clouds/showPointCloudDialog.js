import { bindZoomItemsToViewer } from '../bindZoomItemsToViewer.js';
import { Colour } from '../../../Colour.js';
import { Dialog } from '../../../components/Dialog.js';
import { download } from './download.js';
import { drawingToPoints } from './drawingToPoints.js';
import { fetchText } from '../../../fetchText.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';
import { MouseWheelZoomAdjuster } from '../MouseWheelZoomAdjuster.js';
import { PointCloudFileFormats } from './PointCloudFileFormats.js';
import { PointCloudLocalStorage } from './PointCloudLocalStorage.js';
import { PointCloudPreviewer } from './PointCloudPreviewer.js';
import { RotatingTransformerModes } from '../RotatingTransformerModes.js';
const html = await fetchText('content/drawing/download/point-cloud.html');
let formatSelector;
let points;
let viewer;
let previousFormat;
const black = new Colour(0, 0, 0);

function downloadClicked() {
	download(drawingToPoints(GraphicsScreen.drawing), 'point-cloud', previousFormat);
}

function refreshPoints() {
	points = drawingToPoints(GraphicsScreen.drawing);
	if (viewer !== undefined) {
		const formatInfo = PointCloudFileFormats.getFormatInfoAtIndex(formatSelector.value);
		if (!formatInfo.supportsColour)
			points.forEach(p => {p.colour = black;});
		viewer.setPoints(points);
	}
}

export function showPointCloudDialog() {
	let mouseWheelAdjuster;
	Dialog.show(html, 'Point Cloud Exporter', 400, 350, {
		'helpID': 'point-cloud-exporter',
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
		viewer.dispose();
		viewer = undefined;
		formatSelector = undefined;
		if (mouseWheelAdjuster !== undefined) {
			mouseWheelAdjuster.unbind();
			mouseWheelAdjuster = undefined;
		}
	});
	formatSelector = document.getElementById('drawing-point-cloud-file-format');
	const container = document.getElementById('drawing-point-cloud-preview-container');
	const rotatingMode = document.getElementById('drawing-point-cloud-rotating-mode');
	RotatingTransformerModes.populateSelect(rotatingMode);
	refreshPoints();
	viewer = new PointCloudPreviewer(container, points);
	bindZoomItemsToViewer('drawing-point-cloud-', viewer);
	PointCloudFileFormats.populateSelect(formatSelector);
	PointCloudLocalStorage.loadFromLocalStorage(formatSelector, rotatingMode);
	mouseWheelAdjuster = new MouseWheelZoomAdjuster(container, function(scaleFactor) {
		viewer.multiplyScaleBy(scaleFactor);
	});
	previousFormat = PointCloudFileFormats.getFormatInfoAtIndex(formatSelector.value);
	function saveToLocalStorage() {
		PointCloudLocalStorage.saveToLocalStorage(formatSelector, rotatingMode);
	}
	function refreshTransformingMode() {
		viewer.setRotatingMode(parseInt(rotatingMode.value));
		saveToLocalStorage();
	}
	formatSelector.addEventListener('change', function() {
		const newFormat = PointCloudFileFormats.getFormatInfoAtIndex(formatSelector.value);
		// if there is a need to refresh points, do it.
		if (previousFormat.supportsColour !== newFormat.supportsColour)
			refreshPoints();
		previousFormat = newFormat;
		saveToLocalStorage();
	});
	rotatingMode.addEventListener('change', refreshTransformingMode);
	refreshTransformingMode();
};