import { disableAutorun } from '../components/code-editor/autoRunMenuItem.js';
import { FastSpeed } from '../parsing/execution/speedModes/FastSpeed.js';
import { MaximumSpeed } from '../parsing/execution/speedModes/MaximumSpeed.js';
import { MediumSpeed } from '../parsing/execution/speedModes/MediumSpeed.js';
import { Settings } from '../Settings.js';
import { Slow } from '../parsing/execution/speedModes/Slow.js';
import { SuperDuperSlow } from '../parsing/execution/speedModes/SuperDuperSlow.js';
import { ToastMessages } from '../components/ToastMessages.js';
import { VerySlow } from '../parsing/execution/speedModes/VerySlow.js';
const maximumSpeedMode = new MaximumSpeed();
const speeds = [maximumSpeedMode, new FastSpeed(), new MediumSpeed(), new Slow(),
	new VerySlow(), new SuperDuperSlow()];
const speedItem = document.getElementById('debugging-execution-speed');
const speedNamesMap = new Map();
let currentMode;

function clickedOption(event) {
	const msg = event.target.innerText;
	currentMode = speedNamesMap.get(msg);
	Settings.executer.setSpeedMode(currentMode);
	if (currentMode !== maximumSpeedMode)
		disableAutorun(`Autorun was disabled because running anything slower than ${maximumSpeedMode.name} is too slow to automatically rerun.`);
	ToastMessages.success('Execution speed set to ' + currentMode.name, false);
	updateSelectedUIElement();
}

speeds.forEach(function(speedInfo, index) {
	const option = document.createElement('a');
	option.innerText = speedInfo.name;
	speedNamesMap.set(speedInfo.name, speedInfo);
	if (index === 0)
		option.classList.add('selected');

	option.addEventListener('click', clickedOption);
	speedItem.appendChild(option);
});

export function isUsingMaximumSpeed() {
	return currentMode === maximumSpeedMode;
};

function updateSelectedUIElement() {
	const options = speedItem.querySelectorAll(':scope > a');
	for (let i = 0; i < options.length; i++) {
		const node = options[i];
		if (currentMode.name === node.innerText)
			node.classList.add('selected');
		else
			node.classList.remove('selected');
	}
}

export function switchToMaximumSpeed(extraMsg) {
	currentMode = maximumSpeedMode;
	Settings.executer.setSpeedMode(maximumSpeedMode);
	updateSelectedUIElement();
	ToastMessages.success('Execution speed set to ' + maximumSpeedMode.name + extraMsg, false);
};