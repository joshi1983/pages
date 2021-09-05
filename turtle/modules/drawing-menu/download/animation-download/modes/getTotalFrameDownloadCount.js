import { AnimationDownloadMode } from './AnimationDownloadMode.js';
import { isNumber } from '../../../../isNumber.js';

export function getTotalFrameDownloadCount(startIndexInput, endIndexInput,
durationSeconds, frameRatesDropdown, mode) {
	if (!isNumber(durationSeconds))
		throw new Error(`durationSeconds must be a number but found ${durationSeconds}`);
	if (!(frameRatesDropdown instanceof Element))
		throw new Error(`frameRatesDropdown must be an element but found ${frameRatesDropdown}`);
	if (!Number.isInteger(mode))
		throw new Error(`mode must be an integer but found ${mode}`);

	let frameRate = 24;
	if (frameRatesDropdown !== undefined)
		frameRate = Math.max(2, parseInt(frameRatesDropdown.value));

	let total = Math.round(frameRate * durationSeconds);
	if (mode !== AnimationDownloadMode.FrameSequenceMode)
		return total;

	const startIndex = parseInt(startIndexInput.value);
	const endIndex = parseInt(endIndexInput.value);
	let rangeTotal;
	if (endIndex >= 0) {
		if (!isNaN(startIndex))
			rangeTotal = endIndex - startIndex + 1;
		else
			rangeTotal = endIndex;
	}
	else if (!isNaN(startIndex) && startIndex > 0)
		rangeTotal = total - startIndex;
	if (Number.isInteger(rangeTotal))
		return Math.min(rangeTotal, total);
	return total;
};