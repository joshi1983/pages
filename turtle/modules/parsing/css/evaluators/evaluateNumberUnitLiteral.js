import { isCompleteNumberLiteral } from '../scanning/isCompleteNumberLiteral.js';
import { isNumber } from '../../../isNumber.js';

/*
Some of these values are mentioned at:
https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
*/
const unitFactorMap = new Map([
	['%', 0.01],
	['em', 14],
	['rem', 14],
	['turn', Math.PI * 2],
	['deg',  Math.PI / 180],
	['rad', 1],
	['hz', 1],
	['Hz', 1],
	['cm', 37.8],
	['mm', 3.78],
	['Q',37.8 / 40],
	['px', 1],
	['ms', 1],
	['s', 1000],
	['vw', 1920 / 100],
	['vh', 1080 / 100],
]);
unitFactorMap.set('in', 2.54 * unitFactorMap.get('cm'));
unitFactorMap.set('pc', unitFactorMap.get('in') / 6);
unitFactorMap.set('pt', unitFactorMap.get('in') / 72);

export function evaluateNumberUnitLiteral(token) {
	let outerFactor = 1, num;
	const val = token.val;
	for (const [unit, factor] of unitFactorMap) {
		if (val.endsWith(unit)) {
			const prefix = val.substring(0, val.length - unit.length);
			if (isCompleteNumberLiteral(prefix)) {
				outerFactor = factor;
				num = prefix;
				break;
			}
		}
	}
	if (num === undefined) {
		let s = val.substring(0, val.length - 1);
		while (!isCompleteNumberLiteral(s))
			s = s.substring(0, s.length - 1);
		num = s;
	}
	num = parseFloat(num);
	if (isNumber(num))
		return num * outerFactor;
};