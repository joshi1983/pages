import { Dialog } from '../components/Dialog.js';
import { fetchText } from '../fetchText.js';
import { GraphicsScreen } from '../components/GraphicsScreen.js';
import { LiveRedrawer } from './animation-time/LiveRedrawer.js';
import { TimeLocalStorage } from './animation-time/TimeLocalStorage.js';
import { RateLimiter } from '../RateLimiter.js';
import { resetAndTest } from '../components/code-editor/resetAndTest.js';
import { Settings } from '../Settings.js';
import { ToastMessages } from '../components/ToastMessages.js';

const graphicsScreenElement = GraphicsScreen.container;
const item = document.getElementById('set-animation-time');
const html = await fetchText('content/set/animation-time.html');

function itemClicked() {
	let input;
	const originalAnimationTime = Settings.animationTime;
	let okClicked = false;
	Dialog.show(html, 'Animation Time Selector', 350, 180, {
		'disableResize': true,
		'helpID': 'set-animation-time',
		'okClicked': function() {
			Settings.animationTime = parseFloat(input.value);
			okClicked = true;
		}
	}).then(function() {
		if (okClicked === false)
			Settings.animationTime = originalAnimationTime;
		LiveRedrawer.stop();
		resetAndTest();
	});
	const loadingElement = document.getElementById('set-animation-time-loading');
	const timeInputsContainer = document.getElementById('set-animation-time-time-inputs');
	input = document.getElementById('set-animation-time-seconds-input');
	input.setAttribute('max', Settings.animationDurationSeconds);
	input.value = Settings.animationTime;
	LiveRedrawer.setAnimationTimeWithoutRedraw(Settings.animationTime);
	LiveRedrawer.refreshProgram().then(function() {
		const isUsingAnimationTime = LiveRedrawer.isUsingAnimationTime();
		const liveRedrawCheckbox = document.getElementById('set-animation-time-live-redraw');
		const minutes = document.getElementById('set-animation-time-minutes');
		const seconds = document.getElementById('set-animation-time-seconds');
		const numberSecondsInput = document.getElementById('set-animation-time-seconds-number-input');
		if (numberSecondsInput === null) {
			/*
			Since refreshProgram() is asyncronous, the dialog could be closed before the refresh completes.
			This check prevents JavaScript errors in the rare case that refreshProgram()
			resolves only after the dialog closes.
			*/
			return;
		}
		function getTotalTime() {
			return parseFloat(input.value);
		}
		function refreshCalculatedValues() {
			const inputtedSeconds = getTotalTime();
			const mins = Math.floor(inputtedSeconds / 60);
			const numSecs = inputtedSeconds - mins * 60;
			let secs = numSecs.toFixed(3);
			minutes.innerText = mins;

			// keep the seconds at a consistent 2 integer digits like shown in a digital clock.
			if (numSecs < 10)
				secs = '0' + secs;

			seconds.innerText = secs;
			if (liveRedrawCheckbox.checked) {
				LiveRedrawer.redrawNeeded(inputtedSeconds);
			}
			graphicsScreenElement.classList.add('animation-time-changing');
			RateLimiter.run('animationTimeChanged', removeAnimationTimeChangeClass, 1000);
		}
		function showNumberInput() {
			seconds.style.display = 'none';
			numberSecondsInput.style.display = 'inline';
			numberSecondsInput.value = getTotalTime();
		}
		function hideNumberInput() {
			seconds.style.removeProperty('display');
			numberSecondsInput.style.removeProperty('display');
		}
		function removeAnimationTimeChangeClass() {
			graphicsScreenElement.classList.remove('animation-time-changing');
		}
		function numberSecondsInputChanged() {
			const val = parseFloat(numberSecondsInput.value.trim());
			if (!isNaN(val)) {
				input.value = val;
				refreshCalculatedValues();
			}
		}
		numberSecondsInput.addEventListener('input', numberSecondsInputChanged)
		numberSecondsInput.addEventListener('blur', hideNumberInput);
		seconds.addEventListener('click', showNumberInput);
		liveRedrawCheckbox.checked = isUsingAnimationTime === true && !GraphicsScreen.drawing.hasTaintedShapes();
		input.addEventListener('input', refreshCalculatedValues);
		liveRedrawCheckbox.addEventListener('click', function() {
			if (!liveRedrawCheckbox.checked) {
				LiveRedrawer.stop();
			}
			else if (GraphicsScreen.drawing.hasTaintedShapes()) {
				ToastMessages.error('Live redraw is not supported because the drawing contains tainted shapes.  See <span data-helpid=\"tainted-images\">tainted images</span> to learn more.', true);
				liveRedrawCheckbox.checked = false;
			}
		});
		refreshCalculatedValues();
		TimeLocalStorage.saveUsed();
		loadingElement.remove();
		timeInputsContainer.classList.remove('hidden');
	});
}

item.addEventListener('click', itemClicked);