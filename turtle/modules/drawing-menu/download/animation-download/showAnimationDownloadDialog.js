import { Code } from '../../../components/code-editor/Code.js';
import { CommandBoxParseLogger } from '../../../parsing/loggers/CommandBoxParseLogger.js';
import { Dialog } from '../../../components/Dialog.js';
import { downloadAnimation } from './downloadAnimation.js';
import { fetchText } from '../../../fetchText.js';
import { FileExtensions } from '../FileExtensions.js';
import { formatFilename } from './formatFilename.js';
import { FrameRates } from '../FrameRates.js';
import { getAnimationSetup } from '../../../drawing/vector/animation/getAnimationSetup.js';
import { getPreferredFrameSequenceFormatMime } from './getPreferredFrameSequenceFormatMime.js';
import { isSupportedAnimationFrameFormat } from './isSupportedAnimationFrameFormat.js';
import { Resolutions } from '../Resolutions.js';
import { showAnimationDownloadSuccessDialog } from './showAnimationDownloadSuccessDialog.js';
const html = await fetchText('content/drawing/download/animation-download.html');
var fileFormatDropdown;
var fileLosslessImageQuality;
var prefixInput;
var resolutionDropdown;
var frameRatesDropdown;
var motionBlurSnapshotsPerFrameDropdown;
var progressReportElement;
var progressFrameIndexElement;
var progressFrameCountElements;
var progressBarElement;
var downloadButton;
var isDownloadCancelled;
var durationSeconds = 10;
var predownloadStage;
var startFrameIndexInput;

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
}

function notifyProcessingFrame(frameIndex, totalFrames) {
	predownloadStage.style.display = 'none';
	progressReportElement.style.display = 'block';
	progressFrameIndexElement.innerText = '' + frameIndex;
	updateFrameCount(totalFrames);
	progressBarElement.value = frameIndex * 100 / totalFrames;
}

function refreshDuration() {
	if (Code.latestProgram === undefined) {
		CommandBoxParseLogger.resetErrorCounter();
		Code.refreshProgram(CommandBoxParseLogger);
	}
	return getAnimationSetup(Code.latestProgram).then(function(_durationSeconds) {
		durationSeconds = _durationSeconds;
		updateFrameCount();
	});
}

function downloadAnimationClicked() {
	downloadButton.setAttribute('disabled', '');
	const optimizedProgram = Code.latestProgram;
	isDownloadCancelled = false;
	const dimensions = Resolutions.optionValueToDimensions(resolutionDropdown.value);
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
		'startFrameIndex': parseInt(startFrameIndexInput.value),
	};
	saveToLocalStorage();
	downloadAnimation(optimizedProgram, dimensions.width, dimensions.height, settings).then(function() {
		stopProcessingAnimation();
		Dialog.hide();
		if (isDownloadCancelled === false)
			showAnimationDownloadSuccessDialog(settings);
	});
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
	const dataStr = localStorage.getItem('animation-download');
	if (typeof dataStr === 'string') {
		try {
			const data = JSON.parse(dataStr);
			fileFormatDropdown.value = data.format;
			prefixInput.value = data.prefix;
			fileLosslessImageQuality.checked = data.isImageLossless;
			resolutionDropdown.value = data.resolution;
			frameRatesDropdown.value = data.fps;
			motionBlurSnapshotsPerFrameDropdown.value = data.snapshotsPerFrame;
		}
		catch (e) {
		}
	}
}

function saveToLocalStorage() {
	const data = {
		'format': fileFormatDropdown.value,
		'prefix': prefixInput.value,
		'isImageLossless': fileLosslessImageQuality.checked,
		'resolution': resolutionDropdown.value,
		'fps': frameRatesDropdown.value,
		'snapshotsPerFrame': motionBlurSnapshotsPerFrameDropdown.value
	};
	localStorage.setItem('animation-download', JSON.stringify(data));
}

export function showAnimationDownloadDialog() {
	refreshDuration();
	Dialog.show(html, 'Animation Downloader', 400, 200, {
		'okClicked': downloadAnimationClicked,
		'cancelClicked': cancelAnimationExportClicked,
		'okCaption': 'Download',
		'isCancelingOnClickOut': false
	}).then(function() {
		
		saveToLocalStorage();
	});
	fileFormatDropdown = document.getElementById('animation-download-frame-format');
	prefixInput = document.getElementById('animation-download-frame-prefix');
	fileLosslessImageQuality = document.getElementById('animation-download-frame-lossless');
	resolutionDropdown = document.getElementById('animation-download-resolution');
	frameRatesDropdown = document.getElementById('animation-download-frame-rate');
	progressReportElement = document.getElementById('animation-download-progress-report');
	progressFrameIndexElement = document.getElementById('animation-download-frame-index');
	progressFrameCountElements = document.querySelectorAll('.animation-download-frame-count');
	progressBarElement = document.getElementById('animation-download-progress');
	downloadButton = document.getElementById('dialog-footer-ok');
	predownloadStage = document.getElementById('animation-download-predownload-stage');
	startFrameIndexInput = document.getElementById('animation-download-start-frame-index');
	motionBlurSnapshotsPerFrameDropdown = document.getElementById('animation-download-motion-blur-samples-per-frame');
	function refreshTitle() {
		const extension = FileExtensions.getFileExtensionFromMime(fileFormatDropdown.value);
		let i = parseInt(startFrameIndexInput.value);
		if (isNaN(i))
			i = 0;
		prefixInput.setAttribute('title', `Prefix for downloaded animation frame images For example, ${formatFilename(prefixInput.value, i + 1, extension)}`);
	}
	Resolutions.addOptionsToSelect(resolutionDropdown);
	FileExtensions.addOptionsToSelect(fileFormatDropdown, isSupportedAnimationFrameFormat);
	fileFormatDropdown.value = getPreferredFrameSequenceFormatMime();
	FrameRates.addOptionsToSelect(frameRatesDropdown);
	loadFromLocalStorage();
	prefixInput.addEventListener('input', refreshTitle);
	frameRatesDropdown.addEventListener('change', updateFrameCount);
	refreshTitle();
	updateFrameCount();
};