import { Colour } from '../../../../modules/Colour.js';
import { LinearGradient } from '../../../../modules/drawing/vector/shapes/gradients/LinearGradient.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { shapeStyleToDTO } from '../../../../modules/drawing-menu/shape-explorer/serialization/shapeStyleToDTO.js';
import { SpreadMethod } from '../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testShapeStyleToDTO(logger) {
	const colorStops = new Map([
		[0, new Colour("black")],
		[1, new Colour("white")]
	]);
	const from = new Vector3D(0, 0, 0);
	const to = new Vector3D(100, 0, 0);
	const gradient = new LinearGradient(colorStops, from, to, SpreadMethod.Pad);
	const styles = [
		new ShapeStyle(),
		new ShapeStyle({'pen': {'width': 0}}),
		new ShapeStyle({'pen': {'width': 1, 'gradient': gradient}}),
	];
	const keysArray = ['pen', 'font', 'material'];
	const keys = new Set(keysArray);
	styles.forEach(function(style, index) {
		const result = shapeStyleToDTO(style, keys);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (typeof result !== 'object')
			plogger('Expected an object but got ' + result);
		else {
			keysArray.forEach(function(key) {
				if (typeof result[key] !== 'object')
					plogger(`Missing key ${key}`);
			});
			try {
				JSON.stringify(result);
			} catch (e) {
				plogger('Encountered unexpected error trying to stringify result.  error = ' + e);
			}
		}
	});
};