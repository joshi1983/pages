import { getRasterSnapshot } from './getRasterSnapshot.js';

export async function getRasterFrame(program, width, height, startAnimationTimeSeconds, animationDurationSeconds, settings) {
	const snapshotCount = settings.alphaRatios.length;
	const timePerSnapshot = 1 / settings.fps / snapshotCount / 2;
	let result;
	let ctx;
	for (let i = 0; i < snapshotCount; i++) {
		const t = startAnimationTimeSeconds + i * timePerSnapshot;
		const canvas = await getRasterSnapshot(program, width, height, t, animationDurationSeconds);
		if (result === undefined) {
			result = canvas;
			ctx = result.getContext('2d');
		}
		else {
			ctx.globalAlpha = settings.alphaRatios[i];
			ctx.drawImage(canvas, 0,0);
		}
	}
	return result;
};