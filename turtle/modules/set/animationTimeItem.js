import { Dialog } from '../components/Dialog.js';
import { fetchText } from '../fetchText.js';
import { GraphicsScreen } from '../components/GraphicsScreen.js';
import { LiveRedrawer } from './animation-time/LiveRedrawer.js';
import { TimeLocalStorage } from './animation-time/TimeLocalStorage.js';
import { RateLimiter } from '../RateLimiter.js';
import { resetAndTest } from '../components/code-editor/resetAndTest.js';
import { Settings } from '../Settings.js';

const graphicsScreenElement = GraphicsScreen.container;
const item = document.getElementById('set-animation-time');
const html = await fetchText('content/set/animation-time.html');

async function itemClicked() {
	let input;
	const originalAnimationTime = Settings.animationTime;
	let okClicked = false;
	Dialog.show(html, 'Animation Time Selector', 350, 180, {
		'disableResize': true,
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
	input = document.getElementById('set-animation-time-seconds-input');
	input.setAttribute('max', Settings.animationDurationSeconds);
	input.value = Settings.animationTime;
	await LiveRedrawer.refreshProgram();
	const isUsingAnimationTime = LiveRedrawer.isProgramUsingAnimationTime();
	const liveRedrawCheckbox = document.getElementById('set-animation-time-live-redraw');
	const minutes = document.getElementById('set-animation-time-minutes');
	const seconds = document.getElementById('set-animation-time-seconds');
	const numberSecondsInput = document.getElementById('set-animation-time-seconds-number-input');
	function getTotalTime() {
		return parseFloat(input.value);
	}
	async function refreshCalculatedValues() {
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
			await LiveRedrawer.redrawNeeded(inputtedSeconds);
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
	liveRedrawCheckbox.checked = isUsingAnimationTime === true;
	input.addEventListener('input', refreshCalculatedValues);
	liveRedrawCheckbox.addEventListener('click', function() {
		if (!liveRedrawCheckbox.checked)
			LiveRedrawer.stop();
	});
	refreshCalculatedValues().then(function() {
		TimeLocalStorage.saveUsed();
	});
}

item.addEventListener('click', itemClicked);