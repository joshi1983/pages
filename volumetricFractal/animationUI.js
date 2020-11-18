class AnimationUI {
	constructor(animationUpdated, downloader) {
		if (this.shouldBeActive()) {
			this.animationUpdated = animationUpdated;
			this.downloader = downloader;
			this.addElementsToDOM();
		}
	}

	addElementsToDOM() {
		this.isPaused = true;
		this.animation = new Animation();
		var url = this.animation.getMusicURL();
		if (url !== undefined) {
			this.audio = new Audio(url);
		}
		var settings = document.getElementById('settings');
		var div = document.createElement('div');
		div.innerHTML = `<button id="playAnimation">Play</button>
			<button id="downloadAnimationHD">Download HD Frame Sequence</button>
			<button id="stopAnimation">Stop</button>
			<input id="deltaT" type="number" min="0" max="1000">
			<input id="deltaTRange" type="range" min="0" max="1000">`;
		settings.prepend(div);
		var downloadAnimationButton = document.getElementById('downloadAnimationHD');
		var outer = this;
		this.deltaTSpinner = document.getElementById('deltaT');
		var deltaTRange = document.getElementById('deltaTRange');
		var max = this.animation.getMaxTime();
		outer.deltaTSpinner.setAttribute('max', max);
		deltaTRange.setAttribute('max', max);
		downloadAnimationButton.addEventListener('click', function() {
			outer.downloadAnimation();
		});
		var play = document.getElementById('playAnimation');
		play.addEventListener('click', function() {
			outer.playAnimation();
		});
		var stop = document.getElementById('stopAnimation');
		stop.addEventListener('click', function() {
			outer.stop();
		});
		this.deltaTSpinner.addEventListener('input', function() {
			if (outer.isPaused) {
				outer.setAnimationTime(parseFloat(outer.deltaTSpinner.value));
			}
		});
		deltaTRange.addEventListener('input', function() {
			if (outer.isPaused) {
				outer.setAnimationTime(parseFloat(deltaTRange.value));
			}
		});
	}
	
	stop() {
		if (this.audio !== undefined)
			this.audio.pause();		
		this.isPaused = true;
	}
	
	shouldBeActive() {
		var currentHostname = window.location.hostname;
		return currentHostname.indexOf('sololearn') === -1 && currentHostname.indexOf('solocode') === -1;
	}
	
	downloadAnimation() {
		var fps = 60;
		var frameIndex = 0;
		var outer = this;
		  
		function isFrameToSkip() {
			return frameIndex * fps < parseFloat(outer.deltaTSpinner.value);
		}

		function processTimeChange(deltaT) {
			outer.setAnimationTime(deltaT);
		}

		function getFormattedFrameIndex() {
			var result = '' + (frameIndex + 1);
			while (result.length < 8) {
				result = '0' + result;
			}
			return result;
		}

		function downloadFrame() {
			while (isFrameToSkip() && frameIndex * 1000 / fps < outer.animation.getMaxTime()) {
				frameIndex++;
			}
			if (frameIndex * 1000 / fps > outer.animation.getMaxTime()) {
				return;
			}
		  var frameName = 'cloud_frame_' + getFormattedFrameIndex() + '.png';
			var deltaT = frameIndex * 1000 / fps;
			processTimeChange(deltaT);
		  outer.downloader.download(frameName).then(function() {
			  if (deltaT <= outer.animation.getMaxTime()) {
				  frameIndex++;
					// continue downloading frames.
					// use setTimeout to give events a chance to be processed.
				  downloadFrame();
			  }
		  });
		}

		downloadFrame();
	}
	
	setAnimationTime(deltaT) {
		var eventData = new CustomEvent('animation-update', {
			'detail': {
				'props': this.animation.getPropertiesForTime(deltaT),
				'deltaT': deltaT
			}
		});
		this.deltaTSpinner.value = deltaT;
		this.animationUpdated(eventData);
	}

	playAnimation() {
		var outer = this;
		outer.isPaused = false;
		this.startTime = new Date().getTime();
		var startDeltaT = parseFloat(this.deltaTSpinner.value);
		if (isNaN(startDeltaT))
			startDeltaT = 0;
		this.startTime -= startDeltaT;
		if (this.audio !== undefined) {
			this.audio.currentTime = startDeltaT * 0.001;
			this.audio.play();
		}
		function updateAnimation() {
			var t = new Date().getTime();
			var deltaT = (t - outer.startTime);
			if (deltaT > outer.animation.getMaxTime() || outer.isPaused) {
				outer.stop();
				document.removeEventListener('time-changed', updateAnimation);
			}
			else {
				outer.setAnimationTime(deltaT);
			}
		}
		
		document.addEventListener('time-changed', updateAnimation);
	}
}