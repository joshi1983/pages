import { delay } from '../../../delay.js';
import { formatFilename } from './formatFilename.js';

export async function downloadFrame(canvas, frameIndex, settings) {
	const quality = settings.losslessImageQuality ? 1 : undefined;
	const dataUrl = canvas.toDataURL(settings.mime, quality);
	const a = document.createElement('a');
	a.setAttribute('href', dataUrl);
	a.setAttribute('download', formatFilename(settings.prefix, frameIndex, settings.fileExtension));

	/*
	FIXME: find a better fix to this bug.
	Without the delay, a random frame gets skipped on rare occasions.
	For example, I downloaded an animation with 1000 640x480 frames 3 times and 2 of the downloads were missing at least 1 frame.

	The following delay is in an effort to minimize this random problem but it also slows the animation downloading process and isn't guaranteed to fix the problem.
	While no guarantee of always working, the same test of 3 animations with 1000 frames each did not reproduce the bug.
	*/
	await delay(100);

	a.click();
};