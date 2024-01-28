export class AnimationCommands {
	constructor(settings) {
		this.settings = settings;
	}

	animation_duration() {
		return this.settings.animationDurationSeconds;
	}

	animation_time() {
		return this.settings.animationTime;
	}
};