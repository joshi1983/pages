import { DataTypes } from '../parsing/data-types/DataTypes.js';
import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { helpUrlToEnglish } from './helpUrlToEnglish.js';
import { helpUrlToFormalName } from './helpUrlToFormalName.js';
import { processHelpLinks } from './processHelpLinks.js';
import { processPastableCode } from './processPastableCode.js';
import { PushStates } from '../components/PushStates.js';
import { showDedicatedColorHelp } from './showDedicatedColorHelp.js';
const content = await fetchText('content/help/logo-language-topics/help-data-types.html');

export function getHelpIndexedTypes() {
	return DataTypes.typesArray.filter(function(type) {
		return type.name === 'color' || type.constructor.helpUrl !== undefined;
	});
}

export async function showDataTypesHelp(helpUrl, autoAddPushState) {
	if (autoAddPushState !== false) {
		PushStates.add(function() {
			showDataTypesHelp(helpUrl, false);
		});
	}
	var html, title;
	if (typeof helpUrl === 'string') {
		title = helpUrlToEnglish(helpUrl);
		html = await fetchText('content/help/logo-language-topics/data-types/' + helpUrl);
		const formalName = helpUrlToFormalName(helpUrl);
		const formalNameHTML = `<h3>Formal Name: <span>${formalName}</span></h3>`;
		html = `<div class="data-type-help-topic">${formalNameHTML}${html}</div>`;
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
	processPastableCode(document.body, true);
}