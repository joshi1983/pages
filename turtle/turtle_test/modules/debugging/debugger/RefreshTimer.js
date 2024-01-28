export class RefreshTimer {
	constructor(refresh) {
		if (typeof refresh !== 'function')
			throw new Error('refresh must be a function');

		this.refresh = refresh;
	}

	startContinuousRefresh() {
		if (this.timer === undefined) {
			const outer = this;
			this.timer = setInterval(function() {
				outer.refresh();
			}, 200);
		}
	}

	stopContinuousRefresh() {
		if (this.timer !== undefined) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
	}
}