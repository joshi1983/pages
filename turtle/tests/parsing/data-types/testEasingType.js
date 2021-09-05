import { EaseLinear } from '../../../modules/drawing/vector/easing/EaseLinear.js';
import { EasingType } from '../../../modules/parsing/data-types/EasingType.js';

export function testEasingType(logger) {
	const easingType = new EasingType();
	const linear = new EaseLinear();
	let result = easingType.mayBeCompatibleWithValue(linear);
	if (result !== true)
		logger(`Expected true but got ${result} from easingType.mayBeCompatibleWithValue(linear)`);
};