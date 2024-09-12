import { disableAutorun } from '../components/code-editor/autoRunMenuItem.js';
import { FastSpeed } from '../parsing/execution/speedModes/FastSpeed.js';
import { MaximumSpeed } from '../parsing/execution/speedModes/MaximumSpeed.js';
import { MediumSpeed } from '../parsing/execution/speedModes/MediumSpeed.js';
import { OptionList } from '../components/OptionList.js';
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
let options;

function clickedOption(event) {
	const msg = event.details.element.innerText;
	const newMode = speedNamesMap.get(msg);
	if (newMode !== undefined) {
		currentMode = newMode;
		Settings.executer.setSpeedMode(currentMode);
		if (currentMode !== maximumSpeedMode)
			disableAutorun(`Autorun was disabled because running anything slower than ${maximumSpeedMode.name} is too slow to automatically rerun.`);
		ToastMessages.success('Execution speed set to ' + currentMode.name, false);
	}
	else
		console.log(`Unable to find a mode with name ${msg}`);
}

function init() {
	const optionsInfo = speeds.map(function(speed, index) {
		speedNamesMap.set(speed.name, speed);
		return {
			'text': speed.name,
			'selected': index === 0
		};
	});
	options = new OptionList('debugging-execution-speed', optionsInfo);
	options.addEventListener('selection-changed', clickedOption);
}
init();

export function isUsingMaximumSpeed() {
	return currentMode === maximumSpeedMode;
};

export function switchToMaximumSpeed(extraMsg) {
	options.setSelectedInnerText(maximumSpeedMode.name);
};