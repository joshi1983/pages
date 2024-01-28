export class ElementResizeListener {
	constructor(element, callback) {
		if (!(element instanceof Element))
			throw new Error(`element must be an Element.  Not: ${element}`);
		if (typeof callback !== 'function')
			throw new Error(`callback must be a function.  Not: ${callback}`);
		this.element = element;
		this.callback = callback;
		this.checkSize(false);
		const outer = this;
		this.interval = setInterval(function() {
			outer.checkSize(true);
		}, 100);
	}

	/*
	Help JavaScript's garbage collector by unlinking this from other elements.
	This makes this object and its nearby objects in the graph easier to recognize as safe to remove.
	*/
	dispose() {
		clearInterval(this.interval);
		this.interval = undefined;
		this.element.removeEventListener('resize', this.resizeEventListener);
		this.callback = undefined;
		this.element = undefined;
	}

	checkSize(isDispatching) {
		const box = this.element.getBoundingClientRect();
		const newWidth = Math.round(box.width);
		const newHeight = Math.round(box.height);
		if (newWidth !== this.width || newHeight !== this.height) {
			const previousWidth = this.width;
			const previousHeight = this.height;
			this.width = newWidth;
			this.height = newHeight;
			if (isDispatching === true)
				this.callback({
					'previousWidth': previousWidth,
					'previousHeight': previousHeight,
					'newWidth': newWidth,
					'newHeight': newHeight
				});
		}
	}
};