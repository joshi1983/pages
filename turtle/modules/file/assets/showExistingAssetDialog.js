import { addAssetToCode, shouldShowAddToCodeButton } from './addAssetToCode.js';
import { AssetRepository } from '../../assets/AssetRepository.js';
import { Dialog } from '../../components/Dialog.js';
import { DialogGroups } from '../../components/dialog/DialogGroups.js';
import { downloadAsset } from './downloadAsset.js';
import { fetchText } from '../../fetchText.js';
import { GeneralAssetViewer } from './asset-viewers/GeneralAssetViewer.js';
import { showRenameAssetDialog } from './showRenameAssetDialog.js';
const html = await fetchText('content/assets/view-existing.html');

export function showExistingAssetDialog(assetFilename) {
	const asset = AssetRepository.getAssetByFilename(assetFilename);
	const viewer = GeneralAssetViewer.createAssetViewer(asset);
	const footerButtons = [
		{
			'caption': 'Download',
			'click': function() {
				downloadAsset(asset);
			},
			'title': `Click to download ${assetFilename}`
		},
		{
			'caption': 'Rename',
			'click': function() {
				Dialog.hide();
				setTimeout(function() {
					showRenameAssetDialog(assetFilename);
				}, 0);
			},
			'title': `Click to rename asset ${assetFilename}`
		}
	];
	if (shouldShowAddToCodeButton(viewer)) {
		footerButtons.push({
			'caption': 'Add to Code',
			'click': function() {
				addAssetToCode(asset, viewer);
			},
			'title': `Click to add code that draws ${assetFilename}`
		});
	}
	const promise = Dialog.show(html, `Asset: ${assetFilename}`, undefined, undefined, {
		'groupId': DialogGroups.ASSETS,
		'showOkButton': true,
		'cancelCaption': 'Delete',
		'cancelClicked': function() {
			if (asset !== undefined) {
				asset.removeFromLocalStorage();
				AssetRepository.remove(asset);
			}
		},
		'footerButtons': footerButtons
	});
	const display = document.getElementById('asset-display');
	const deleteButton = document.getElementById('dialog-footer-cancel');
	deleteButton.setAttribute('title', `Click to delete ${assetFilename}`);
	if (asset === undefined) {
		display.innerText = `Asset not found with name: "${assetFilename}"`;
		deleteButton.style.display = 'none'; // hide cancel/delete button.
	}
	else {
		const div = viewer.getDiv();
		display.appendChild(div);
	}
	return promise;
};