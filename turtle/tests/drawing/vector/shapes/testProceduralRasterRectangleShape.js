import { Camera } from '../../../../modules/drawing/vector/Camera.js';
import { ProceduralRasterRectangleShape } from
'../../../../modules/drawing/vector/shapes/ProceduralRasterRectangleShape.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testProceduralRasterRectangleShape(logger) {
	const position = new Vector3D();
	const style = new ShapeStyle();
	const camera = new Camera();
	const initialVariables = new Map();
	const shape = new ProceduralRasterRectangleShape(position, 100, 100, Math.PI, 'getcolor', initialVariables, style);
	const box = shape.getBoundingBox();
	if (typeof box !== 'object')
		logger(`box expected to be an object but got ${box}`);
	const isVisible = shape.isVisible();
	if (isVisible !== true)
		logger(`Expected true but got ${isVisible}`);
	const transformedShape = shape.transformBy(camera);
	if (!(transformedShape instanceof ProceduralRasterRectangleShape))
		logger(`Expected a ProceduralRasterRectangleShape but got ${transformedShape}`);
};