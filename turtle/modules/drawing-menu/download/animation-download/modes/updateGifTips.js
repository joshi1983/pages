import { getFrameRateDropdown } from '../getFrameRateDropdown.js';
import { getResolutionDropdown } from '../getResolutionDropdown.js';
import { Resolutions } from '../../Resolutions.js';

function shouldShowSomething(pixelCount, totalFrameCount) {
	if (pixelCount > 4000000)
		return true;
	if (pixelCount * totalFrameCount > 200000000)
		return true;
	return false;
}

export function updateGifTips(durationSeconds) {
	if (typeof durationSeconds !== 'number')
		throw new Error(`durationSeconds must be a number.  Not: ${durationSeconds}`);
	const resolutionDropdown = getResolutionDropdown();
	const dimensions = Resolutions.optionValueToDimensions(resolutionDropdown.value);
	const settings = {
		'durationSeconds': durationSeconds,
		'fps': parseInt(getFrameRateDropdown().value)
	};
	const totalFrameCount = settings.fps * settings.durationSeconds;
	const pixelCount = dimensions.width * dimensions.height;
	const totalPixels = pixelCount * totalFrameCount;
	const tipsDiv = document.getElementById('animation-download-gif-tips');
	if (shouldShowSomething(pixelCount, totalFrameCount)) {
		const tips = ['An unusually large GIF file will be created.  Consider the following.'];
		if (settings.fps > 12)
			tips.push(`Consider reducing your frame rate from ${settings.fps} frames / second to 12.`);
		if (pixelCount > 1000000)
			tips.push(`Consider reducing your width and height of ${dimensions.width}x${dimensions.height} to 640x480 or less.`);
		if (tips.length === 1 || settings.durationSeconds > 5) {
			let msg = `Consider a shorter animation duration than ${settings.durationSeconds} seconds.`;
			if (settings.durationSeconds === 10)
				msg += ` You can change this by updating your animation.setup procedure.  ` +
				`If you do not have animation.setup defined, click <strong>Edit</strong> -&gt; <strong>Set up Animation</strong>.`;
			else
				msg += ` You can change this by updating your animation.setup procedure.`;
			tips.push(msg);
		}
		tipsDiv.innerHTML = `<ul><li>${tips.join('</li><li>')}</li></ul>`;
	}
	else
		tipsDiv.innerHTML = '';
};