import { StringUtils } from '../StringUtils.js';
const moduleNames = [
	'AnimationCommands',
	'ArrayCommands',
	'AsyncCommands',
	'ColorCommands',
	'DrawingCommands',
	'EasingCommands',
	'GradientCommands',
	'LinearAlgebraCommands',
	'ListCommands',
	'MathCommands',
	'PathCommands',
	'PropertyListCommands',
	'RandomCommands',
	'StringCommands'
];

const groupNamePairs = [
	['plist', 'PropertyListCommands'],
	['gradients', 'GradientCommands']
];
export const groupNamesMap = new Map(groupNamePairs);
const modulesMap = new Map();
let AnimationCommands, DrawingCommands, RandomCommands;

for (const name of moduleNames) {
	const url = `./${name}.js`;
	const groupPair = groupNamePairs.filter(p => p[1] === name)[0];
	let groupName = groupPair === undefined ? undefined : groupPair[0];
	if (groupName === undefined) {
		groupName = StringUtils.firstCharLower(name);
		if (groupName.endsWith('Commands'))
			groupName = groupName.substring(0, groupName.length - 'Commands'.length);

		groupNamesMap.set(groupName, name);
	}
	const module = await import(url);
	const func = module[name];
	modulesMap.set(groupName, func);
	switch (name) {
		case 'AnimationCommands':
			AnimationCommands = func;
			break;
		case 'DrawingCommands':
			DrawingCommands = func;
			break;
		case 'RandomCommands':
			RandomCommands = func;
			break;
	}
}

export function getCommandGroups(turtle) {
	let animation, drawing, random;
	if (turtle !== undefined) {
		animation = new AnimationCommands(turtle.settings);
		drawing = new DrawingCommands(turtle.settings);
		random = new RandomCommands(turtle.settings);
	}
	const result = new Map();
	result.set('animation', animation);
	result.set('random', random);
	result.set('turtle', turtle);
	result.set('drawing', drawing);

	for (const name of modulesMap.keys()) {
		if (!result.has(name)) {
			const constructor1 = modulesMap.get(name);
			result.set(name, new constructor1());
		}
	}
	return result;
};