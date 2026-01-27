import { addListener, Modes, setMode } from '../Modes.js';
import { playSound, Sounds, stopSound } from '../components/Sounds.js';
import { Score } from '../components/Score.js';

let playAgainButton, gameOverScreen;

function playAgain() {
	stopSound(Sounds.GAME_OVER_WIN);
	stopSound(Sounds.GAME_OVER_LOSS);
	setMode(Modes.PLAYING);
}

addListener(function(newMode) {
	if (newMode === Modes.GAME_OVER) {
		if (gameOverScreen === undefined)
			gameOverScreen = document.querySelector('.game-over-screen');

		const hasWon = Score.getNumber() > 0;
		if (hasWon)
			playSound(Sounds.GAME_OVER_WIN);
		else
			playSound(Sounds.GAME_OVER_LOSS);

		gameOverScreen.classList.toggle('win', hasWon);
		if (playAgainButton === undefined) {
			playAgainButton = document.querySelector('.game-over-screen button');
			playAgainButton.addEventListener('click', playAgain);
		}

		playAgainButton.focus();
		// We want to immediately focus the button so it is easy to play again using the keyboard.
	}
});
