document.addEventListener('DOMContentLoaded', function() {
	var play = document.getElementById('playAnimation');
	var animation = new Animation();
	
	function playAnimation() {
		var url = animation.getMusicURL();
		var audio;
		var startTimeOffset = 60000;
		if (url !== undefined) {
			audio = new Audio(url);
			audio.currentTime = startTimeOffset * 0.001;
		}
		var startTime = new Date().getTime();
		startTime -= startTimeOffset;
		if (url !== undefined) {
			audio.play();
		}
		function updateAnimation() {
			var t = new Date().getTime();
			var deltaT = t - startTime;
			if (deltaT > animation.getMaxTime()) {
				console.log('about to pause the audio and remove the time-changed listener.');
				if (audio !== undefined)
					audio.pause();
				document.removeEventListener('time-changed', updateAnimation);
			}
			else {
				var eventData = new CustomEvent('animation-update', {
					'detail': {
						'props': animation.getPropertiesForTime(deltaT),
						'deltaT': deltaT
					}
				});
				document.dispatchEvent(eventData);
			}
		}
		
		document.addEventListener('time-changed', updateAnimation);
	}
	
	play.addEventListener('click', playAnimation);
});