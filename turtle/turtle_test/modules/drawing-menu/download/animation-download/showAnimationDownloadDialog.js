import { AnimationDownloadMode } from './modes/AnimationDownloadMode.js';
import { blurRatiosToSequentialAlphaRatios } from '../../../drawing/vector/animation/blurRatiosToSequentialAlphaRatios.js';
import { Code } from '../../../components/code-editor/Code.js';
import { CommandBoxParseLogger } from '../../../parsing/loggers/CommandBoxParseLogger.js';
import { Dialog } from '../../../components/Dialog.js';
import { downloadAnimation } from './downloadAnimation.js';
import { downloadGifAnimation } from './downloadGifAnimation.js';
import { fetchText } from '../../../fetchText.js';
import { FileExtensions } from '../FileExtensions.js';
import { formatFilename } from './formatFilename.js';
import { formatGifFilename } from './formatGifFilename.js';
import { FrameRates } from '../FrameRates.js';
import { getAnimationSettingsFromLocalStorage } from './getAnimationSettingsFromLocalStorage.js';
import { getAnimationSetup } from '../../../drawing/vector/animation/getAnimationSetup.js';
import { getBlurRatios } from '../../../drawing/vector/animation/getBlurRatios.js';
import { getFrameRateDropdown } from './getFrameRateDropdown.js';
import { getModeSelectElement } from './modes/getModeSelectElement.js';
import { getPreferredFrameSequenceFormatMime } from './getPreferredFrameSequenceFormatMime.js';
import { getPrefixTitle } from './modes/getPrefixTitle.js';
import { getProgramCompiledForAnimation } from './getProgramCompiledForAnimation.js';
import { getResolutionDropdown } from './getResolutionDropdown.js';
import { isSupportedAnimationFrameFormat } from './isSupportedAnimationFrameFormat.js';
import { manageModes } from './modes/manageModes.js';
import { Resolutions } from '../Resolutions.js';
import { showAnimationDownloadSuccessDialog } from './showAnimationDownloadSuccessDialog.js';
import { SnapshotProgress } from './SnapshotProgress.js';
import { ToastMessages } from '../../../components/ToastMessages.js';
import { updateGifTips } from './modes/updateGifTips.js';
const html = await fetchText('content/drawing/download/animation-download.html');
var fileFormatDropdown;
var fileLosslessImageQuality;
var prefixInput;
var resolutionDropdown;
var frameRatesDropdown;
var modeSelect;
var motionBlurSnapshotsPerFrameDropdown;
var progressMessageElement;
var progressReportElement;
var progressFrameIndexElement;
var progressFrameCountElements;
var progressBarElement;
var repeatCountElement; // for GIF animations
var downloadButton;
var isDownloadCancelled;
var durationSeconds = 10;
var predownloadStage;
var startFrameIndexInput;

function refreshGifFilename() {
	const elements = document.querySelectorAll('.animation-download-gif-filename');
	const gifFilename = formatGifFilename(prefixInput.value);
	elements.forEach((element) => element.innerText = gifFilename);
}

function updateFrameCount(totalFrames) {
	if (typeof totalFrames !== 'number') {
		if (frameRatesDropdown !== undefined)
			totalFrames = parseInt(frameRatesDropdown.value) * durationSeconds;
		else
			totalFrames = 24 * durationSeconds;
		totalFrames = Math.floor(totalFrames);
	}
	if (progressFrameCountElements !== undefined)
		progressFrameCountElements.forEach(e => e.innerText = '' + totalFrames);
	updateGifTips(durationSeconds);
}

function notifyProcessingSnapshot(snapshotIndex, snapshotsPerFrame) {
	SnapshotProgress.update(snapshotIndex, snapshotsPerFrame);
}

