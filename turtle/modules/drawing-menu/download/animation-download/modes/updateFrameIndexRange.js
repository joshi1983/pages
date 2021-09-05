import { AnimationDownloadMode } from './AnimationDownloadMode.js';

function shouldShowFromToIndexes(startIndex, endIndex, mode) {
	if (mode === AnimationDownloadMode.AnimatedGifMode)
		return false;
	if (endIndex < 0 && startIndex === 0)
		return false;
	return true;
}

/*
maxIndex is the integer frame index of the last frame in the video.
maxIndex is not the same as endIndexInput's value.  maxIndex is quite simply the full 
(video's duration in seconds) * (frame number per second).

*/
export function updateFrameIndexRange(startIndexInput, endIndexInput, maxIndex, mode) {
	if (!Number.isInteger(maxIndex))
		throw new Error(`maxIndex must be an integer but found ${maxIndex}`);
	if (!Number.isInteger(mode))
		throw new Error(`mode must be an integer but found ${mode}`);

	const simpleSpan = document.getElementById('animation-download-frame-index-simple');
	const fromToEndSpan = document.getElementById('animation-download-frame-index-from-to-range');
	const startIndex = parseInt(startIndexInput.value);
	const endIndex = parseInt(endIndexInput.value);
	if (shouldShowFromToIndexes(startIndex, endIndex, mode)) {
		let id = 'animation-download-frame-start-index';
		const fromSpan = document.getElementById(id);
		if (fromSpan === null) { // sometimes happens after downloading 100's of high resolution video frames.
			console.error(`Unable to find an element with id ${id}`);
		}
		else {
			fromSpan.innerText = startIndexInput.value;
			let endIndex = parseInt(endIndexInput.value);
			const endIndexSpan = document.getElementById('animation-download-frame-end-index');
			if (!isNaN(endIndex) && Number.isInteger(maxIndex) &&
			(endIndex < 0 || endIndex > maxIndex))
				endIndex = maxIndex;

			endIndexSpan.innerText = '' + endIndex;
			simpleSpan.classList.add('hidden');
			fromToEndSpan.classList.remove('hidden');
		}
	}
	else {
		simpleSpan.classList.remove('hidden');
		fromToEndSpan.classList.add('hidden');
	}
};