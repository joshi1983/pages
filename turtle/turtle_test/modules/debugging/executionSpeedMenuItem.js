import { FastSpeed } from '../parsing/execution/speedModes/FastSpeed.js';
import { MaximumSpeed } from '../parsing/execution/speedModes/MaximumSpeed.js';
import { MediumSpeed } from '../parsing/execution/speedModes/MediumSpeed.js';
import { Settings } from '../Settings.js';
import { Slow } from '../parsing/execution/speedModes/Slow.js';
import { SuperDuperSlow } from '../parsing/execution/speedModes/SuperDuperSlow.js';
import { ToastMessages } from '../components/ToastMessages.js';
import { VerySlow } from '../parsing/execution/speedModes/VerySlow.js';
const speeds = [new MaximumSpeed(), new FastSpeed(), new MediumSpeed(), new Slow(), 
	new VerySlow(), new SuperDuperSlow()]
const speedItem = document.getElementById('debugging-execution-speed');
const speedNamesMap = new Map();
speedItem.addEventListener('change', function() {
	const newSpeedMode = speedNamesMap.get(speedItem.value);
	Settings.executer.setSpeedMode(newSpeedMode);
	ToastMessages.success('Execution speed set to ' + newSpeedMode.name, false);
});

speeds.forEach(function(speedInfo, index) {
	const option = document.createElement('option');
	option.innerText = speedInfo.name;
	speedNamesMap.set(speedInfo.name, speedInfo);
	if (index === 0)
		option.setAttribute('selected', 'selected');
	speedItem.appendChild(option);
});