function notifyProcessingFrame(frameIndex, totalFrames) {
	SnapshotProgress.frameChanged();
	predownloadStage.style.display = 'none';
	progressMessageElement.style.display = 'none';
	progressReportElement.style.display = 'block';
	progressFrameIndexElement.innerText = '' + frameIndex;
	updateFrameCount(totalFrames);
	progressBarElement.value = frameIndex * 100 / totalFrames;
}

function notifyMessage(msg) {
	if (typeof msg !== 'string')
		throw new Error(`msg must be a string but got ${msg}`);

	predownloadStage.style.display = 'none';
	progressReportElement.style.display = 'none';
	progressMessageElement.style.display = 'block';
	progressMessageElement.innerText = msg;
}

function refreshDuration() {
	if (Code.latestProgram === undefined) {
		CommandBoxParseLogger.resetErrorCounter();
		Code.refreshProgram(CommandBoxParseLogger);
	}
	return getAnimationSetup(Code.latestProgram).then(function(setupResult) {
		durationSeconds = setupResult.get('duration');
		updateFrameCount();
	});
}

function getSettings() {
	const mode = parseInt(modeSelect.value);
	const fps = parseInt(frameRatesDropdown.value);
	const mime = fileFormatDropdown.value;
	const prefix = prefixInput.value;
	const settings = {
		'snapshotsPerFrame': parseInt(motionBlurSnapshotsPerFrameDropdown.value),
		'durationSeconds': durationSeconds,
		'fps': fps,
		'isCancelled': function() {
			return isDownloadCancelled;
		},
		'losslessImageQuality': fileLosslessImageQuality.checked,
		'mime': mime,
		'prefix': prefix,
		'notifyProcessingFrame': notifyProcessingFrame,
		'notifyProcessingSnapshot': notifyProcessingSnapshot,
		'notifyMessage': notifyMessage,
		'startFrameIndex': parseInt(startFrameIndexInput.value),
	};
	settings.alphaRatios = blurRatiosToSequentialAlphaRatios(getBlurRatios(settings.snapshotsPerFrame, 0.3));
	if (mode === AnimationDownloadMode.AnimatedGifMode) {
		settings.mime = 'image/gif';
		settings.repeatCount = parseInt(repeatCountElement.value);
		settings.filename = formatGifFilename(prefix);
	}
	return settings;
}

async function downloadAnimationClicked() {
	const mode = parseInt(getModeSelectElement().value);
	downloadButton.setAttribute('disabled', '');
	const optimizedProgram = await getProgramCompiledForAnimation();
	if (optimizedProgram === undefined) {
		ToastMessages.error('Failed to download animation because of an error found while trying to compile the program.  ' +
		'Fix any known code errors before trying to download an animation.', false);
		Dialog.hide();
		return;
	}
	isDownloadCancelled = false;
	const dimensions = Resolutions.optionValueToDimensions(resolutionDropdown.value);
	const settings = getSettings();
	saveToLocalStorage();
	function finishedDownload() {
		stopProcessingAnimation();
		Dialog.hide();
		if (isDownloadCancelled === false)
			showAnimationDownloadSuccessDialog(settings);
	}
	let download = downloadAnimation;
	if (mode === AnimationDownloadMode.AnimatedGifMode)
		download = downloadGifAnimation;

	SnapshotProgress.downloadStarted(settings.snapshotsPerFrame);
	download(optimizedProgram, dimensions.width, dimensions.height, settings).then(finishedDownload);
	return false; // don't hide the dialog immediately.
}

function stopProcessingAnimation() {
	progressReportElement.style.removeProperty('display');
	predownloadStage.style.removeProperty('display');
}

function cancelAnimationExportClicked() {
	isDownloadCancelled = true;
	if (progressReportElement.style.display === 'block') {
		stopProcessingAnimation();
		return false; // don't hide the dialog.
	}
}

