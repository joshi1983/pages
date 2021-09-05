import { bindDimensionsToResizablePreviewer } from './bindDimensionsToResizablePreviewer.js';
import { bindFileFormats, getMime } from './bindFileFormats.js';
import { bindZoom, unbindZoom } from './bindZoom.js';
import { Dialog } from '../../../components/Dialog.js';
import { dragTranslation } from '../../../components/svg-drawing-viewer/dragTranslation.js';
import { ElementResizeListener } from '../../../components/ElementResizeListener.js';
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

class PrivateDrawing2DPreviewer {
	show() {
		let dimensionsUpdated;
		let resizeListener;
		Dialog.show(html, 'Image Exporter', 400, 400, {
			'helpID': 'image-exporter',
			'okCaption': 'Download',
			'okClicked': downloadClicked,
			'onResize': function() {
				if (typeof dimensionsUpdated === 'function')
					setTimeout(dimensionsUpdated, 0); // wait for elements to resize.
			}
		}).then(function() {
			if (resizeListener !== undefined) {
				resizeListener.dispose();
				resizeListener = undefined;
			}
			dimensionsUpdated = undefined;
			unbindZoom();
		});
		const widthInput = document.getElementById('drawing-export-width');
		const heightInput = document.getElementById('drawing-export-height');

		function setDimensions(width, height) {
			widthInput.value = width;
			heightInput.value = height;
			dimensionsUpdated();
			updateDownloadEnabled();
		}
		const resolutionChanged = ResolutionDropdown('drawing-previewer-resolution-dropdown', setDimensions);
		const previewContainer = document.getElementById('drawing-previewer-preview-container');
		const previewResizableContainer = document.getElementById('drawing-previewer-resizable-container');
		const initialDimensions = getInitialDimensionsForPreview(previewContainer, widthInput, heightInput);
		const drawer = new SVGVector2DDrawer(initialDimensions.w, initialDimensions.h);
		let safeDrawing;
		function refreshSafeDrawing(mime) {
			if (mime !== 'image/svg+xml' && drawing.hasTaintedShapes()) {
				safeDrawing = drawing.getWithoutTaintedShapes();
				ToastMessages.warn(`${drawing.countTaintedShapes()} shapes were removed because they used insecure images from other origins which can not be exported to a raster format.`, false);
			}
			else
				safeDrawing = drawing.clone();
		}
		refreshSafeDrawing('image/jpg');
		safeDrawing.drawAsSingleLayer(drawer);
		const gID = 'previewerG';
		const text = drawer.toString({'gID': gID});
		previewResizableContainer.innerHTML = text;
		const g = previewResizableContainer.querySelector('#' + gID);
		const initialExportDimensions = GraphicsScreen.getCanvasDimensions();
		const transformer = new SVGTransformer(g, initialDimensions.w, initialDimensions.h);
		const initialScaleFactor = initialDimensions.w / initialExportDimensions.w;
		bindFileFormats(refreshSafeDrawing);
		transformer.setScale(initialScaleFactor);
		dimensionsUpdated = bindDimensionsToResizablePreviewer(previewContainer, previewResizableContainer, widthInput, heightInput, transformer);
		resizeListener = new ElementResizeListener(previewResizableContainer, dimensionsUpdated);
		mouseWheelZoom(previewResizableContainer, transformer);
		loadTransformFromCamera(GraphicsScreen.camera, transformer, initialScaleFactor);
		dragTranslation(previewResizableContainer, transformer);
		bindZoom(transformer);
		const downloadButton = document.getElementById('dialog-footer-ok');
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
		function customResolutionChanged() {
			const widthVal = widthInput.value;
			const heightVal = heightInput.value;
			if (isValidDimension(widthVal) && isValidDimension(heightVal)) {
				resolutionChanged(parseInt(widthVal), parseInt(heightVal));
			}
			updateDownloadEnabled();
		}
		widthInput.addEventListener('input', customResolutionChanged);
		heightInput.addEventListener('input', customResolutionChanged);
		function downloadClicked() {
			if (isValidDimensions()) {
				const w = sanitizeDimension(widthInput.value);
				const scaleFactor = w / transformer.width;
				transformer.setDimensions(w, sanitizeDimension(heightInput.value));
				transformer.multiplyScaleBy(scaleFactor);
				previewerDownload(safeDrawing, transformer, getMime());
			}
		}
	}
}

const Drawing2DPreviewer = new PrivateDrawing2DPreviewer();
export { Drawing2DPreviewer };