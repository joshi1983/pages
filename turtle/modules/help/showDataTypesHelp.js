import { DataTypes } from '../parsing/data-types/DataTypes.js';
import { dataTypesToEnglish } from './command-details/dataTypesToEnglish.js';
import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { processHelpLinks } from './processHelpLinks.js';
import { showDedicatedColorHelp } from './showDedicatedColorHelp.js';
const content = await fetchText('content/help/logo-language-topics/help-data-types.html');

export function helpUrlToEnglish(helpUrl) {
	if (helpUrl === 'color')
		return helpUrl;
	const name = helpUrl.substring(0, helpUrl.lastIndexOf('.')).replaceAll('-', ' ');
	return dataTypesToEnglish(name);
}

export function getHelpIndexedTypes() {
	return DataTypes.typesArray.filter(function(type) {
		return type.name === 'color' || type.constructor.helpUrl !== undefined;
	});
}

export async function showDataTypesHelp(helpUrl) {
	var html, title;
	if (typeof helpUrl === 'string') {
		title = helpUrlToEnglish(helpUrl);
		html = await fetchText('content/help/logo-language-topics/data-types/' + helpUrl);
		html = `<div class="data-type-help-topic">${html}</div>`;
	}
	else {
		html = content;
		title = 'Data Types';
	}

	Dialog.show(html, title, undefined, undefined, {
		'className': 'help-datatypes',
		'groupId': DialogGroups.HELP,
		'iconClass': 'dialog-icon datatypes-icon'
	});
	const indexContainer = document.getElementById('data-type-index');
	if (indexContainer !== null) {
		const types = getHelpIndexedTypes();
		let ul = document.createElement('ul');
		let liCount = 0;
		function addUl() {
			const div = document.createElement('div');
			div.appendChild(ul);
			indexContainer.appendChild(div);
			ul = document.createElement('ul');
		}
		types.forEach(function(type, index) {
			if (liCount >= types.length / 2) {
				liCount = 0;
				addUl();
			}
			if (type.name === 'color' || type.constructor.helpUrl !== undefined) {
				let helpUrl = type.name === 'color' ? 'color' : type.constructor.helpUrl;
				const li = document.createElement('li');
				const span = document.createElement('span');
				span.classList.add('hyperlinked');
				span.innerText = helpUrlToEnglish(helpUrl);
				span.addEventListener('click', function() {
					if (type.name === 'color')
						showDedicatedColorHelp();
					else
						showDataTypesHelp(helpUrl);
				});
				li.appendChild(span);
				ul.appendChild(li);
				liCount++;
			}
		});
		addUl();
	}
	processHelpLinks();
}