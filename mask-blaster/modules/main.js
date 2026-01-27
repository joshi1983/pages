import('./bodyClassUpdater.js');
import('./controlsScreen.js');
import('./gameLoop.js');
import('./initScreen.js');
import { getLoadedPromise, isLoaded } from './components/LoadingStatus.js';
import { Modes, setMode } from './Modes.js';
import { ready } from './ready.js';

// for remembering if the user clicked 'Start Playing' before loading completed.
let playRequested = false;

function startPlaying() {
	if (isLoaded())
		setMode(Modes.PLAYING);
}

function viewControls() {
	if (isLoaded())
		setMode(Modes.CONTROLS);
	else
		playRequested = true;
}

function init() {
	startButton.addEventListener('click', viewControls);
	playAgain.addEventListener('click', startPlaying);
}

getLoadedPromise().then(function() {
	if (playRequested === true)
		startPlaying();
});

ready(init);