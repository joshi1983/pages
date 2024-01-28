import { AnimationDownloadMode } from './AnimationDownloadMode.js';
import { getAnimatedGifModeElements } from './getAnimatedGifModeElements.js';
import { getFrameSequenceModeElements } from './getFrameSequenceModeElements.js';
import { getModeSelectElement } from './getModeSelectElement.js';
import { hideElements } from './hideElements.js';
import { showElements } from './showElements.js';

const options = [
	[AnimationDownloadMode.AnimatedGifMode, 'Animated GIF', getAnimatedGifModeElements],
	[AnimationDownloadMode.FrameSequenceMode, 'Frame Sequence', getFrameSequenceModeElements]
];

function addOptions(selectElement) {
	options.forEach(function(optionInfo) {
		const newOption = document.createElement('option');
		newOption.setAttribute('value', optionInfo[0]);
		newOption.innerText = optionInfo[1];
		selectElement.appendChild(newOption);
	});
}

export function manageModes(refreshPrefixTitle) {
	const selectElement = getModeSelectElement();
	function refreshMode() {
		const newMode = parseInt(selectElement.value);
		options.forEach(function(optionInfo) {
			const elements = optionInfo[2]();
			if (newMode === optionInfo[0])
				hideElements(elements);
			else
				showElements(elements);
		});
		refreshPrefixTitle();
	}
	addOptions(selectElement);
	selectElement.addEventListener('change', refreshMode);
	refreshMode();
};