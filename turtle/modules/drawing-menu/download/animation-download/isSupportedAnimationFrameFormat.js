import { isDownloadableImageFormat } from '../drawing-download/isDownloadableImageFormat.js';

export function isSupportedAnimationFrameFormat(format) {
	return format.mime.indexOf('svg') === -1 && isDownloadableImageFormat(format);
};