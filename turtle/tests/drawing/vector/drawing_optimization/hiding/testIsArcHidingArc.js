import { AlphaColour } from
'../../../../../modules/AlphaColour.js';
import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { isArcHidingArc } from
'../../../../../modules/drawing/vector/drawing_optimization/hiding/isArcHidingArc.js';
import { LineCap } from
'../../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

await AlphaColour.asyncInit();

function lineCapToArcShape(lineCap) {
	const shape = new ArcShape(new Vector3D(0, 0, 0), 0, 100, 1);
	shape.style.setLineCap(lineCap);
	return shape;
}

function testWithVariousLineCaps(logger) {
	const position1 = new Vector3D(0, 0, 0);
	const cases = [];
	for (const lineCap of [LineCap.Butt, LineCap.Round, LineCap.Square]) {
		const arc1 = new ArcShape(position1, 1, 100, 2);
		arc1.style.setLineCap(lineCap);
		const lineCapName = `arc1.lineCap=${LineCap.getNameFor(lineCap)}`;
		cases.push({'name': `${lineCapName} arc should hide its clone`,
			'inArgs': [arc1, arc1.deepClone()], 'out': true});
		if (lineCap !== LineCap.Square) {
			const arc2 = new ArcShape(position1, 1, 100, 1);
			arc2.style.setLineCap(lineCap);
			cases.push({'name': `${lineCapName} arc2 test with angle=${arc2.angle}`,
				'inArgs': [arc1, arc2], 'out': true});
		}
		const arc3 = new ArcShape(position1, 1, 100, 3);
		arc3.style.setLineCap(lineCap);
		cases.push({
			'name': `${lineCapName} arc3 test with angle=${arc3.angle}`,
			'inArgs': [arc1, arc3], 'out': false});
	}
	const lineCapPairs = [
		{'in': [LineCap.Butt, LineCap.Round], 'out': false},
		{'in': [LineCap.Butt, LineCap.Square], 'out': false},
		{'in': [LineCap.Round, LineCap.Butt], 'out': true},
		{'in': [LineCap.Round, LineCap.Square], 'out': false},
		{'in': [LineCap.Square, LineCap.Butt], 'out': true},
		{'in': [LineCap.Square, LineCap.Round], 'out': true}
	];
	for (const pair of lineCapPairs) {
		cases.push({
			'name': LineCap.getNameFor(pair.in[0]) + ' hides ' + LineCap.getNameFor(pair.in[1]) + ' ' + pair.out,
			'inArgs': pair.in.map(lineCapToArcShape),
			'out': pair.out
		});
	}
	testInOutPairs(cases, isArcHidingArc, logger);
}

function testGeneralCases(logger) {
	const position1 = new Vector3D(0, 0, 0);
	const position2 = new Vector3D(1, 2, 3);
	const arc1 = new ArcShape(position1, 1, 100, 1);
	const arc2 = new ArcShape(position2, 2, 200, 2);
	const arc1ButThick = arc1.deepClone();
	arc1ButThick.style.setPenWidth(arc1.style.getPenWidth() * 2);
	const arc1ButSemitransparent = arc1.deepClone();
	arc1ButSemitransparent.style.setPenColor(new AlphaColour('#8f00'));
	const arc1ButDifferentRotation = arc1.deepClone();
	arc1ButDifferentRotation.rotationRadians = 0.5;
	const arc1ButDifferentRotation2 = arc1.deepClone();
	arc1ButDifferentRotation2.rotationRadians = 1.5;
	const arc1ButDifferentRotation3 = arc1.deepClone();
	arc1ButDifferentRotation3.rotationRadians = Math.PI * 0.99; // adding the angle 1 will wrap the angle back close to 0.
	const arc1ButNegativeAngle = arc1.deepClone();
	arc1ButNegativeAngle.angle = -arc1ButNegativeAngle.angle;
	const leftArc = new ArcShape(position1, 0, 100, Math.PI);
	const rightArc = new ArcShape(position1, 0, 100, -Math.PI);
	const cases = [
		{'inArgs': [
			arc1, arc1
		], 'out': true},
		{'inArgs': [
			arc2, arc2
		], 'out': true},
		{'inArgs': [
			arc1, arc2
		], 'out': false},
		{
			'inArgs': [
				arc1, arc1ButThick
			], 'out': false},
		{
			'inArgs': [
				arc1ButThick, arc1, 
			], 'out': true},
		{
			'inArgs': [
				arc1, arc1ButSemitransparent
			], 'out': true},
		{
			'inArgs': [
				arc1ButSemitransparent, arc1
			], 'out': true},
		{
			'inArgs': [
				arc1, arc1ButDifferentRotation
			],
			'out': false
		},
		{
			'inArgs': [
				arc1ButDifferentRotation, arc1 
			],
			'out': false
		},
		{
			'name': 'arc1 hides arc1ButDifferentRotation2 should be false',
			'inArgs': [
				arc1, arc1ButDifferentRotation2
			],
			'out': false
		},
		{
			'name': 'arc1ButDifferentRotation2 hides arc1 should be false',
			'inArgs': [
				arc1ButDifferentRotation2, arc1
			],
			'out': false
		},
		{
			'name': 'arc1 hides arc1ButDifferentRotation3 should be false',
			'inArgs': [
				arc1, arc1ButDifferentRotation3
			],
			'out': false
		},
		{
			'name': 'arc1ButDifferentRotation3 hides arc1 should be false',
			'inArgs': [
				arc1ButDifferentRotation3, arc1
			],
			'out': false
		},
		{
			'name': 'arc1ButNegativeAngle hides arc1 should be false',
			'inArgs': [
				arc1ButNegativeAngle, arc1
			],
			'out': false
		},
		{
			'name': 'arc1 hides arc1ButNegativeAngle should be false',
			'inArgs': [
				arc1, arc1ButNegativeAngle
			],
			'out': false
		},
		{
			'name': 'left arc hides right arc should be false',
			'inArgs': [
				leftArc, rightArc
			],
			'out': false
		},
		{
			'name': 'right arc hides left arc should be false',
			'inArgs': [
				rightArc, leftArc
			],
			'out': false
		}
	];
	testInOutPairs(cases, isArcHidingArc, logger);
}

export function testIsArcHidingArc(logger) {
	wrapAndCall([
		testGeneralCases,
		testWithVariousLineCaps
	], logger);
};