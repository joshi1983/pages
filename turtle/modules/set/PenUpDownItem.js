const id = 'set-pen-up-down';
const item = document.getElementById(id);
if (item === null) {
	console.error(`Unable to find element with id ${id} so PenUpDownItem will not get bound properly.`);
}
var settings;
var latestState;

function refreshItemCaption() {
	if (latestState !== settings.turtle.drawState.isPenDown) {
		latestState = settings.turtle.drawState.isPenDown;
		if (settings.turtle.drawState.isPenDown)
			item.innerText = 'Lift Pen Up';
		else
			item.innerText = 'Put Pen Down';
	}
}

function togglePenUpDown() {
	if (settings.turtle.drawState.isPenDown)
		settings.turtle.penUp();
	else
		settings.turtle.penDown();
}

export function PenUpDownItem(_settings) {
	settings = _settings;
	if (item !== null) {
		item.addEventListener('click', togglePenUpDown);
		setInterval(refreshItemCaption, 200);
		refreshItemCaption();
	}
};