import { Code } from '../components/code-editor/Code.js';
import { ElementUtils } from '../components/ElementUtils.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { fetchText } from '../fetchText.js';
import { formatNumber } from './formatNumber.js';
import { mightAnimationTimeAffectDrawing } from '../parsing/parse-tree-analysis/mightAnimationTimeAffectDrawing.js';
import { processHelpIds } from '../help/processHelpIds.js';
import { Settings } from '../Settings.js';
import { showGeneralHelpContent } from '../help/showGeneralHelpContent.js';
import { updateHexColourDisplay } from '../components/updateHexColourDisplay.js';
const statusHTML = await fetchText('content/debugging/status.html');

let statusElement = document.createElement('div');
statusElement.innerHTML = statusHTML;
statusElement = statusElement.querySelector(':scope > div');
processHelpIds(statusElement);
const status = document.getElementById('debugging-show-status');
const animationDurationElement = statusElement.querySelector('#status-animation-duration');
const animationTimeElement = statusElement.querySelector('#status-animation-time');
const fillColorElement = statusElement.querySelector('#status-shape-fill-color');
const headingElement = statusElement.querySelector('#status-heading');
const penColorElement = statusElement.querySelector('#status-pen-color');
const penContactElement = statusElement.querySelector('#status-pen-contact');
const penSizeElement = statusElement.querySelector('#status-pen-width');
const lineCapElement = statusElement.querySelector('#status-line-cap');
const lineJoinStyleElement = statusElement.querySelector('#status-line-join-style');
const miterLimitElement = statusElement.querySelector('#status-miter-limit');
const positionXElement = statusElement.querySelector('#status-turtle-position-x');
const positionYElement = statusElement.querySelector('#status-turtle-position-y');
const positionZElement = statusElement.querySelector('#status-turtle-position-z');
const screenColorElement = statusElement.querySelector('#status-screen-color');
const statusButton = document.getElementById('commander-status');
const statusCloseButton = statusElement.querySelector('#status-close');
const statusHelpButton = statusElement.querySelector('#status-help');
const turtleVisibility = statusElement.querySelector('#status-turtle-visibility');

function updateStatusReport() {
	animationDurationElement.innerText = '' + Settings.animationDurationSeconds;
	animationTimeElement.innerText = '' + Settings.animationTime;
	if (Settings.turtle.drawState.getFillGradient() === undefined)
		fillColorElement.innerText = Settings.turtle.drawState.getFillColor();
	else
		fillColorElement.innerText = 'Gradient';
	headingElement.innerText = formatNumber(Settings.turtle.heading());
	penColorElement.innerText = Settings.turtle.drawState.getPenColor();
	penContactElement.innerText = Settings.turtle.drawState.isPenDown ? 'Down' : 'Up';
	penSizeElement.innerText = formatNumber(Settings.turtle.drawState.getPenWidth());
	lineCapElement.innerText = Settings.turtle.lineCap();
	lineJoinStyleElement.innerText = Settings.turtle.lineJoinStyle();
	miterLimitElement.innerText = formatNumber(Settings.turtle.miterLimit());
	positionXElement.innerText = formatNumber(Settings.turtle.drawState.getPosition().getX());
	positionYElement.innerText = formatNumber(Settings.turtle.drawState.getPosition().getY());
	positionZElement.innerText = formatNumber(Settings.turtle.drawState.getPosition().getZ());
	screenColorElement.innerText = '' + Settings.turtle.drawing.getScreenColor();
	turtleVisibility.innerText = Settings.turtle.drawState.isTurtleVisible;
	updateHexColourDisplay(fillColorElement);
	updateHexColourDisplay(penColorElement);
	updateHexColourDisplay(screenColorElement);
}

function showStatusHelp() {
	showGeneralHelpContent('status');
}

function showStatus() {
	status.checked = true;
	statusButton.setAttribute('disabled', '');
	statusButton.setAttribute('title', 'Status already showing');
	document.body.appendChild(statusElement);
	updateStatusReport();
	Status._dispatchEvent('layout', {});
	refreshAnimationVisibility();
	addListeners();
}

function hideStatus() {
	statusButton.removeAttribute('disabled');
	statusButton.setAttribute('title', 'Show status window');
	statusElement.remove();
	status.checked = false;
	Status._dispatchEvent('layout', {});
	refreshAnimationVisibility();
	removeListeners();
}

function isUsingAnimation() {
	if (Code.tree === undefined)
		return true;

	return mightAnimationTimeAffectDrawing(Code.tree);
}

function refreshAnimationVisibility() {
	const animationStatusElement = document.getElementById('status-animation');
	if (animationStatusElement !== null) {
		if (isUsingAnimation())
			animationStatusElement.style.removeProperty('display');
		else
			animationStatusElement.style.display = 'none';
	}
}

status.addEventListener('change', function() {
	if (status.checked)
		showStatus();
	else
		hideStatus();
});
statusButton.addEventListener('click', showStatus);
statusCloseButton.addEventListener('click', hideStatus);
statusHelpButton.addEventListener('click', showStatusHelp);
Settings.executer.addEventListener('program-changed', refreshAnimationVisibility);

/*
The timer is used to minimize the times the document gets manipulated.
Document manipulation makes updateStatusReport() very slow.
*/
let timer = undefined;
let refreshNeeded = false;
function resetUpdateReportTimer() {
	refreshNeeded = true;
	if (timer !== undefined)
		clearTimeout(timer);
	timer = setTimeout(function() {
		timer = undefined;
		updateStatusReport();
	}, 10);
}

function reportStateChanged() {
	if (status.checked) {
		resetUpdateReportTimer();
	}
}

/* The addListeners and removeListeners are called when showing or hiding the status feature.
We do this because listening for changes is important to show them in the status feature.
We don't want these listeners bound when the status feature is hidden because 
it noticably slows long Logo programs at the Maximum Speed setting.
*/
function addListeners() {
	Settings.turtle.drawState.addEventListener('change', reportStateChanged);
	Settings.turtle.addEventListener('change', reportStateChanged);	
}

function removeListeners() {
	Settings.turtle.drawState.removeEventListener('change', reportStateChanged);
	Settings.turtle.removeEventListener('change', reportStateChanged);	
}

class PrivateStatus extends EventDispatcher {
	constructor() {
		super(['layout']);
	}

	getIdealHeight() {
		return 370;
	}

	getWidth() {
		return statusElement.offsetWidth;
	}

	isVisible() {
		return status.checked;
	}

	setHeight(newHeight) {
		if (typeof newHeight !== 'number')
			throw new Error('newHeight must be a number');
		statusElement.style.height = (newHeight - ElementUtils.getVerticalPadding(statusElement)) + 'px';
	}

	setTop(newTop) {
		if (typeof newTop === 'number')
			newTop = newTop + 'px';
		if (typeof newTop !== 'string')
			throw new Error('newTop must be a string.  newTop = ' + newTop);
		statusElement.style.top = newTop;
	}
}

const Status = new PrivateStatus();
hideStatus();
export { Status };