import { Settings } from '../Settings.js';
const item = document.getElementById('set-turtle-visibility');
const itemCaption = item.querySelector('#set-turtle-visibility-caption');
const turtle = Settings.turtle;

function refreshCaption() {
	const caption = turtle.drawState.isTurtleVisible ? 'Hide' : 'Show';
	itemCaption.innerText = caption + ' Turtle';
}

function toggleTurtleVisibility() {
	if (turtle.drawState.isTurtleVisible) {
		turtle.drawState.hideTurtle();
	}
	else
		turtle.drawState.showTurtle();
	refreshCaption();
}

item.addEventListener('click', toggleTurtleVisibility);
turtle.drawState.addEventListener('change', function(event) {
	if (event.details.name === 'turtle-visible' || event.details.name === 'reset')
		refreshCaption();
});