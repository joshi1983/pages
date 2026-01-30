// Sounds will be used like an enum.
export const Sounds = {};

let i = 0;
for (const key of ['GAME_OVER_LOSS', 'GAME_OVER_WIN', 'INIT_SCREEN_MUSIC', 'SHOOT']) {
	Sounds[key] = i;
	i++;
}

const sounds = new Map([
	[Sounds.INIT_SCREEN_MUSIC, 'alchemest_opening_theme.mid'],
	[Sounds.GAME_OVER_LOSS, 'spaceship-system-break-down.mp3'],
	[Sounds.GAME_OVER_WIN, 'game-over-win.mp3'],
	[Sounds.SHOOT, 'shoot.ogg']
]);
const clonesMap = new Map();
const nameToAudioMap = new Map();
let _promise;

function isMidi(url) {
	url = url.toLowerCase();
	return url.endsWith('.mid') || url.endsWith('.midi');
}

// _asyncInit is called at most once.
async function _asyncInit() {
	for (const [name, url] of sounds) {
		const fullUrl = 'assets/audio/' + url;
		let audio, promise;
		if (isMidi(url)) {
			promise = new Promise(function(resolve) {
				audio = new MIDIPlayer();
				audio.onload = function() {
					console.log(`onload called.`);
					resolve();
				};
				console.log('about to call handleURL.');
				audio.handleURL(fullUrl);
				console.log('Called handleURL.');
			});
		}
		else {
			audio = new Audio();
			promise = new Promise(function(resolve) {
				audio.addEventListener("canplaythrough", resolve);
				audio.src = fullUrl;
			});
		}
		await promise;
		nameToAudioMap.set(name, audio);
	}
}

export function asyncInit() {
	if (_promise === undefined)
		_promise = _asyncInit();
	return _promise;
};

export function playSound(soundId) {
	if (!Number.isInteger(soundId))
		throw new Error(`soundId must be an integer but found ${soundId}`);

	let audio = nameToAudioMap.get(soundId);
	if (audio === undefined)
		throw new Error(`Unable to find sound corresponding with soundId ${soundId}`);

	if (audio instanceof HTMLAudioElement && !audio.paused) {
		audio = audio.cloneNode(true);
		let clones = clonesMap.get(audio);
		if (clones === undefined) {
			clones = [];
			clonesMap.set(audio, clones);
		}
		clones.push(audio);
		audio.addEventListener("ended", function() {
			const index = clones.indexOf(audio);
			clones.splice(index, 1); // remove.
		});
	}
	audio.play();
};

function stop(audioElement) {
	if (audioElement instanceof HTMLAudioElement) {
		audioElement.pause();
		audioElement.currentTime = 0;
	}
	else {
		audioElement.stop();
	}
}

export function stopSound(soundId) {
	if (!Number.isInteger(soundId))
		throw new Error(`soundId must be an integer but found ${soundId}`);
	
	let audio = nameToAudioMap.get(soundId);
	stop(audio);
	const clones = clonesMap.get(audio);
	if (clones !== undefined) {
		for (const audioClone of clones) {
			stop(audioClone);
		}
	}
};