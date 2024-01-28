import { DialogGroups } from './DialogGroups.js';
import { DialogStates } from './DialogStates.js';

// a map from name to DialogGroup
const groups = new Map();
const storageKey = 'dialogGroupStates';
if (typeof localStorage.getItem(storageKey) === 'string') {
	try {
		const data = JSON.parse(localStorage.getItem(storageKey));
		if (data instanceof Array)
			groups = data;
	}
	catch (e) {
		console.error(e);
	}
}

function saveGroups() {
	localStorage.setItem(storageKey, JSON.stringify(groups));
}

class PrivateDialogGroupRepository {
	getRestoredDimensions(groupId) {
		return DialogGroups.getInfoForGroup(groupId);
	}

	getState(groupId) {
		DialogGroups.validateId(groupId);
		if (groups[groupId] !== undefined)
			return groups[groupId];

		return DialogStates.RESTORED;
	}

	setState(groupId, newState) {
		DialogGroups.validateId(groupId);
		DialogStates.validate(newState);
		if (groups[groupId] !== undefined) {
			if (groups[groupId] !== newState) {
				groups[groupId] = newState;
				saveGroups();
			}
		}
		else if (newState !== DialogStates.RESTORED) {
			groups[groupId] = newState;
			saveGroups();
		}
	}
}

const DialogGroupRepository = new PrivateDialogGroupRepository();
export { DialogGroupRepository };