export function getFrameSequenceModeElements() {
	return document.
		querySelectorAll(['#animation-download-start-frame-index-li',
			'#animation-download-frame-format-li',
			'#animation-download-predownload-stage-for-frame-sequence-mode',
			'#animation-download-frame-lossless-li'
		].join(','));
};