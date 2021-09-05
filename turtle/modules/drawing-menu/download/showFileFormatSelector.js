import { Code } from '../../components/code-editor/Code.js';
import { Dialog } from '../../components/Dialog.js';
import { downloadDataUrl } from '../../components/downloadDataUrl.js';
import { fetchText } from '../../fetchText.js';
import { FileExtensions } from './FileExtensions.js';
import { GraphicsScreen } from '../../components/GraphicsScreen.js';
import { Settings } from '../../Settings.js';
import { SVGPreviewer } from './drawing-download/SVGPreviewer.js';
import { SVGVector2DDrawer } from '../../drawing/drawers/SVGVector2DDrawer.js';
const drawing = Settings.drawing;
const drawingDownloadHTML = await fetchText('content/drawing/download/drawing-download.html');

function getMimeSelector() {
	return document.getElementById('download-format');
}

function refreshOptions() {
	FileExtensions.addOptionsToSelect(getMimeSelector(), function(fileFormat) {
		return fileFormat.mime.startsWith('image');
	});
}

export function getFilename(mime) {
	const i = mime.indexOf('/');
	let withoutExtension = Code.getFileName();
	const extensionIndex = withoutExtension.lastIndexOf('.');
	if (extensionIndex !== -1)
		withoutExtension = withoutExtension.substring(0, extensionIndex + 1);
	return withoutExtension + FileExtensions.getFileExtensionFromMime(mime);
};

function getSelectedMime() {
	return getMimeSelector().value;
}

function continueClicked() {
	const mime = getSelectedMime();
	setTimeout(function() {
		SVGPreviewer.show(mime);
	}, 0);
}

export function showFileFormatSelector() {
	Dialog.show(drawingDownloadHTML, 'Image Exporter', 200, 200, {
		'showCancel': true,
		'okClicked': continueClicked,
		'disableResize': true
	});
	refreshOptions();
};