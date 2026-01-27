import { addListener, Modes, setMode } from '../Modes.js';
import { playSound, Sounds, stopSound } from '../components/Sounds.js';

let playAgainButton;

function playAgain() {
	stopSound(Sounds.GAME_OVER_WIN);
	stopSound(Sounds.GAME_OVER_LOSS);
	setMode(Modes.PLAYING);
}

addListener(function(newMode) {
	if (newMode === Modes.GAME_OVER) {
		playSound(Sounds.GAME_OVER_LOSS);
		if (playAgainButton === undefined) {
			playAgainButton = document.querySelector('.game-over-screen button');
			playAgainButton.addEventListener('click', playAgain);
		}

		playAgainButton.focus();
		// We want to immediately focus the button so it is easy to play again using the keyboard.
	}
});
