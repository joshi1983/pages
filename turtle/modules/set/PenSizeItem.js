import { Dialog } from '../components/Dialog.js';
import { fetchText } from '../fetchText.js';
import { Settings } from '../Settings.js';
import { ToastMessages } from '../components/ToastMessages.js';
const penSizeHTML = await fetchText('content/set/pen-size.html');
var penSizeSample;

function refreshPenSizeSample() {
	const width = Settings.turtle.drawState.getPenWidth();
	penSizeSample.style.height = width + "px";
	penSizeSample.style.marginTop = (-width * 0.5) + "px";
	penSizeSample.style.backgroundColor = Settings.turtle.drawState.getPenColor().to6DigitHTMLCode();
	const span = penSizeSample.querySelector('span');
	const container = penSizeSample.closest('.sample-container');
	span.innerText = '' + width;
	if (!Settings.turtle.drawState.getPenColor().isDark())
		container.classList.add('dark');
	else
		container.classList.remove('dark');
}

function showPenSizeDialog() {
	let isChangedByUser = false;
	Dialog.show(penSizeHTML, 'Pen Size Selector', 200, 155, {
			'className': 'pen-size-dialog',
			'disableResize': true
	}).then(function() {
		if (isChangedByUser)
			ToastMessages.success(`The pen size is now ${Settings.turtle.drawState.getPenWidth()}`, false);
	});
	const penSizeInput = document.getElementById('pen-size-input');
	penSizeInput.value = Settings.turtle.drawState.getPenWidth();
	penSizeSample = document.getElementById('pen-size-sample');
	refreshPenSizeSample();
	penSizeInput.addEventListener('input', function() {
		const newVal = parseFloat(penSizeInput.value);
		if (!isNaN(newVal)) {
			isChangedByUser = true;
			Settings.turtle.drawState.setPenWidth(newVal);
			refreshPenSizeSample();
		}
	});
}

const penSizeItem = document.getElementById('set-pen-size');
penSizeItem.addEventListener('click', showPenSizeDialog);

export function PenSizeItem() {};