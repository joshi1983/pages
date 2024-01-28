import { ExportTypeSelector } from './ExportTypeSelector.js';

function showDownloadDialog() {
	ExportTypeSelector.show();
}

const downloadItem = document.getElementById('drawing-download');
downloadItem.addEventListener('click', showDownloadDialog);