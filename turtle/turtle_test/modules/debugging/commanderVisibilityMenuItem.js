import { CommanderButtonsLayoutManager } from '../components/commander-buttons/CommanderButtonsLayoutManager.js';
import { GraphicsScreen } from '../components/GraphicsScreen.js';

const input = document.getElementById('debugging-commander');
const body = document.body;
const bodyClassName = 'commander-hidden';

function updateCommanderVisibility() {
	if (input.checked) {
		body.classList.remove(bodyClassName);
	}
	else {
		body.classList.add(bodyClassName);
	}
	GraphicsScreen.updateCanvasDimensions();
	CommanderButtonsLayoutManager.updateColumnCount();
}

input.addEventListener('change', updateCommanderVisibility);
