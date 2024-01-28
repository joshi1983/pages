/*
This is the first step toward exporting.

The user is prompted to export a 2D drawing or an animation.
Later, other export options will be added such as 3D models.
*/
import { Dialog } from '../../components/Dialog.js';
import { fetchText } from '../../fetchText.js';
import { is2DDrawingOrImageSelectable } from './drawing-download/is2DDrawingOrImageSelectable.js';
import { isAnimationExportSelectable } from './animation-download/isAnimationExportSelectable.js';
import { isPDFSelectable } from './pdf/isPDFSelectable.js';
import { isPointCloudSelectable } from './point-clouds/isPointCloudSelectable.js';
import { isPostScriptSelectable } from './post-script/isPostScriptSelectable.js';
import { isStringArtKitSelectable } from './string-art-kit/isStringArtKitSelectable.js';
import { showAnimationDownloadDialog } from './animation-download/showAnimationDownloadDialog.js';
import { showPDFPreviewer } from './pdf/showPDFPreviewer.js';
import { showPointCloudDialog } from './point-clouds/showPointCloudDialog.js';
import { showPostScriptPreviewer } from './post-script/showPostScriptPreviewer.js';
import { showStringArtKitDialog } from './string-art-kit/showStringArtKitDialog.js';
import { Drawing2DPreviewer } from './drawing-download/Drawing2DPreviewer.js';
const exportTypeHTML = await fetchText('content/drawing/download/export-type-selector.html');

const exportTypes = [
	{
		'name': '2D Drawing or Image', 
		'className': 'fa fa-image',
		'click': Drawing2DPreviewer.show,
		'isSelectable': is2DDrawingOrImageSelectable
	},
	{
		'name': 'Animation Frames or Video',
		'className': 'fa fa-film',
		'click': showAnimationDownloadDialog,
		'isSelectable': isAnimationExportSelectable
	},
	{
		'name': 'PDF',
		'className': 'custom-icon pdf-icon',
		'click': showPDFPreviewer,
		'isSelectable': isPDFSelectable
	},
	{
		'name': 'Point Cloud',
		'className': 'custom-icon point-cloud-icon',
		'click': showPointCloudDialog,
		'isSelectable': isPointCloudSelectable
	},
	{
		'name': 'PostScript',
		'className': 'custom-icon post-script-icon',
		'click': showPostScriptPreviewer,
		'isSelectable': isPostScriptSelectable
	},
	{
		'name': 'String Art Template',
		'className': 'fa fa-dharmachakra',
		'click': showStringArtKitDialog,
		'isSelectable': isStringArtKitSelectable
	}
];

function showExportTypeSelector() {
	const selectableExportTypes = exportTypes.filter(et => et.isSelectable());
	if (selectableExportTypes.length === 1)
		selectableExportTypes[0].click();
	else {
		let height = 100 + Math.ceil(selectableExportTypes.length / 2) * 63;
		Dialog.show(exportTypeHTML, 'Export Type Selector', 400, height);
		const optionsContainer = document.getElementById('export-type-selector-options');
		let row;
		selectableExportTypes.forEach(function(exportType, index) {
			if (index % 2 === 0) {
				if (row !== undefined)
					optionsContainer.appendChild(row);
				row = document.createElement('div');
			}
			const button = document.createElement('button');
			button.innerText = exportType.name;
			const icon = document.createElement('span');
			icon.classList.add(...exportType.className.split(' '));
			button.appendChild(icon);
			button.addEventListener('click', exportType.click);
			row.appendChild(button);
		});
		optionsContainer.appendChild(row);
	}
}

class PrivateExportTypeSelector {
	show() {
		showExportTypeSelector();
	}
}

const ExportTypeSelector = new PrivateExportTypeSelector();
export { ExportTypeSelector };