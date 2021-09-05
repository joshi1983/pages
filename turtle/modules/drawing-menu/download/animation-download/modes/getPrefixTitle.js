import { AnimationDownloadMode } from './AnimationDownloadMode.js';
import { formatFilename } from '../formatFilename.js';
import { formatGifFilename } from '../formatGifFilename.js';
import { getModeSelectElement } from './getModeSelectElement.js';

export function getPrefixTitle(inputValue, startFrameIndex, extension) {
	const mode = parseInt(getModeSelectElement().value);
	if (mode === AnimationDownloadMode.FrameSequenceMode) {
		return `Prefix for downloaded animation frame images For example, ${formatFilename(inputValue, startFrameIndex, extension)}`;
	}
	else {
		return `Downloaded GIF file name before the extention.  The full name would be ${formatGifFilename(inputValue)}`;
	}
};