import { bindDimensionsToResizablePreviewer } from './bindDimensionsToResizablePreviewer.js';
import { Dialog } from '../../../components/Dialog.js';
import { dragTranslation } from '../../../components/svg-drawing-viewer/dragTranslation.js';
import { fetchText } from '../../../fetchText.js';
import { getInitialDimensionsForPreview } from './getInitialDimensionsForPreview.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';
import { isValidDimension } from './isValidDimension.js';
import { loadTransformFromCamera } from '../../../components/svg-drawing-viewer/loadTransformFromCamera.js';
import { mouseWheelZoom } from '../../../components/svg-drawing-viewer/mouseWheelZoom.js';
import { previewerDownload } from './previewerDownload.js';
import { ResolutionDropdown } from './ResolutionDropdown.js';
import { sanitizeDimension } from './sanitizeDimension.js';
import { Settings } from '../../../Settings.js';
import { SVGTransformer } from '../../../components/svg-drawing-viewer/SVGTransformer.js';
import { SVGVector2DDrawer } from '../../../drawing/drawers/SVGVector2DDrawer.js';
import { ToastMessages } from '../../../components/ToastMessages.js';
const html = await fetchText('content/drawing/download/2d-drawing-previewer.html');
const drawing = Settings.drawing;

class PrivateSVGPreviewer {
	show(mime) {
		if (typeof mime !== 'string')
			throw new Error('mime must be a string');
		let dimensionsUpdated = undefined;
		Dialog.show(html, 'Drawing Previewer', 400, 400, {
			'okCaption': 'Download',
			'okClicked': downloadClicked,
			'onResize': function() {
				if (typeof dimensionsUpdated === 'function')
					setTimeout(dimensionsUpdated, 0); // wait for elements to resize.
			}
		});
		const widthInput = document.getElementById('drawing-export-width');
		const heightInput = document.getElementById('drawing-export-height');

		function setDimensions(width, height) {
			widthInput.value = width;
			heightInput.value = height;
			dimensionsUpdated();
			updateDownloadEnabled();
		}
		new ResolutionDropdown('drawing-previewer-resolution-dropdown', setDimensions);
		const zoomIn = document.getElementById('drawing-previewer-zoom-in');
		const zoomOut = document.getElementById('drawing-previewer-zoom-out');
		const previewContainer = document.getElementById('drawing-previewer-preview-container');
		const previewResizableContainer = document.getElementById('drawing-previewer-resizable-container');
		const initialDimensions = getInitialDimensionsForPreview(previewContainer, widthInput, heightInput);
		const drawer = new SVGVector2DDrawer(initialDimensions.w, initialDimensions.h);
		let safeDrawing;
		if (mime !== 'image/svg+xml' && drawing.hasTaintedShapes()) {
			safeDrawing = drawing.getWithoutTaintedShapes();
			ToastMessages.warn(`${drawing.countTaintedShapes()} shapes were removed because they used insecure images from other origins which can not be exported to a raster format.`, false);
		}
		else
			safeDrawing = drawing.clone();
		safeDrawing.drawAsSingleLayer(drawer);
		const gID = 'previewerG';
		const text = drawer.toString({'gID': gID});
		previewResizableContainer.innerHTML = text;
		const g = previewResizableContainer.querySelector('#' + gID);
		const initialExportDimensions = GraphicsScreen.getCanvasDimensions();
		const transformer = new SVGTransformer(g, initialDimensions.w, initialDimensions.h);
		const initialScaleFactor = initialDimensions.w / initialExportDimensions.w;
		transformer.setScale(initialScaleFactor);
		dimensionsUpdated = bindDimensionsToResizablePreviewer(previewContainer, previewResizableContainer, widthInput, heightInput, transformer);
		mouseWheelZoom(previewResizableContainer, transformer);
		loadTransformFromCamera(GraphicsScreen.camera, transformer, initialScaleFactor);
		dragTranslation(previewResizableContainer, transformer);
		const downloadButton = document.getElementById('dialog-footer-ok');
		const zoomFactor = 1.1;
		zoomIn.addEventListener('click', function() {
			transformer.multiplyScaleBy(zoomFactor);
		});
		zoomOut.addEventListener('click', function() {
			transformer.multiplyScaleBy(1/zoomFactor);
		});
		function isValidDimensions() {
			return isValidDimension(widthInput.value) && isValidDimension(heightInput.value);
		}
		function updateDownloadEnabled() {
			let title = 'Click to download SVG';
			if (isValidDimensions()) {
				downloadButton.removeAttribute('disabled');
			}
			else {
				downloadButton.setAttribute('disabled', '');
				title = 'Unable to download because dimensions are invalid';
			}
			downloadButton.setAttribute('title', title);
		}
		widthInput.addEventListener('input', updateDownloadEnabled);
		heightInput.addEventListener('input', updateDownloadEnabled);
		function downloadClicked() {
			if (isValidDimensions()) {
				const w = sanitizeDimension(widthInput.value);
				const scaleFactor = w / transformer.width;
				transformer.setDimensions(w, sanitizeDimension(heightInput.value));
				transformer.multiplyScaleBy(scaleFactor);
				previewerDownload(safeDrawing, transformer, mime);
			}
		}
	}
}

const SVGPreviewer = new PrivateSVGPreviewer();
export { SVGPreviewer };