import { Colour } from '../../../../../modules/Colour.js';
import { createRadialGradient } from '../../../../helpers/createRadialGradient.js';
import { LineJoinStyle } from '../../../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { RadialGradient } from '../../../../../modules/drawing/vector/shapes/gradients/RadialGradient.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Transparent } from '../../../../../modules/Transparent.js';

function testDefaultShapeStyle(logger) {
	const defaultShapeStyle = new ShapeStyle();
	if (!defaultShapeStyle.getPenColor().equals(new Colour('#000')))
		logger('Expected default pen color to be black but got ' + defaultShapeStyle.getPenColor());
	if (defaultShapeStyle.getPenWidth() !== 1)
		logger('Expected default pen width to be 1 but got ' + defaultShapeStyle.getPenWidth());
	if (defaultShapeStyle.getFillColor() !== Transparent)
		logger('Expected default fill color to be transparent but got ' + defaultShapeStyle.getFillColor());
	if (defaultShapeStyle.getLineJoinStyle() !== LineJoinStyle.Miter)
		logger(`Expected defaultShapeStyle.getLineJoinStyle() to return ${LineJoinStyle.Miter} but got ${s.getLineJoinStyle()} `+
		`which has the name ${LineJoinStyle.getNameFor(defaultShapeStyle.getLineJoinStyle())}`);
}

function testConstructor(logger) {
	new ShapeStyle();
	new ShapeStyle({});
	const casesToThrowException = [3, null, []];
		casesToThrowException.forEach(function(caseInfo) {
		try {
			new ShapeStyle(caseInfo);
			logger('ShapeStyle constructor should have thrown an exception for ' + JSON.stringify(caseInfo));
		} catch (e) {
		}
	});

	const s = new ShapeStyle({
		'pen': {
			'color': new Colour('red'),
			'width': 10
		},
		'material': {
			'fill': {
				'color': new Colour('black')
			}
		}
	});
	if (s.pen.width !== 10)
		logger('Expected pen.width to be 10 but got ' + s.pen.width);
	if (!s.pen.color.equals(new Colour('red')))
		logger('Expected pen.color to be ' + new Colour('red') + ' but got ' + s.pen.color);
	if (s.getLineJoinStyle() !== LineJoinStyle.Miter)
		logger(`Expected getLineJoinStyle() to return ${LineJoinStyle.Miter} but got ${s.getLineJoinStyle()} `+
		`which has the name ${LineJoinStyle.getNameFor(s.getLineJoinStyle())}`);
	if (s.material.fill.color === null)
		logger('Expected material.fill.color to be a Colour but got null');
	else if (!s.material.fill.color.equals(new Colour('black')))
		logger('Expected material.fill to be black but got ' + s.material.fill.color);
	s.setFontSize(16);
	s.setFontFamily('Courier');
	if (typeof s.getFont() !== 'string')
		logger('getFont() expected to return a string but got something else.  Result = ' + s.getFont());
}

function testDeepClone(logger) {
	const c = new ShapeStyle();
	c.setPenWidth(5);
	c.setPenColor(new Colour('#123'));
	c.setFillColor(new Colour('#567'));
	const clone = c.deepClone();
	if (clone.getPenWidth() !== 5)
		logger('clone pen width expected to be 5 but got ' + clone.getPenWidth());
	if (!clone.getPenColor().equals(new Colour('#123')))
		logger('clone pen width expected to be #112233 but got ' + clone.getPenColor());
	if (!clone.getFillColor().equals(new Colour('#567')))
		logger('clone fill color expected to be #556677 but got ' + clone.getFillColor());
	c.setPenWidth(6);
	c.setPenColor(new Colour('#234'));
	c.setFillColor(new Colour('#890'));
	if (clone.getPenWidth() !== 5)
		logger('After mutating original copy, clone pen width expected to be 5(not 6) but got ' + clone.getPenWidth());
	if (!clone.getPenColor().equals(new Colour('#123')))
		logger('After mutating original copy, clone pen width expected to be #112233(not #223344) but got ' + clone.getPenColor());
	if (!clone.getFillColor().equals(new Colour('#567')))
		logger('After mutating original copy, clone fill color expected to be #556677(not #889900) but got ' + clone.getFillColor());
}

function testSetFillGradient(logger) {
	const c = new ShapeStyle();
	const gradient = createRadialGradient();
	c.setFillGradient(gradient);
	if (!(c.getFillGradient() instanceof RadialGradient))
		logger(`Expected a radial gradient but got: ${c.getFillGradient()}`);
}

function testSetPenGradient(logger) {
	const c = new ShapeStyle();
	const gradient = createRadialGradient();
	c.setPenGradient(gradient);
	if (!(c.getPenGradient() instanceof RadialGradient))
		logger(`Expected a radial gradient but got: ${c.getPenGradient()}`);
}

function testVariousMethods(logger) {
	const c = new ShapeStyle();
	c.setPenWidth(5);
	if (c.getPenWidth() !== 5)
		logger('Expected pen width to be 5 but got ' + c.getPenWidth());
	c.setPenColor(new Colour('#123'));
	if (!c.getPenColor().equals(new Colour('#123')))
		logger('Expected pen color to be ' + (new Colour('#123')) + ' but got ' + c.getPenColor());
	c.setFillColor(Transparent);
	if (c.getFillColor() !== Transparent)
		logger('Expected fill color to be transparent but got ' + c.getFillColor());
	c.setFillColor(new Colour('#543'));
	if (!c.getFillColor().equals(new Colour('#543')))
		logger('Expected fill color of ' + (new Colour('#543')) + ' but got ' + c.getFillColor());
	if (c.isPenVisible() !== true)
		logger('Expected pen visibile to be true but got ' + c.isPenVisible());
	c.setPenWidth(0);
	if (c.isPenVisible() !== false)
		logger('Expected pen visibile to be false but got ' + c.isPenVisible());
}

export function testShapeStyle(logger) {
	testConstructor(prefixWrapper('testConstructor', logger));
	testDeepClone(prefixWrapper('testDeepClone', logger));
	testDefaultShapeStyle(prefixWrapper('testDefaultShapeStyle', logger));
	testSetFillGradient(prefixWrapper('testSetFillGradient', logger));
	testSetPenGradient(prefixWrapper('testSetPenGradient', logger));
	testVariousMethods(prefixWrapper('testMethods', logger));
};