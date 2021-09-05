import { bindZoomItemsToViewer } from '../bindZoomItemsToViewer.js';
import { Dialog } from '../../../components/Dialog.js';
import { fetchText } from '../../../fetchText.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';
import { PageSize } from '../../../drawing/drawers/post-script/PageSize.js';
import { PostScriptLocalStorage } from './PostScriptLocalStorage.js';
import { previewerDownload } from '../drawing-download/previewerDownload.js';
import { removeScreenColor } from './removeScreenColor.js';
import { SVGDrawingViewer } from '../../../components/svg-drawing-viewer/SVGDrawingViewer.js';
import { Transformer } from '../../../components/svg-drawing-viewer/Transformer.js';

/*
This article has a similar idea of converting Logo drawings to PostScript.
It looks like they're generating far more clean and concise PostScript code by translating Logo code directly to PostScript instead of what this exporter does.
This exporter goes from a vector-based drawing to PostScript.
https://view.officeapps.live.com/op/view.aspx?src=http%3A%2F%2Fvlado.fmf.uni-lj.si%2Feduca%2Flogo%2Flogo2ps%2Flogo2ps.doc%23%3A~%3Atext%3DA%2520picture%2520produced%2520by%2520logo%2520on%2520the%2520screen%2Cthe%2520mirroring%2520of%2520turtle%2520movement%2520in%2520the%2520PostScript.&wdOrigin=BROWSELINK
A program tied to the paper is at:
http://vlado.fmf.uni-lj.si/educa/logo/logo2ps/logo2ps.zip
*/
const html = await fetchText('content/drawing/download/post-script.html');
var viewer;
var ignoreScreenColor = true;
var postScriptDrawing;

function downloadClicked(drawing, transformer) {
	const pageSize = PageSize.getDefaultPageSize();
	const transformer2 = new Transformer(pageSize.getWidthPostScriptUnits(), pageSize.getHeightPostScriptUnits());
	const aspectWidth = viewer.getAspectWidth();
	const scaleFactor = pageSize.getWidthPostScriptUnits() / aspectWidth;
	transformer2.scale = transformer.scale * scaleFactor;
	const translationFromCentre = transformer.translation.minus(transformer.getCentreOffset().multiply(1 / transformer.scale));
	translationFromCentre.setY(-translationFromCentre.getY());
	transformer2.translation = translationFromCentre.plus(transformer2.getCentreOffset().multiply(1 / transformer2.scale));
	previewerDownload(drawing, transformer2, 'application/postscript');
}

function initializeViewer(postScriptDrawing) {
	const container = document.getElementById('post-script-drawing-container');
	const pageSize = PageSize.getDefaultPageSize();
	const aspectRatio = pageSize.getWidthPostScriptUnits() / pageSize.getHeightPostScriptUnits();
	viewer = new SVGDrawingViewer(container, postScriptDrawing, aspectRatio);
	bindZoomItemsToViewer('post-script-', viewer);
}

function refreshSanitizedDrawing() {
	postScriptDrawing = GraphicsScreen.drawing;
	if (ignoreScreenColor)
		postScriptDrawing = removeScreenColor(postScriptDrawing);
}

export function showPostScriptPreviewer() {
	viewer = undefined;
	// viewer = undefined needed in case the dialog is opened a second time.
	// We need to indicate that it hasn't been initialized for the 
	// current showing of the dialog.

	Dialog.show(html, 'PostScript Downloader', 400, 350, {
		'helpID': 'postscript-exporter',
		'okClicked': function() {
			downloadClicked(postScriptDrawing, viewer.transformer);
		},
		'okCaption': 'Download',
		'isCancelingOnClickOut': false,
		'onResize': function() {
			if (viewer !== undefined)
				viewer.updateDimensions(false);
		}
	});
	const ignoreScreenColorCheckbox = document.getElementById('post-script-ignore-screen-color');
	PostScriptLocalStorage.loadFromLocalStorage(ignoreScreenColorCheckbox);
	ignoreScreenColor = ignoreScreenColorCheckbox.checked;
	refreshSanitizedDrawing();
	function saveToLocalStorage() {
		PostScriptLocalStorage.saveToLocalStorage(ignoreScreenColorCheckbox);
	}
	ignoreScreenColorCheckbox.addEventListener('change', function() {
		ignoreScreenColor = ignoreScreenColorCheckbox.checked;
		refreshSanitizedDrawing();
		if (viewer !== undefined)
			viewer.setDrawing(postScriptDrawing, true);
		saveToLocalStorage();
	});
	setTimeout(function() {
		initializeViewer(postScriptDrawing);
	}, 0);
};