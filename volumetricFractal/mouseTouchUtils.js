class MouseTouchUtils {
	constructor(canvas, processDrag) {
		var oldMouseX, oldMouseY, oldTouchX, oldTouchY;
  
		function mouseMoved(event) {
			if (typeof oldMouseX === 'number') {
				var x = event.clientX;
				var y = event.clientY;
				processDrag(oldMouseX - x, oldMouseY - y);
				oldMouseX = x;
				oldMouseY = y;
			}
		}

		function mouseDown(event) {
			oldMouseX = event.clientX;
			oldMouseY = event.clientY;
		}

		function mouseUp(event) {
			oldMouseX = undefined;
			oldMouseY = undefined;
		}

		function touchMove(event) {
			if (event.targetTouches.length === 0) {
				/* rarely happens but I hit this case 
				while touching and dragging a few times quickly.
				*/
				return;
			}
			var x = event.targetTouches[0].pageX;
			var y = event.targetTouches[0].pageY;
			if (typeof x === 'number' && typeof y === 'number' 
			&& typeof oldTouchX === 'number' && typeof oldTouchY === 'number') {
				processDrag(oldTouchX - x, oldTouchY - y);
				oldTouchX = x;
				oldTouchY = y;
			}
		}

		function touchStart(event) {
			oldTouchX = event.targetTouches[0].pageX;
			oldTouchY = event.targetTouches[0].pageY;
		}

		function touchEnd(event) {
			oldTouchX = undefined;
			oldTouchY = undefined;
		}
		
		canvas.addEventListener('mousemove', mouseMoved);
		canvas.addEventListener('mousedown', mouseDown);
		canvas.addEventListener('mouseup', mouseUp);
		canvas.addEventListener('touchstart', touchStart);
		canvas.addEventListener('touchmove', touchMove);
		canvas.addEventListener('touchend', touchEnd);
	}
}