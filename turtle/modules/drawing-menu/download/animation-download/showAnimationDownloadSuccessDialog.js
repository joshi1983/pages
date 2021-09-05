import { Dialog } from '../../../components/Dialog.js';
import { fetchText } from '../../../fetchText.js';
import { populateTemplateUsingObject } from '../../../populateTemplateUsingObject.js';
import { processPastableCode } from '../../../help/processPastableCode.js';
const html = await fetchText('content/drawing/download/animation-download/success.html');
const ffmpegTemplate = await fetchText('content/drawing/download/animation-download/ffmpeg_template.html');

export function showAnimationDownloadSuccessDialog(animationDownloadSettings) {
	Dialog.show(html, 'Animation Download Success!', 400, 250, {
		'showOkButton': true
	});
	const frameCountSpan = document.getElementById('animation-download-success-frame-count');
	frameCountSpan.innerText = '' + (animationDownloadSettings.fps * animationDownloadSettings.durationSeconds);
	const ffmpegElement = document.getElementById('animation-download-success-ffmpeg-command');
	const ffmpegCommandContent = populateTemplateUsingObject(ffmpegTemplate, animationDownloadSettings);
	ffmpegElement.innerHTML = ffmpegCommandContent;
	processPastableCode(document.getElementById('animation-download-success'));
};