import { StringUtils } from '../../../../StringUtils.js';

const nameToInt = new Map();

export class MixBlendMode {
	static parse(blendName) {
		blendName = blendName.toLowerCase();
		return nameToInt.get(blendName);
	}

	static getNameFor(blendModeInt) {
		return names[blendModeInt];
	}

	static getNames() {
		return names;
	}
};

const names = [
	'color',
	'color_burn',
	'color_dodge',
	'darken',
	'difference',
	'exclusion',
	'hard_light',
	'hue',
	'lighter',
	'luminosity',
	'multiply',
	'normal',
	'overlay',
	'saturation',
	'screen',
	'soft_light',
];

let counter = 0;
for (const name of names) {
	nameToInt.set(name, counter);
	const caseName = StringUtils.capitalizeFirstLetter(name);
	MixBlendMode[caseName] = counter++;
}