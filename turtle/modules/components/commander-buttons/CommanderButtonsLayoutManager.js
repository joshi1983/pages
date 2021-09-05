import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxResizer } from '../CommandBoxResizer.js';
import { Debugger } from '../../debugging/Debugger.js';
import { Status } from '../../debugging/Status.js';
const commanderButtonsContainer = document.getElementById('commander-buttons');
const commanderMessagesAndButtons = document.getElementById('command-box-and-buttons');
const firstButton = commanderButtonsContainer.querySelector(':scope > button');
const buttonCount = commanderButtonsContainer.querySelectorAll('button').length;
const styles = window.getComputedStyle(firstButton);
const singleButtonHeight = firstButton.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

function setColumnCount(c) {
	if (c < 1 || c > 4)
		throw new Error('c must not be less than 1 or greater than 4.  c = ' + c);
	commanderButtonsContainer.className = '';
	commanderButtonsContainer.classList.add('column-count-' + c);
}

function getIdealColumnCount() {
	const commanderHeight = commanderMessagesAndButtons.offsetHeight;
	if (commanderHeight > singleButtonHeight * buttonCount + 11)
		return 1;
	else if (commanderHeight > singleButtonHeight * buttonCount / 2)
		return 2;
	else
		return 4;
}

function updateColumnCount() {
	setColumnCount(getIdealColumnCount());
}

Debugger.addEventListener('layout', updateColumnCount);
Status.addEventListener('layout', updateColumnCount);
CodeEditor.addEventListener('layout', updateColumnCount);
CommandBoxResizer.addEventListener('layout', updateColumnCount);
window.addEventListener('resize', updateColumnCount);
updateColumnCount();

export class CommanderButtonsLayoutManager {
	static updateColumnCount() {
		updateColumnCount();
	}
};