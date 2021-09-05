import { AssetRepository } from '../../assets/AssetRepository.js';
import { Dialog } from '../../components/Dialog.js';
import { DialogGroups } from '../../components/dialog/DialogGroups.js';
import { fetchText } from '../../fetchText.js';
import { GeneralAssetViewer } from './asset-viewers/GeneralAssetViewer.js';
import { sanitizeAssetFilename } from './sanitizeAssetFilename.js';
import { showAssetIndex } from './showAssetIndex.js';
const html = await fetchText('content/assets/rename.html');

function show(e) {
	e.style.display = 'block';
}

function hide(e) {
	e.style.removeProperty('display');
}

export function showRenameAssetDialog(assetFilename) {
	const asset = AssetRepository.getAssetByFilename(assetFilename);
	let newNameInput;
	const promise = Dialog.show(html, `Rename Asset: ${assetFilename}`, undefined, undefined, {
		'groupId': DialogGroups.ASSETS,
		'okCaption': 'Rename Asset',
		'okClicked': function() {
			const newFilename = sanitizeAssetFilename(newNameInput.value);
			if (asset !== undefined) {
				asset.removeFromLocalStorage();
				AssetRepository.remove(asset);
				asset.filename = newFilename;
				asset.saveToLocalStorage();
				AssetRepository.add(asset);
			}
		},
		'showCancel': true
	}).then(function() {
		showAssetIndex();
	});
	const display = document.getElementById('asset-display');
	const newNameElement = document.getElementById('rename-asset-quoted-new-filename');
	const takenMessageElement = document.getElementById('rename-asset-new-filename-taken');
	const unchangedFilenameElement = document.getElementById('rename-asset-new-filename-matches-old-filename');
	const okButton = document.getElementById('dialog-footer-ok');
	newNameInput = document.getElementById('rename-asset-new-name');
	newNameInput.value = assetFilename;
	if (asset === undefined) {
		display.innerText = `Asset not found with name: "${assetFilename}"`;
		newNameInput.style.display = 'none';
		okButton.setAttribute('disabled', '');
	}
	else {
		function filenameInputRefreshed() {
			const newFilename = sanitizeAssetFilename(newNameInput.value);
			newNameElement.innerText = newFilename;
			if (assetFilename === newFilename)
				show(unchangedFilenameElement);
			else
				hide(unchangedFilenameElement);
			if (assetFilename === assetFilename ||
			AssetRepository.getAssetByFilename(newFilename) === undefined)
				hide(takenMessageElement);
			else
				show(takenMessageElement);
			if (AssetRepository.getAssetByFilename(newFilename) !== undefined)
				okButton.setAttribute('disabled', '');
			else
				okButton.removeAttribute('disabled');
		}
		const viewer = GeneralAssetViewer.createAssetViewer(asset);
		const div = viewer.getDiv();
		display.appendChild(div);
		newNameInput.addEventListener('input', filenameInputRefreshed);
		filenameInputRefreshed();
	}
	return promise;
};