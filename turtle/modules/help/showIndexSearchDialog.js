import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { indexSearchTopics } from './index-search/indexSearchTopics.js';
import { PushStates } from '../components/PushStates.js';
import { sanitizeQuery } from '../components/sanitizeQuery.js';
const indexSearchHTML = await fetchText('content/help/index-search.html');

function getMatchesForQuery(query) {
	return indexSearchTopics.filter(function(c) {
		if (c.primaryName.toLowerCase().indexOf(query) === 0)
			return true;
		if (c.searchKeywords instanceof Array) {
			const matchedKeywords = c.searchKeywords.filter(function(keyword) {
				return keyword.toLowerCase().indexOf(query) === 0;
			});
			if (matchedKeywords.length > 0)
				return true;
		}
		return c.names.filter(function(name) {
			return name.toLowerCase().indexOf(query) === 0;
		}).length > 0;
	});
}

function updateSearchResults(input, resultsContainer) {
	const query = sanitizeQuery(input.value);
	const matches = getMatchesForQuery(query);
	resultsContainer.innerHTML = '';
	matches.forEach(function(m) {
		const r = document.createElement('div');
		r.classList.add('index-search-result');
		const iconElement = document.createElement('div');
		iconElement.classList.add('result-type-icon', 'fa');
		iconElement.classList.add(m.getIconClasses());
		iconElement.setAttribute('title', m.getTypeTitle());
		r.appendChild(iconElement);
		const primaryName = document.createElement('div');
		primaryName.classList.add('primary-name');
		primaryName.innerText = m.primaryName;
		r.appendChild(primaryName);
		if (m.names.length !== 0) {
			const abbreviations = document.createElement('div');
			abbreviations.innerText = m.names.join(", ");
			r.appendChild(abbreviations);
		}
		else {
			primaryName.classList.add('expanded');
		}
		r.addEventListener('click', m.click);
		resultsContainer.appendChild(r);
	});
}

export function showIndexSearchDialog(autoPushState) {
	if (autoPushState !== false) {
		PushStates.add(function() {
			showIndexSearchDialog(false);
		});
	}
	Dialog.show(indexSearchHTML, 'Help Index', undefined, undefined, {
		'className': 'index-search',
		'groupId': DialogGroups.HELP,
		'iconClass': 'dialog-icon help-index',
		'showGroupIcon': false
	});
	const input = document.getElementById('index-search-keywords');
	const resultsDiv = document.getElementById('index-search-results');
	updateSearchResults(input, resultsDiv);
	input.addEventListener('input', function(e) {
		updateSearchResults(input, resultsDiv);
	});
	input.focus();
};

const helpItem = document.getElementById('help-index');
helpItem.addEventListener('click', showIndexSearchDialog);