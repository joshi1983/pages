import { Dialog } from '../../components/Dialog.js';
import { DialogGroups } from '../../components/dialog/DialogGroups.js';
import { fetchText } from '../../fetchText.js';
import { SearchResults } from './SearchResults.js';
import { showExistingAssetDialog } from './showExistingAssetDialog.js';
import { showNewAssetDialog } from './showNewAssetDialog.js';
const html = await fetchText('content/assets/index.html');

SearchResults.addEventListener('asset-selected', function(event) {
	showExistingAssetDialog(event.details.filename).then(showAssetIndex);
});

function bindNewAssetButton() {
	const button = document.getElementById('asset-index-new-asset');
	button.addEventListener('click', function() {
		showNewAssetDialog().then(showAssetIndex);
	});
}

export function showAssetIndex() {
	Dialog.show(html, 'Asset Index', undefined, undefined, {
		'groupId': DialogGroups.ASSETS,
		'helpID': 'assets',
		'showGroupIcon': false
	});
	bindNewAssetButton();
	SearchResults.bindListeners();
};
