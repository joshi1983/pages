import { Asset } from '../../assets/Asset.js';
import { AssetRepository } from '../../assets/AssetRepository.js';
import { Dialog } from '../../components/Dialog.js';
import { DialogGroups } from '../../components/dialog/DialogGroups.js';
import { fetchText } from '../../fetchText.js';
import { isTooLargeException } from './isTooLargeException.js';
import { GeneralAssetViewer } from './asset-viewers/GeneralAssetViewer.js';
import { getFilenameFromPath } from './getFilenameFromPath.js';
import { sanitizeAssetFilename } from './sanitizeAssetFilename.js';
import { ToastMessages } from '../../components/ToastMessages.js';
const html = await fetchText('content/assets/upload.html');
var asset;

function bindUploadInput(uploadInput, filenameInput, viewerContainer, saveButton) {
	function copyFilenameFromUploadInput() {
		const filename = getFilenameFromPath(uploadInput.value);
		filenameInput.value = filename;
		if (uploadInput.files.length > 0 && uploadInput.files[0]) {
			const file = uploadInput.files[0];
			const reader = new FileReader();
			reader.onload = function(readerEvt) {
				const binaryString = readerEvt.target.result;
				asset = new Asset(filename, btoa(binaryString));
				const viewer = GeneralAssetViewer.createAssetViewer(asset);
				viewerContainer.innerText = '';
				viewerContainer.appendChild(viewer.getDiv());
			};
			reader.readAsBinaryString(file);
			saveButton.removeAttribute('disabled');
		}
	}
	uploadInput.addEventListener('change', copyFilenameFromUploadInput);
}

export function showNewAssetDialog(logger) {
	let saveButton, filenameInput;
	const promise = Dialog.show(html, 'Asset Upload', undefined, undefined, {
		'groupId': DialogGroups.ASSETS,
		'okCaption': 'Save',
		'okClicked': function() {
			if (!saveButton.hasAttribute('disabled')) {
				asset.filename = sanitizeAssetFilename(filenameInput.value);
				try {
					asset.saveToLocalStorage();
					AssetRepository.add(asset);
					ToastMessages.success(`Asset saved with filename: ${asset.filename}`, false);
				}
				catch (e) {
					if (isTooLargeException(e))
						ToastMessages.error(`Unable to save new asset because the file size is too large.  Try again with a smaller file.`, false);
					else
						ToastMessages.error(`Unable to save new asset because of an error.  The error message was: ${e}`, false);
				}
			}
			else {
				ToastMessages.warn('You can not save an asset until a file is selected.', false);
				return false;
			}
		},
		'showCancel': true
	});
	const uploadInput = document.getElementById('asset-upload-file');
	filenameInput = document.getElementById('asset-filename');
	const viewerContainer = document.getElementById('upload-asset-viewer');
	saveButton = document.getElementById('dialog-footer-ok');
	saveButton.setAttribute('disabled', '');
	bindUploadInput(uploadInput, filenameInput, viewerContainer, saveButton);
	return promise;
};