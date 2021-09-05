import { DialogGroups } from './DialogGroups.js';
var previousListener;

export function processDialogGroupIcon(groupId, showGroupIcon) {
	const iconElement = document.getElementById('dialog-group-icon');
	if (previousListener !== undefined) {
		iconElement.removeEventListener('click', previousListener);
		iconElement.removeAttribute('class');
		iconElement.removeAttribute('title');
		previousListener = undefined;
	}
	if (groupId !== undefined && showGroupIcon !== false) {
		const groupInfo = DialogGroups.getInfoForGroup(groupId);
		if (groupInfo.icon !== undefined && typeof groupInfo.click === 'function') {
			previousListener = groupInfo.click;
			iconElement.addEventListener('click', previousListener);
			iconElement.classList.add(...groupInfo.icon.split(' '));
			iconElement.setAttribute('title', groupInfo.iconTitle);
		}
	}
};