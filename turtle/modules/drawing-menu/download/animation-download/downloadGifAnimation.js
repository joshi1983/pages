import { getRasterFrame } from './getRasterFrame.js';

export async function downloadGifAnimation(program, width, height, settings) {
	if (!Number.isInteger(settings.repeatCount) || settings.repeatCount < 0)
		throw new Error(`settings.repeatCount must be an integer at least 0 but got ${settings.repeatCount}`);
	if (typeof settings.filename !== 'string')
		throw new Error(`settings.filename must be a string but got ${settings.filename}`);
	const duration = settings.durationSeconds;
	const timeInterval = 1 / settings.fps;
	const totalFrames = Math.ceil(duration / timeInterval);
	let frameIndex = 0;
	const encoder = new GIFEncoder();
	encoder.setSize(width, height);
	encoder.setRepeat(settings.repeatCount);
	encoder.setDelay(Math.floor(timeInterval * 1000));
	encoder.start();

	for (let t = 0; t < duration; t+= timeInterval) {
		settings.notifyProcessingFrame(frameIndex, totalFrames);
		if (settings.isCancelled())
			break;
		const canvas = await getRasterFrame(program, width, height, t, duration, settings);
		const ctx = canvas.getContext('2d');
		encoder.addFrame(ctx);
		frameIndex++;
	}
	if (!settings.isCancelled()) {
		settings.notifyMessage(`All ${totalFrames} frames collected.  Encoding GIF...`);
		encoder.finish();
		encoder.download(settings.filename);
	}
};