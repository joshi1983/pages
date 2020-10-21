document.addEventListener('DOMContentLoaded', function() {
	var play = document.getElementById('playAnimation');
	var animation = new Animation();
	
	function playAnimation() {
		var url = animation.getMusicURL();
		var audio;
		if (url !== undefined) {
			audio = new Audio(url);
			audio.play();
		}
		var startTime = new Date().getTime();
		function updateAnimation() {
			var t = new Date().getTime();
			var deltaT = t - startTime;
			if (deltaT > animation.getMaxTime()) {
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