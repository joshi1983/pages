class Benchmarker {
	constructor(renderSettings,downloader) {
		this.screenRefreshRate = 60;
		this.renderSettings = renderSettings;
		this.downloader = downloader;
	}

	initScreenRefreshRate() {
		var outer = this;
		return this.getScreenRefreshRate().then(function(result) {
			outer.screenRefreshRate = result;
		});
	}

	getScreenRefreshRate() {
		return new Promise(function(resolver, rejecter) {
			var count = 0;
			var maxCount = 100;
			var startTime = new Date().getTime();
			function f() {
				count++;
				if (count < maxCount) {
					requestAnimationFrame(f);
				}
				else {
					var msPerFrame = ((new Date().getTime()) - startTime) / maxCount;
					resolver(1000 / msPerFrame);
				}
			}
			requestAnimationFrame(f);
		});
	}
	
	getBenchmarkResults(progressUpdated) {
		// time a few small rendering tasks.
		this.renderSettings.setAll({
			"lightDirectionX":-0.1808,
			"lightDirectionY":0.9151,
			"lightDirectionZ":0.2093,
			"sphereRadius":6,
			"cReal":0.3305600695390808,
			"rotationAngle":1.588748342643635,
			"rotationRadius":1.826562956689198,
			"planeCutValue":5,
			"positionY":0,
			"peakOpacity":2.825827279548622,
			"ambient":0.05000000000000001,
			"scaleFactor":0.9629660657823687,
			"displayMode":1,
			"lineThicknessFactor":0.0005,
			"planeCutAxis":3
		});
		var startT = new Date().getTime();
		return this.downloader.startDownload({
			'w': 40,
			'h': 20,
			'isBenchmarking': true
			}).then(function() {
				var newT = new Date().getTime();
				var deltaT = newT - startT;
				return deltaT + 'ms';
			});
	}	
}