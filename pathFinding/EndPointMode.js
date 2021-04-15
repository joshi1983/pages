class EndPointMode {
	constructor(settings) {
		this.settings = settings;
		this.id = 'end-point';
	}

	click(event) {
		this.settings.endPoint.set(event);
	}
}