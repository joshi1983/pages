import { DialogGroupRepository } from './DialogGroupRepository.js';
import { DialogStates } from './DialogStates.js';

export function processRestoreSize(options, width, height, dialogElement, maximizeElement, restoreElement, handleResized) {
	function restoreSize() {
		dialogElement.style.marginTop = - (height / 2) + 'px';
		dialogElement.style.marginLeft = - (width / 2) + 'px';
		dialogElement.style.width = width + 'px';
		dialogElement.style.height = height + 'px';
		maximizeElement.style.display = 'inline-block';
		restoreElement.style.display = 'none';
		dialogElement.classList.remove('maximized');
		if (options.groupId !== undefined)
			DialogGroupRepository.setState(options.groupId, DialogStates.RESTORED);
		handleResized();
	}
	restoreElement.addEventListener('click', restoreSize);
	restoreSize();
};