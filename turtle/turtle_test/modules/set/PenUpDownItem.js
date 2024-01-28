const item = document.getElementById('set-pen-up-down');
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
	item.addEventListener('click', togglePenUpDown);
	setInterval(refreshItemCaption, 200);
	refreshItemCaption();
};