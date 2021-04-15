class StartPointMode {
	constructor(settings) {
		this.settings = settings;
		this.id = 'start-point';
	}

	click(event) {
		this.settings.startPoint.set(event);
	}
}