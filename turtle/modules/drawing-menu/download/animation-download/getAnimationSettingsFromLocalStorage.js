import { AnimationDownloadMode } from './modes/AnimationDownloadMode.js';
import { Resolutions } from '../Resolutions.js';

export function getAnimationSettingsFromLocalStorage() {
	const dataStr = localStorage.getItem('animation-download');
	const dataDefaults = {
		'fps': 24,
		'format': 'image/jpeg',
		'isImageLossless': true,
		'mode': AnimationDownloadMode.AnimatedGifMode,
		'prefix': 'turtle',
		'repeatCount': 0,
		'resolution': Resolutions.indexOf(640, 480),
		'snapshotsPerFrame': 1
	};// defaults to use if the values are not specified or valid in localStorage.
	const mergedData = dataDefaults;
	if (typeof dataStr === 'string') {
		try {
			const loadedData = JSON.parse(dataStr);
			if (Number.isInteger(loadedData.fps))
				mergedData.fps = loadedData.fps;
			if (typeof loadedData.format === 'string')
				mergedData.format = loadedData.format;
			if (typeof loadedData.isImageLossless === 'boolean')
				mergedData.isImageLossless = loadedData.isImageLossless;
			if (typeof loadedData.prefix === 'string')
				mergedData.prefix = loadedData.prefix;
			if (AnimationDownloadMode.isValidValue(loadedData.mode))
				mergedData.mode = loadedData.mode;
			if (Number.isInteger(loadedData.repeatCount) && loadedData.repeatCount >= 0)
				mergedData.repeatCount = loadedData.repeatCount;
			if (Number.isInteger(loadedData.resolution))
				mergedData.resolution = loadedData.resolution;
			if (Number.isInteger(loadedData.snapshotsPerFrame) && loadedData.snapshotsPerFrame > 0)
				mergedData.snapshotsPerFrame = loadedData.snapshotsPerFrame;
		}
		catch (e) {
		}
	}
	return mergedData;
};