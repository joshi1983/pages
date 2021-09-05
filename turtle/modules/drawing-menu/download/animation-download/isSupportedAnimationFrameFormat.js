export function isSupportedAnimationFrameFormat(format) {
	return format.mime.indexOf('svg') === -1 && format.mime.startsWith('image');
};