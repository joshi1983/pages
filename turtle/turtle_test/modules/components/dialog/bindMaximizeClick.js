import { DialogGroupRepository } from './DialogGroupRepository.js';
import { DialogStates } from './DialogStates.js';

export function bindMaximizeClick(dialogElement, restoreElement, maximizeElement, groupId, disableResize, handleResized, state) {
	function maximize() {
		restoreElement.style.display = 'inline-block';
		maximizeElement.style.display = 'none';
		const keys = ['margin-top', 'margin-left', 'width', 'height'];
		keys.forEach(function(key) {
			dialogElement.style.removeProperty(key);
		});
		dialogElement.classList.add('maximized');
		if (groupId !== undefined)
			DialogGroupRepository.setState(groupId, DialogStates.MAXIMIZED);
		handleResized();
	}
	if (state === DialogStates.MAXIMIZED)
		maximize();

	maximizeElement.addEventListener('click', maximize);
	if (disableResize) {
		maximizeElement.style.display = 'none';
	}
};