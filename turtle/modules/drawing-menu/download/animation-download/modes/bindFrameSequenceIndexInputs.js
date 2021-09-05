export function bindFrameSequenceIndexInputs(startIndexInput, endIndexInput) {
	function refreshEndFrameIndexInput() {
		const start = parseInt(startIndexInput.value);
		const endIndex = parseInt(endIndexInput.value);
		if (!isNaN(start)) {
			if (isNaN(endIndex))
				endIndexInput.value = -1;
			else if (endIndex >= 0 && endIndex < start)
				endIndexInput.value = start;
				// an end index that is less than start index
				// makes no sense unless end 
				// index = -1 which represents the last frame in the video.
		}
		if (endIndex < 0 && endIndex !== -1)
			endIndexInput.value = -1;
	}
	function refreshStartFrameIndexInput() {
		const start = parseInt(startIndexInput.value);
		if (!isNaN(start)) {
			let endIndex = parseInt(endIndexInput.value);
			if (endIndex >= 0 && start > endIndex) {
				startIndexInput.value = endIndex;
			}
		}
	}
	endIndexInput.addEventListener('input', refreshStartFrameIndexInput);
	startIndexInput.addEventListener('input', refreshEndFrameIndexInput);

};