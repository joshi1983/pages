import { ExecutionSpeedMenuItemStatus } from
'../components/loading-dialog/ExecutionSpeedMenuItemStatus.js';

import { disableAutorun } from '../components/code-editor/autoRunMenuItem.js';
import { FastSpeed } from '../parsing/execution/speedModes/FastSpeed.js';
import { MaximumSpeed } from '../parsing/execution/speedModes/MaximumSpeed.js';
import { MediumSpeed } from '../parsing/execution/speedModes/MediumSpeed.js';
import { ready } from '../ready.js';
import { Settings } from '../Settings.js';
import { Slow } from '../parsing/execution/speedModes/Slow.js';
import { SuperDuperSlow } from '../parsing/execution/speedModes/SuperDuperSlow.js';
import { ToastMessages } from '../components/ToastMessages.js';
import { VerySlow } from '../parsing/execution/speedModes/VerySlow.js';
const maximumSpeedMode = new MaximumSpeed();
const speeds = [maximumSpeedMode, new FastSpeed(), new MediumSpeed(), new Slow(),
	new VerySlow(), new SuperDuperSlow()];
let speedItem;
const speedNamesMap = new Map();

function init() {
	speedItem = document.getElementById('debugging-execution-speed');

	speeds.forEach(function(speedInfo, index) {
		const option = document.createElement('option');
		option.innerText = speedInfo.name;
		speedNamesMap.set(speedInfo.name, speedInfo);
		if (index === 0)
			option.setAttribute('selected', 'selected');

		speedItem.appendChild(option);
	});

	speedItem.addEventListener('change', function() {
		const newSpeedMode = speedNamesMap.get(speedItem.value);
		Settings.executer.setSpeedMode(newSpeedMode);
		if (newSpeedMode !== maximumSpeedMode)
			disableAutorun(`Autorun was disabled because running anything slower than ${maximumSpeedMode.name} is too slow to automatically rerun.`);
		ToastMessages.success('Execution speed set to ' + newSpeedMode.name, false);
	});

	ExecutionSpeedMenuItemStatus.completed();
}

export function isUsingMaximumSpeed() {
	if (speedItem === undefined)
		return true;

	const speedMode = speedNamesMap.get(speedItem.value);
	return speedMode === maximumSpeedMode;
};

export function switchToMaximumSpeed(extraMsg) {
	if (speedItem !== undefined) {
		speedItem.value = maximumSpeedMode.name;
		Settings.executer.setSpeedMode(maximumSpeedMode);
		ToastMessages.success('Execution speed set to ' + maximumSpeedMode.name + extraMsg, false);
	}
};

ready(init);