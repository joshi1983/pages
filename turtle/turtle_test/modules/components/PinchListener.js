const pinchers = [];
const eventKeys = ['touchend', 'touchmove'];

function touchMove(event, pincher) {
	pincher.processPoints(event.touches);
}

function touchEnd(event, pincher) {
	pincher.processPoints(event.touches);
}

function getTouchByIdentifier(touches, identifier) {
	for (let i = 0; i < touches.length; i++) {
		if (touches[i].identifier === identifier)
			return touches[i];
	}
}

function getTouchDisplacements(touches1, touches2) {
	const result = [];
	for (let i = 0; i < touches1.length; i++) {
		const touch = touches1[i];
		const matchingTouch = getTouchByIdentifier(touches2, touch.identifier);
		if (matchingTouch !== undefined) {
			result.push({
				'touch2': matchingTouch,
				'touch1': touch
			});
		}
	}
	return result;
}

function distance(touch1, touch2) {
	const dx = touch1.pageX - touch2.pageX;
	const dy = touch1.pageY - touch2.pageY;
	return Math.hypot(dx, dy);
}

class Pincher {
	constructor(e, listener) {
		if (!(e instanceof Element))
			throw new Error('e must be an Element.  Not: ' + e);
		if (typeof listener !== 'function')
			throw new Error('listener must be a function.  Not: ' + listener);
		this.e = e;
		this.listener = listener;
		this.touchPoints = [];
		pinchers.push(this);
		this._bind();
	}

	_bind() {
		const outer = this;
		this.listeners = [
			function(event) {
				touchEnd(event, outer);
			},
			function(event) {
				touchMove(event, outer);
			}
		];
		this.listeners.forEach(function(listener, index) {
			outer.e.addEventListener(eventKeys[index], listener);
		});
	}

	processPoints(touchPoints) {
		let result = false;
		if (touchPoints instanceof TouchList && touchPoints.length >= 2) {
			if (this.touchPoints.length >= 2) {
				const touchDisplacements = getTouchDisplacements(this.touchPoints, touchPoints);
				if (touchDisplacements.length === 2) {
					const oldDistance = distance(touchDisplacements[0].touch1, touchDisplacements[1].touch1);
					const newDistance = distance(touchDisplacements[0].touch2, touchDisplacements[1].touch2);
					// The max with 0.01 is to ensure we never divide by 0.
					const deltaRatio = newDistance / Math.max(0.01, oldDistance);
					this.listener(deltaRatio);
					result = true;
				}
			}
			this.touchPoints = touchPoints;
		}
		else
			this.touchPoints = [];
		return result;
	}

	unbind() {
		const outer = this;
		eventKeys.forEach(function(eventKey, index) {
			outer.e.removeEventListener(eventKey, outer.listeners[index]);
		});
	}
}

export class PinchListener {
	static bind(e, listener) {
		new Pincher(e, listener);
	}

	static unbind(e, listener) {
		for (let i = 0; i < pinchers.length; i++) {
			const pincher = pincher[i];
			if (pincher.e === e && pincher.listener === listener) {
				pincher.unbind();
				pinchers.splice(i, 1);
			}
		}
	}
};