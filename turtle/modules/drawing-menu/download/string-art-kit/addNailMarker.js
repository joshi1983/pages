import { CircleShape } from '../../../drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../Colour.js';
import { LineSegmentShape } from '../../../drawing/vector/shapes/LineSegmentShape.js';
import { ShapeStyle } from '../../../drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

export function addNailMarker(v2d, radius, shapes) {
	const circleStyle = new ShapeStyle({
		'pen': {
			'width': radius * 0.05,
			'color': new Colour('#000')
		}
	});
	const lineStyle = new ShapeStyle({
		'pen': {
			'width': radius * 0.1,
			'color': new Colour('#000')
		}
	});
	const v3D = new Vector3D(v2d.getX(), v2d.getY(), 0);
	shapes.push(new CircleShape(v3D, radius, circleStyle.deepClone()));
	const halfPi = Math.PI * 0.5;
	for (let angle = 0; angle <= halfPi; angle += halfPi) {
		const line = new LineSegmentShape(v3D.getDisplacedByPolar(angle, radius), v3D.getDisplacedByPolar(angle + Math.PI, radius), lineStyle);
		shapes.push(line);
	}
};