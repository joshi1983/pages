export class DialogStates {
	static RESTORED = 1;
	static MAXIMIZED = 2;

	static validate(state) {
		if (state !== DialogStates.RESTORED && state !== DialogStates.MAXIMIZED)
			throw new Error('Invalid state: ' + state);
	}
};