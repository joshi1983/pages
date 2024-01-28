import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchJson } from '../fetchJson.js';
import { fetchText } from '../fetchText.js';
import { processHelpLinks } from './processHelpLinks.js';
import { PushStates } from '../components/PushStates.js';
import { showOperatorsHelp } from './showOperatorsHelp.js';
const topics = await fetchJson('json/generalHelpTopics.json');
const topicsMap = new Map();
for (let i = 0; i < topics.length; i++) {
	const topic = topics[i];
	topicsMap.set(topic.id, topic);
	topic.html = '<div>' + (await fetchText(topic.url)) + '</div>';
	topic.iconClass = 'dialog-icon ';
	if (topic.id === 'breakpoint')
		topic.iconClass += 'breakpoint-icon';
	else
		topic.iconClass += 'weblogo-icon';
}

export function isValidHelpID(id) {
	if (id === 'operators')
		return true;
	return topicsMap.has(id);
}

export function getTitleForHelpID(id) {
	if (id === 'operators')
		return 'Operators';
	return topicsMap.get(id).name;
}

export function showGeneralHelpContent(id, autoAddPushState) {
	if (autoAddPushState !== false) {
		PushStates.add(function() {
			showGeneralHelpContent(id, false);
		});
	}
	if (id === 'operators')
		showOperatorsHelp();
	else if (topicsMap.has(id)) {
		const topic = topicsMap.get(id);
		Dialog.show(topic.html, topic.name, undefined, undefined, {
			'className': 'general-help-content',
			'groupId': DialogGroups.HELP,
			'iconClass': topic.iconClass
		});
		const dialogElement = document.querySelector('.dialog .dialog-body');
		processHelpLinks(dialogElement, true);
	}
	else
		throw new Error('Unrecognized general help topic id: ' + id);
};