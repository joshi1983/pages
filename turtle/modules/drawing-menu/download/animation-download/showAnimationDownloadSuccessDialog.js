import { Dialog } from '../../../components/Dialog.js';
import { fetchText } from '../../../fetchText.js';
import { populateTemplateUsingObject } from '../../../populateTemplateUsingObject.js';
import { processPastableCode } from '../../../help/processPastableCode.js';
const html = await fetchText('content/drawing/download/animation-download/success.html');
const htmlGif = await fetchText('content/drawing/download/animation-download/success-gif.html');
const ffmpegTemplate = await fetchText('content/drawing/download/animation-download/ffmpeg_template.html');

export function showAnimationDownloadSuccessDialog(animationDownloadSettings) {
	const isGif = animationDownloadSettings.mime === 'image/gif';
	let dialogHTML = html;
	let height = 250;
	if (isGif) {
		dialogHTML = htmlGif;
		height = 150;
	}
	Dialog.show(dialogHTML, 'Animation Download Success!', 400, height, {
		'showOkButton': true
	});
	if (!isGif) {
		const frameCountSpan = document.getElementById('animation-download-success-frame-count');
		frameCountSpan.innerText = '' + Math.floor(animationDownloadSettings.fps * animationDownloadSettings.durationSeconds);
		const ffmpegElement = document.getElementById('animation-download-success-ffmpeg-command');
		const ffmpegCommandContent = populateTemplateUsingObject(ffmpegTemplate, animationDownloadSettings);
		ffmpegElement.innerHTML = ffmpegCommandContent;
		processPastableCode(document.getElementById('animation-download-success'));
	}
};