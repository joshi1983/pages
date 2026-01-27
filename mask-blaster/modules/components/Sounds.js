// Sounds will be used like an enum.
export const Sounds = {};

let i = 0;
for (const key of ['EXPLOSION1', 'EXPLOSION2',
'GAME_OVER_LOSS', 'GAME_OVER_WIN', 'SCREAM1', 'SCREAM2', 'SHOOT']) {
	Sounds[key] = i;
	i++;
}

const sounds = new Map([
	[Sounds.EXPLOSION1, 'explosion-1.mp3'],
	[Sounds.EXPLOSION2, 'explosion-2.mp3'],
	[Sounds.GAME_OVER_LOSS, 'spaceship-system-break-down.mp3'],
	[Sounds.GAME_OVER_WIN, 'game-over-win.mp3'],
	[Sounds.SCREAM1, 'scream1.mp3'],
	[Sounds.SCREAM2, 'scream2.mp3'],
	[Sounds.SHOOT, 'shoot.ogg']
]);
const clonesMap = new Map();
const nameToAudioMap = new Map();
let _promise;

// _asyncInit is called at most once.
async function _asyncInit() {
	for (const [name, url] of sounds) {
		const audio = new Audio();
		const promise = new Promise(function(resolve) {
			audio.addEventListener("canplaythrough", resolve);
			audio.src = 'assets/audio/' + url;
		});
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

	if (!audio.paused) {
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
	audioElement.pause();
	audioElement.currentTime = 0;
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