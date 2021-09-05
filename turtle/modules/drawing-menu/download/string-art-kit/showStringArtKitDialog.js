import { Dialog } from '../../../components/Dialog.js';
import { drawingToStringArtKitDrawing } from './drawingToStringArtKitDrawing.js';
import { fetchText } from '../../../fetchText.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';
import { previewerDownload } from '../drawing-download/previewerDownload.js';
import { SVGDrawingViewer } from '../../../components/svg-drawing-viewer/SVGDrawingViewer.js';
const html = await fetchText('content/drawing/download/string-art-kit.html');
let viewer;

function downloadStringArtKitClicked(drawing, transformer) {
	previewerDownload(drawing, transformer, 'image/svg+xml');
}

export function showStringArtKitDialog() {
	const stringArtKitDrawing = drawingToStringArtKitDrawing(GraphicsScreen.drawing);

	let originalTransformer;
	Dialog.show(html, 'String-Art Template Downloader', 400, 350, {
		'okClicked': function() {
			const width = 800;
			const height = 500;
			const scale = viewer._getScaleForDimensions(width, height);
			const oldScale = originalTransformer.scale;
			originalTransformer.setDimensions(width, height);
			originalTransformer.multiplyScaleBy(scale / oldScale);
			downloadStringArtKitClicked(stringArtKitDrawing, originalTransformer);
		},
		'okCaption': 'Download',
		'onResize': function() {
			if (viewer !== undefined)
				setTimeout(function() {
					viewer._updateDimensions();
				}, 0); // timeout to let the boundingclientrect update before calling updateDimensions.
		},
		'isCancelingOnClickOut': false,
		'helpID': 'string-art-template'
	});
	const container = document.getElementById('svg-drawing-container');
	viewer = new SVGDrawingViewer(container, stringArtKitDrawing);
	originalTransformer = viewer.transformer.clone();
	const zoomIn = document.getElementById("string-art-kit-zoom-in");
	const zoomOut = document.getElementById("string-art-kit-zoom-out");
	zoomIn.addEventListener('click', function() {
		viewer.zoomIn();
	});
	zoomOut.addEventListener('click', function() {
		viewer.zoomOut();
	});
};