function loadFromLocalStorage() {
	const mergedData = getAnimationSettingsFromLocalStorage();
	fileFormatDropdown.value = mergedData.format;
	fileLosslessImageQuality.checked = mergedData.isImageLossless;
	frameRatesDropdown.value = '' + mergedData.fps;
	modeSelect.value = '' + mergedData.mode;
	prefixInput.value = mergedData.prefix;
	repeatCountElement.value = '' + mergedData.repeatCount;
	resolutionDropdown.value = '' + mergedData.resolution;
	motionBlurSnapshotsPerFrameDropdown.value = mergedData.snapshotsPerFrame;
	modeSelect.dispatchEvent(new Event('change'));
}

function saveToLocalStorage() {
	const data = {
		'format': fileFormatDropdown.value,
		'fps': parseInt(frameRatesDropdown.value),
		'isImageLossless': fileLosslessImageQuality.checked,
		'mode': parseInt(modeSelect.value),
		'prefix': prefixInput.value,
		'repeatCount': parseInt(repeatCountElement.value),
		'resolution': parseInt(resolutionDropdown.value),
		'snapshotsPerFrame': parseInt(motionBlurSnapshotsPerFrameDropdown.value)
	};
	localStorage.setItem('animation-download', JSON.stringify(data));
}

export function showAnimationDownloadDialog() {
	refreshDuration();
	Dialog.show(html, 'Animation Downloader', 400, 250, {
		'okClicked': downloadAnimationClicked,
		'cancelClicked': cancelAnimationExportClicked,
		'okCaption': 'Download',
		'isCancelingOnClickOut': false
	}).then(function() {
		isDownloadCancelled = true;
		saveToLocalStorage();
	});
	function refreshTitle() {
		if (startFrameIndexInput === undefined)
			return;
		const extension = FileExtensions.getFileExtensionFromMime(fileFormatDropdown.value);
		let i = parseInt(startFrameIndexInput.value);
		if (isNaN(i))
			i = 0;
		prefixInput.setAttribute('title', getPrefixTitle(prefixInput.value, i + 1, extension));
	}
	SnapshotProgress.findElements();
	manageModes(refreshTitle);
	fileFormatDropdown = document.getElementById('animation-download-frame-format');
	prefixInput = document.getElementById('animation-download-frame-prefix');
	fileLosslessImageQuality = document.getElementById('animation-download-frame-lossless');
	resolutionDropdown = getResolutionDropdown();
	frameRatesDropdown = getFrameRateDropdown();
	modeSelect = getModeSelectElement();
	progressMessageElement = document.getElementById('animation-download-progress-message');
	progressReportElement = document.getElementById('animation-download-progress-report');
	progressFrameIndexElement = document.getElementById('animation-download-frame-index');
	progressFrameCountElements = document.querySelectorAll('.animation-download-frame-count');
	progressBarElement = document.getElementById('animation-download-progress');
	repeatCountElement = document.getElementById('animation-download-repeat-count');
	downloadButton = document.getElementById('dialog-footer-ok');
	predownloadStage = document.getElementById('animation-download-predownload-stage');
	startFrameIndexInput = document.getElementById('animation-download-start-frame-index');
	motionBlurSnapshotsPerFrameDropdown = document.getElementById('animation-download-motion-blur-samples-per-frame');
	Resolutions.addOptionsToSelect(resolutionDropdown);
	FileExtensions.addOptionsToSelect(fileFormatDropdown, isSupportedAnimationFrameFormat);
	fileFormatDropdown.value = getPreferredFrameSequenceFormatMime();
	FrameRates.addOptionsToSelect(frameRatesDropdown);
	loadFromLocalStorage();
	prefixInput.addEventListener('input', function() {
		refreshTitle();
		refreshGifFilename();
	});
	frameRatesDropdown.addEventListener('change', updateFrameCount);
	fileFormatDropdown.addEventListener('change', refreshTitle);
	resolutionDropdown.addEventListener('change', function() {
		updateGifTips(durationSeconds);
	});
	refreshTitle();
	updateFrameCount();
	refreshGifFilename();
};