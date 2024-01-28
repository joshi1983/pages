/*
A bit like an Enum for animation download modes.
JavaScript doesn't support enum so this simulates it.
*/
export class AnimationDownloadMode {
	static isValidValue(val) {
		if (val < 0 || !Number.isInteger(val))
			return false;
		return Object.keys(AnimationDownloadMode).some((key) => val === AnimationDownloadMode[key]);
	}
};

['AnimatedGifMode', 'FrameSequenceMode'].
forEach((enumKey, index) => AnimationDownloadMode[enumKey] = index);