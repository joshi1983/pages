/*
The initTouchLayout module is for accurately determining whether or not a 
touch-optimized layout should be used or not.

The touch-optimized layout is activated by adding the 'touch-layout' class to document.body.
CSS defines the differences such as a larger zoom menu when touch-layout class is added.

The initial mode is touch-layout if a popular mobile device indicator is found.
In case the initial mode is incorrect, the mode will be adjusted after a 
touch or mouse event is detected.
*/
let touchEventHandled = false;
let mouseEventHandled = false;
let body;

function isLikelyMobile() {
	const agentDetails = navigator.userAgent;
	if (/Android|Mobi|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agentDetails) ) {
	// Hit here if the device is a "popular-ish" mobile device
		return true;
	}
	return false;
}

function startTouchLayout() {
	body.classList.add('touch-layout');
}

function stopTouchLayout() {
	body.classList.remove('touch-layout');
}

function refreshLayoutMode() {
	if (touchEventHandled)
		startTouchLayout();
	else if (mouseEventHandled)
		stopTouchLayout();
}

export function initTouchLayout() {
	body = document.body;
	if (isLikelyMobile())
		startTouchLayout();
	
	window.addEventListener('touchstart', function() {
		touchEventHandled = true;
		refreshLayoutMode();
	});
	window.addEventListener('mousedown', function() {
		mouseEventHandled = true;
		refreshLayoutMode();
	});
};