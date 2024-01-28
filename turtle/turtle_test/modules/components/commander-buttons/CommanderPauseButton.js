import { Settings } from '../../Settings.js';
const pauseButton = document.getElementById('commander-pause');

function pauseContinuousExecution() {
	if (pauseButton.innerText.toLowerCase() === 'pause') {
		Settings.executer.pauseContinuousExecution(true);
		pauseButton.innerText = 'Unpause';
	}
	else {
		Settings.executer.startContinuousExecution();
		pauseButton.innerText = 'Pause';
	}
}

function refreshDisabled() {
	let title = pauseButton.innerText + ' Logo program execution';
	if (Settings.executer.isHalted) {
		pauseButton.setAttribute('disabled', '');
		title += ' (Program halted so nothing to pause/unpause)';
	}
	else {
		pauseButton.removeAttribute('disabled');
	}
	pauseButton.setAttribute('title', title);
}

pauseButton.addEventListener('click', pauseContinuousExecution);
Settings.executer.addEventListener('execution-started', function() {
	pauseButton.innerText = 'Pause';
});
Settings.executer.addEventListener('execution-stopped', function() {
	pauseButton.innerText = 'Unpause';
});

setInterval(refreshDisabled, 500);
refreshDisabled();