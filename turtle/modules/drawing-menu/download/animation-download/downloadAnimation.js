import { downloadFrame } from './downloadFrame.js';
import { FileExtensions } from '../FileExtensions.js';
import { getRasterFrame } from './getRasterFrame.js';

export async function downloadAnimation(program, width, height, settings) {
	if (!Number.isInteger(width) || width <= 0)
		throw new Error('width must be a positive integer');
	if (!Number.isInteger(height) || height <= 0)
		throw new Error('height must be a positive integer');
	if (typeof settings !== 'object')
		throw new Error('settings must be a number');
	if (!Number.isInteger(settings.fps) || settings.fps <= 0)
		throw new Error('settings.fps must be a positive integer');
	if (typeof settings.mime !== 'string')
		throw new Error('settings.mime must be a string.  Not: ' + settings.mime);

	const duration = settings.durationSeconds;
	const timeInterval = 1/settings.fps;
	settings.fileExtension = '.' + FileExtensions.getFileExtensionFromMime(settings.mime);
	let frameIndex = 0;
	const totalFrames = Math.ceil(duration / timeInterval);
	for (let t = 0; t < duration; t+= timeInterval) {
		if (frameIndex >= settings.startFrameIndex) {
			settings.notifyProcessingFrame(frameIndex, totalFrames);
			if (settings.isCancelled())
				break;
			const canvas = await getRasterFrame(program, width, height, t, duration, settings);
			settings.notifyFrameCanvas(frameIndex, canvas);
			await downloadFrame(canvas, frameIndex, settings);
		}
		frameIndex++;
	}
};