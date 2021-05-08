class AnimationUI {
	constructor(renderSettings, downloader, realtimeRenderer) {
		if (this.shouldBeActive()) {
			this.renderSettings = renderSettings;
			this.downloader = downloader;
			this.realtimeRenderer = realtimeRenderer;
			this.addElementsToDOM();
		}
		else {
			// remove the animation tab.
			var animationTab = document.getElementById('animation-tab');
			animationTab.remove();
		}
	}

	addElementsToDOM() {
		this.isPaused = true;
		this.animation = new Animation();
		var url = this.animation.getMusicURL();
		if (url !== undefined) {
			this.audio = new Audio(url);
		}
		var settings = document.getElementById('animation');
		var div = document.createElement('div');
		div.innerHTML = `<button id="playAnimation">Play</button>
			<button id="downloadAnimationHD">Download HD Frame Sequence</button>
			<button id="stopAnimation">Stop</button>
			<input id="deltaT" type="number" min="0" max="1000">
			<input id="deltaTRange" type="range" min="0" max="1000">
			<div>
				<label for="download-frame-sequence-descending">Download Frames Descending</label>
				<input id="download-frame-sequence-descending" type="checkbox">
			</div>
			<div>
				<label for="motion-blur-frame-count">Motion Blur Frame Count</label>
				<input id="motion-blur-frame-count" value="1" type="number" min="1" max="255">
			</div>`;
		settings.prepend(div);
		var downloadAnimationButton = document.getElementById('downloadAnimationHD');
		var outer = this;
		this.motionBlurFrameCount = document.getElementById('motion-blur-frame-count');
		this.downloadFramesDescending = document.getElementById('download-frame-sequence-descending');
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
		if (this.isDownloadingAnimation) {
			console.log('Unable to download animation because we already are downloading one.');
			return;
		}
		this.isDownloadingAnimation = true;
		var fps = 60;
		var frameIndex = 0;
		var motionBlurFrameCount = getDefaultedInteger(this.motionBlurFrameCount.value, 1);
		var motionBlurFrameIndex = -1;
		var frameIncrementStep = 1;
		var outer = this;
		if (this.downloadFramesDescending.checked) {
			frameIncrementStep = -1;
		}
		frameIndex = Math.ceil(parseFloat(outer.deltaTSpinner.value) * fps / 1000);
		  
		function isFrameToSkip() {
			if (frameIncrementStep > 0)
				return frameIndex * 1000 / fps < parseFloat(outer.deltaTSpinner.value);
			else
				return frameIndex < 0;
		}

		function processTimeChange(deltaT) {
			outer.setAnimationTime(deltaT);
		}
		
		function zeroPadNumber(num) {
			var result = '' + (num + 1);
			while (result.length < 8) {
				result = '0' + result;
			}
			return result;
		}

		function getFormattedFrameIndex() {
			var result = zeroPadNumber(frameIndex);
			if (motionBlurFrameCount > 1) {
				result += "_" + zeroPadNumber(motionBlurFrameIndex);
			}
			return result;
		}
		
		function moveToNextFrame() {
			if (motionBlurFrameCount > 1 && motionBlurFrameIndex < motionBlurFrameCount) {
				motionBlurFrameIndex++;
				return true;
			}
			else {
				motionBlurFrameIndex = 0;
			}
			frameIndex += frameIncrementStep;
			while (isFrameToSkip() && frameIndex * 1000 / fps < outer.animation.getMaxTime() && frameIndex >= 0) {
				frameIndex += frameIncrementStep;
			}
			if (frameIndex * 1000 / fps > outer.animation.getMaxTime() || frameIndex < 0) {
				outer.isDownloadingAnimation = false;
				return; // indicate nothing more to render.
			}
			return true; // indicate to render.
		}
		
		function getDeltaT() {
			var deltaT = frameIndex;
			if (motionBlurFrameCount > 1) {
				deltaT += (motionBlurFrameIndex - motionBlurFrameCount * 0.5) * 0.5 / motionBlurFrameCount;
			}
			return deltaT * 1000 / fps;
		}

		function downloadFrame() {
			if (!moveToNextFrame())
				return;
			var frameName = 'cloud_frame_' + getFormattedFrameIndex() + '.png';
			var deltaT = getDeltaT();
			processTimeChange(deltaT);
			outer.downloader.download(frameName).then(function() {
			  if (deltaT <= outer.animation.getMaxTime()) {
				  setTimeout(downloadFrame, 10);
			  }
		  });
		}

		downloadFrame();
	}
	
	setAnimationTime(deltaT) {
		var newSettings = this.animation.getPropertiesForTime(deltaT);
		this.deltaTSpinner.value = deltaT;
		this.renderSettings.setAll(newSettings.uiSettings);
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
		function animationLoop() {
			outer.updateAnimation();
			outer.realtimeRenderer.redraw();
			if (outer.realtimeRenderer.canDraw() && !outer.isPaused) {
				requestAnimationFrame(animationLoop);
			}
		}
		animationLoop();
	}
	
	isBusy() {
		return this.isDownloadingAnimation;
	}

	updateAnimation() {
		var t = new Date().getTime();
		var deltaT = (t - this.startTime);
		if (deltaT > this.animation.getMaxTime() || this.isPaused) {
			this.stop();
		}
		else {
			this.setAnimationTime(deltaT);
		}
	}
}