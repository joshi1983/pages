import { AnimationCommands } from './AnimationCommands.js';
import { ArrayCommands } from './ArrayCommands.js';
import { ColorCommands } from './ColorCommands.js';
import { EasingCommands } from './EasingCommands.js';
import { ListCommands } from './ListCommands.js';
import { MathCommands } from './MathCommands.js';
import { PropertyListCommands } from './PropertyListCommands.js';
import { StringCommands } from './StringCommands.js';

export function getCommandGroups(turtle) {
	let animation;
	if (turtle !== undefined)
		animation = new AnimationCommands(turtle.settings);
	const result = new Map();
	result.set('array', new ArrayCommands());
	result.set('animation', animation);
	result.set('color', new ColorCommands());
	result.set('easing', new EasingCommands());
	result.set('list', new ListCommands());
	result.set('math', new MathCommands());
	result.set('plist', new PropertyListCommands());
	result.set('string', new StringCommands());
	result.set('turtle', turtle);
	return result;
};