import { blurRatiosToSequentialAlphaRatios } from '../../../drawing/vector/animation/blurRatiosToSequentialAlphaRatios.js';
import { delay } from '../../../delay.js';
import { FileExtensions } from '../FileExtensions.js';
import { formatFilename } from './formatFilename.js';
import { getBlurRatios } from '../../../drawing/vector/animation/getBlurRatios.js';
import { getRasterFrame } from './getRasterFrame.js';
import { getRasterSnapshot } from './getRasterSnapshot.js';

async function downloadFrame(canvas, frameIndex, settings) {
	const quality = settings.losslessImageQuality ? 1 : undefined;
	const dataUrl = canvas.toDataURL(settings.mime, quality);
	const a = document.createElement('a');
	a.setAttribute('href', dataUrl);
	a.setAttribute('download', formatFilename(settings.prefix, frameIndex, settings.fileExtension));

	/*
	FIXME: find a better fix to this bug.
	Without the delay, a randomly frame gets skipped on rare occasions.
	For example, I downloaded an animation with 1000 640x480 frames 3 times and 2 of the downloads were missing at least 1 frame.

	The following delay is in an effort to minimize this random problem but it also slows the animation downloading process and isn't guaranteed to fix the problem.
	While no guarantee of always working, the same test of 3 animations with 1000 frames each did not reproduce the bug.
	*/
	await delay(100);

	a.click();
}

export async function downloadAnimation(program, width, height, settings) {
	if (typeof width !== 'number')
		throw new Error('width must be a number');
	if (width < 1)
		throw new Error('width must be positive.  Not: ' + width);
	if (typeof height !== 'number')
		throw new Error('height must be a number');
	if (height < 1)
		throw new Error('height must be positive.  Not: ' + height);
	if (typeof settings !== 'object')
		throw new Error('settings must be a number');
	if (typeof settings.fps !== 'number')
		throw new Error('settings.fps must be a number');
	if (typeof settings.mime !== 'string')
		throw new Error('settings.mime must be a string.  Not: ' + settings.mime);

	let notifyProcessingFrame;
	if (typeof settings.notifyProcessingFrame === 'function')
		notifyProcessingFrame = settings.notifyProcessingFrame;
	else
		notifyProcessingFrame = function() {};
	const duration = settings.durationSeconds;
	const timeInterval = 1/settings.fps;
	settings.fileExtension = '.' + FileExtensions.getFileExtensionFromMime(settings.mime);
	settings.alphaRatios = blurRatiosToSequentialAlphaRatios(getBlurRatios(settings.snapshotsPerFrame, 0.3));
	let frameIndex = 0;
	const totalFrames = Math.ceil(duration / timeInterval);
	for (let t = 0; t < duration; t+= timeInterval) {
		if (frameIndex >= settings.startFrameIndex) {
			notifyProcessingFrame(frameIndex, totalFrames);
			if (settings.isCancelled())
				break;
			const canvas = await getRasterFrame(program, width, height, t, duration, settings);
			await downloadFrame(canvas, frameIndex, settings);
		}
		frameIndex++;
	}
};