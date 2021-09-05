import { codeToDrawing } from '../../../modules/parsing/execution/codeToDrawing.js';
import { fetchText } from '../../../modules/fetchText.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
const errorTolerance = 4;
const cases = [
	{
		'code': await fetchText('tests/data/bounding-box-test.lgo'),
		'minX': -200,
		'maxX': 200,
		'minY': 0,
		'maxY': 50
	},
	{
		'code': await fetchText('tests/data/bounding-box-miter-line1.lgo'),
		'minX': -14.1,
		'maxX': 48.3,
		'minY': -5.1,
		'maxY': 99.1
	},
	{
		'code': await fetchText('tests/data/bounding-box-round-line1.lgo'),
		'minX': -15,
		'maxX': 49.3,
		'minY': -15,
		'maxY': 109
	}
];

for (let i = 0; i < cases.length; i++) {
	cases[i].drawing = await codeToDrawing(cases[i].code, 0, 10);
}

function isCloseEnough(val1, val2) {
	return Math.abs(val1 - val2) < errorTolerance;
}

function getShapeDescription(shape) {
	return `type ${shape.constructor.name}, position ${shape.position}`;
}

export function testDrawingBoundingBox(logger) {
	cases.forEach(function(caseInfo, index) {
		const boundingBox = caseInfo.drawing.getBoundingBox();
		const shapes = caseInfo.drawing.getShapesArray();
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (!isCloseEnough(boundingBox.max.getY(), caseInfo.maxY)) {
			const filteredShapes = shapes.filter(shape => shape.getBoundingBox().max.getY() === boundingBox.max.getY());
			let msg = `maxY expected to be ${caseInfo.maxY} but got ${boundingBox.max.getY()}.  ${filteredShapes.length} shape(s) have a maxY of ${boundingBox.max.getY()}`;
			if (filteredShapes.length !== 0)
				msg += ` The first shape is ${getShapeDescription(filteredShapes[0])}`;
			plogger(msg);
		}
		if (!isCloseEnough(boundingBox.max.getX(), caseInfo.maxX))
			plogger(`maxX expected to be ${caseInfo.maxX} but got ${boundingBox.max.getX()}`);
		if (!isCloseEnough(boundingBox.min.getY(), caseInfo.minY)) {
			const filteredShapes = shapes.filter(shape => shape.getBoundingBox().min.getY() === boundingBox.min.getY());
			let msg = `minY expected to be ${caseInfo.minY} but got ${boundingBox.min.getY()}.  ${filteredShapes.length} shape(s) have a minY of ${boundingBox.min.getY()}`;
			if (filteredShapes.length !== 0)
				msg += ` The first shape is ${getShapeDescription(filteredShapes[0])}`;
			plogger(msg);
		}
		if (!isCloseEnough(boundingBox.min.getX(), caseInfo.minX))
			plogger(`minX expected to be ${caseInfo.maxX} but got ${boundingBox.min.getX()}`);
	});
};