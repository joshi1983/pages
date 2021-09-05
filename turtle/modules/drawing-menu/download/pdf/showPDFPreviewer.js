import { bindZoomItemsToViewer } from '../bindZoomItemsToViewer.js';
import { Dialog } from '../../../components/Dialog.js';
import { downloadClicked } from './downloadClicked.js';
import { fetchText } from '../../../fetchText.js';
import { GraphicsScreen } from '../../../components/GraphicsScreen.js';
import { PageSize } from '../../../drawing/drawers/post-script/PageSize.js';
import { PDFLocalStorage } from './PDFLocalStorage.js';
import { removeScreenColor } from '../post-script/removeScreenColor.js';
import { SVGDrawingViewer } from '../../../components/svg-drawing-viewer/SVGDrawingViewer.js';
const html = await fetchText('content/drawing/download/pdf.html');

function initializeViewer(container, drawing) {
	const viewer = new SVGDrawingViewer(container, drawing);
	const pageSize = PageSize.getDefaultPageSize();
	viewer.setAspectRatio(pageSize.getWidthPostScriptUnits() / pageSize.getHeightPostScriptUnits());
	bindZoomItemsToViewer('pdf-download-', viewer);
	return viewer;
}

export function showPDFPreviewer() {
	let viewer;
	let drawing = GraphicsScreen.drawing;
	let pageSizeSelect;
	Dialog.show(html, 'PDF Downloader', 400, 350, {
		'helpID': 'pdf-exporter',
		'okClicked': function() {
			const pageSize = PageSize.getPageSizes()[parseInt(pageSizeSelect.value)];
			const dimensions = pageSize.dimensionsInch;
			downloadClicked(viewer, drawing, dimensions.width, dimensions.height);
		},
		'okCaption': 'Download',
		'isCancelingOnClickOut': false,
		'onResize': function() {
			if (viewer !== undefined)
				viewer.updateDimensions(false);
		}
	});
	pageSizeSelect = document.getElementById('pdf-download-page-size');
	const ignoreScreenColorCheckbox = document.getElementById('pdf-ignore-screen-color');
	PageSize.fillSelect(pageSizeSelect);
	PDFLocalStorage.load(pageSizeSelect, ignoreScreenColorCheckbox);
	function saveToLocalStorage() {
		PDFLocalStorage.save(pageSizeSelect, ignoreScreenColorCheckbox);
	}
	function refreshDrawing() {
		if (ignoreScreenColorCheckbox.checked)
			drawing = removeScreenColor(GraphicsScreen.drawing);
		else
			drawing = GraphicsScreen.drawing;
		viewer.setDrawing(drawing);
	}
	const container = document.getElementById('pdf-drawing-container');
	function refreshDimensions() {
		const pageSize = PageSize.getPageSizes()[parseInt(pageSizeSelect.value)];
		const dimensions = pageSize.dimensionsInch;
		viewer.setAspectRatio(dimensions.width / dimensions.height);
		saveToLocalStorage();
	}
	setTimeout(function() {
		viewer = initializeViewer(container, drawing);
		pageSizeSelect.addEventListener('change', refreshDimensions);
		refreshDrawing();
		refreshDimensions();
		ignoreScreenColorCheckbox.addEventListener('click', function() {
			refreshDrawing();
			saveToLocalStorage();
		});
	}, 0);
};