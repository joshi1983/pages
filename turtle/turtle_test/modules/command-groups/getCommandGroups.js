import { AnimationCommands } from './AnimationCommands.js';
import { ArrayCommands } from './ArrayCommands.js';
import { AsyncCommands } from './AsyncCommands.js';
import { ColorCommands } from './ColorCommands.js';
import { EasingCommands } from './EasingCommands.js';
import { GradientCommands } from './GradientCommands.js';
import { LinearAlgebraCommands } from './LinearAlgebraCommands.js';
import { ListCommands } from './ListCommands.js';
import { MathCommands } from './MathCommands.js';
import { PropertyListCommands } from './PropertyListCommands.js';
import { StringCommands } from './StringCommands.js';

export function getCommandGroups(turtle) {
	let animation;
	if (turtle !== undefined)
		animation = new AnimationCommands(turtle.settings);
	const result = new Map();
	result.set('animation', animation);
	result.set('array', new ArrayCommands());
	result.set('async', new AsyncCommands());
	result.set('color', new ColorCommands());
	result.set('easing', new EasingCommands());
	result.set('gradients', new GradientCommands());
	result.set('linearAlgebra', new LinearAlgebraCommands());
	result.set('list', new ListCommands());
	result.set('math', new MathCommands());
	result.set('plist', new PropertyListCommands());
	result.set('string', new StringCommands());
	result.set('turtle', turtle);
	return result;
};