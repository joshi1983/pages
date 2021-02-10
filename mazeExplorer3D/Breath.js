class Breath {
	constructor() {
		this.audio = new Audio();
		this.audio.setAttribute('loop', true);
		this.audio.setAttribute('src', 'data/breath.mp3');
		this.audio.playbackRate=5;
		var outer = this;
		function startPlaying() {
			outer.audio.play();
		}
		document.addEventListener('mousedown', startPlaying);
		document.addEventListener('touchstart', startPlaying);
	}

	setRate(newRate) {
		this.audio.playbackRate=newRate;
		var volume = Math.max(0.02, Math.min(0.7, newRate * 0.04));
		this.audio.volume = volume;
	}
}