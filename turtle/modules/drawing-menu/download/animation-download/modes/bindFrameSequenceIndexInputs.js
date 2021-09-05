export function bindFrameSequenceIndexInputs(startIndexInput, endIndexInput) {
	function validate() {
		const start = parseInt(startIndexInput.value);
		const endIndex = parseInt(endIndexInput.value);
		let hasWarning = false;
		if (!isNaN(start)) {
			if (isNaN(endIndex))
				endIndexInput.value = -1;
			else if (endIndex >= 0 && endIndex < start) {
				hasWarning = true;
				// an end index that is less than start index
				// makes no sense unless end 
				// index = -1 which represents the last frame in the video.
			}
		}
		if (endIndex < 0 && endIndex !== -1)
			endIndexInput.value = -1;

		endIndexInput.classList.toggle('warning', hasWarning);
	}
	endIndexInput.addEventListener('input', validate);
	startIndexInput.addEventListener('input', validate);

};