import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { getUTurnRectInfo } from
'../../../../../modules/drawing/drawers/svg/u-turn-rect/getUTurnRectInfo.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

const keys = ['cornerRadius', 'height', 'rotationRadians', 'width'];
export function testGetUTurnRectInfo(logger) {
	const cases = [
	{'in': [
	new ArcShape(new Vector3D(0, 0, 0), 0, 100, Math.PI),
	new ArcShape(new Vector3D(100, 0, 0), Math.PI, 100, Math.PI),
	], 'out': {
		'height': 200,
		'cornerRadius': 100,
		'width': 300,
		'rotationRadians': Math.PI
	}},
	{'in': [
	new ArcShape(new Vector3D(0, 0, 0), 0, 100, Math.PI),
	new ArcShape(new Vector3D(0, 100, 0), Math.PI, 100, Math.PI),
	], 'out': {
		'height': 200,
		'cornerRadius': 100,
		'width': 300,
		'rotationRadians': -Math.PI / 2
	}}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = getUTurnRectInfo(caseInfo.in);
		if ((typeof result) !== 'object')
			plogger(`Expected result to be an object but got ${result}`);
		else {
			for (const key of keys) {
				if (result[key] !== caseInfo.out[key])
					plogger(`Expected ${key} to be ${caseInfo.out[key]} but got ${result[key]}`);
			}
		}
	});
};