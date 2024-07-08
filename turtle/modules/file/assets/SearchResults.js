import { assetMatchesSearchQuery } from './assetMatchesSearchQuery.js';
import { AssetRepository } from '../../assets/AssetRepository.js';
import { compareAssetsByFilename } from './compareAssetsByFilename.js';
import { EventDispatcher } from '../../EventDispatcher.js';
import { GeneralAssetViewer } from './asset-viewers/GeneralAssetViewer.js';
import { sanitizeQuery } from '../../components/sanitizeQuery.js';

export class PrivateSearchResults extends EventDispatcher {
	constructor() {
		super(['asset-selected']);
		this.searchQuery = '';
	}

	bindListeners() {
		this.input = document.getElementById('asset-index-input');
		this.resultsContainer = document.getElementById('assets-search-results');
		this.input.value = this.searchQuery;
		const outer = this;
		this.input.addEventListener('input', function() {
			outer.refreshResults();
		});
		this.refreshResults();
	}

	refreshResults() {
		const query = sanitizeQuery(this.input.value);
		const allAssets = AssetRepository.getAssetsArray();
		const queryMatched = assetMatchesSearchQuery(query);
		const filteredAssets = allAssets.filter(queryMatched);
		this.searchQuery = query; 
		// update query so it can be restored if the Asset Index dialog is closed and later reopened.
		filteredAssets.sort(compareAssetsByFilename);
		this.resultsContainer.innerText = '';
		if (filteredAssets.length === 0) {
			if (allAssets.length === 0)
				this.resultsContainer.innerText = 'No assets found.  You can add one by clicking the below button.';
			else
				this.resultsContainer.innerText = 'No assets match the query';
		}
		else {
			const outer = this;
			filteredAssets.forEach(async function(asset) {
				const viewer = await GeneralAssetViewer.createAssetViewer(asset);
				const filenameSpan = document.createElement('span');
				filenameSpan.classList.add('asset-filename');
				filenameSpan.innerText = asset.filename;
				const tile = document.createElement('div');
				tile.appendChild(filenameSpan);
				tile.appendChild(viewer.getDiv());
				outer.resultsContainer.appendChild(tile);
				tile.addEventListener('click', function() {
					outer._dispatchEvent('asset-selected', {
						'filename': asset.filename
					});
				});
			});
		}
	}
};

const SearchResults = new PrivateSearchResults();
export { SearchResults };