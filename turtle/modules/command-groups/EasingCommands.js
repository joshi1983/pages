import { easeClasses } from '../drawing/vector/easing/easeClasses.js';
import { StringUtils } from '../StringUtils.js';

export class EasingCommands {
	constructor() {
		/*
		Make the various easing functions available as methods on 
		this instance of EasingCommands.

		We're implementing the methods in abstract in a reflection-like way 
		to reduce duplication of code.
		This handles converting class names like "EaseSteps" to appropriate method names like 'easeSteps'.
		*/
		for (let i = 0; i < easeClasses.length; i++) {
			const easeClass = easeClasses[i];
			const methodName = StringUtils.firstCharLower(easeClass.name);
			this[methodName] = function() {
				return new easeClass(...arguments);
			};
		}
	}

	interpolateRatio(easeFunction, ratio) {
		return easeFunction.getRatio(ratio);
	}
};