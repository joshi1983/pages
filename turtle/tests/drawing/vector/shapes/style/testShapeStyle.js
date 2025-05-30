import { AlphaColour } from '../../../../../modules/AlphaColour.js';
import { Colour } from '../../../../../modules/Colour.js';
import { createRadialGradient } from '../../../../helpers/createRadialGradient.js';
import { FontWeight } from '../../../../../modules/drawing/vector/shapes/style/FontWeight.js';
import { LineJoinStyle } from '../../../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { MixBlendMode } from '../../../../../modules/drawing/vector/shapes/mix-blend-modes/MixBlendMode.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { RadialGradient } from '../../../../../modules/drawing/vector/shapes/gradients/RadialGradient.js';
import { ShapeStyle } from '../../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Transparent } from '../../../../../modules/Transparent.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function testDefaultShapeStyle(logger) {
	const defaultShapeStyle = new ShapeStyle();
	if (!defaultShapeStyle.getPenColor().equals(new Colour('#000')))
		logger('Expected default pen color to be black but got ' + defaultShapeStyle.getPenColor());
	if (defaultShapeStyle.getPenBlendMode() !== MixBlendMode.Normal)
		logger(`Expected default pen blend mode to be ${MixBlendMode.Normal} but found ${defaultShapeStyle.getPenBlendMode()}`);
	if (defaultShapeStyle.getPenWidth() !== 1)
		logger('Expected default pen width to be 1 but got ' + defaultShapeStyle.getPenWidth());

	if (defaultShapeStyle.getFillBlendMode() !== MixBlendMode.Normal)
		logger(`Expected default fill blend mode to be ${MixBlendMode.Normal} but found ${defaultShapeStyle.getFillBlendMode()}`);
	if (defaultShapeStyle.getFillColor() !== Transparent)
		logger('Expected default fill color to be transparent but got ' + defaultShapeStyle.getFillColor());
	if (defaultShapeStyle.getFontWeight() !== FontWeight.Normal)
		logger('Expected default font weight to be normal but got ' + defaultShapeStyle.getFontWeight());

	if (defaultShapeStyle.getLineJoinStyle() !== LineJoinStyle.Miter)
		logger(`Expected defaultShapeStyle.getLineJoinStyle() to return ${LineJoinStyle.Miter} but got ${s.getLineJoinStyle()} `+
		`which has the name ${LineJoinStyle.getNameFor(defaultShapeStyle.getLineJoinStyle())}`);
	if (defaultShapeStyle.getMiterLimit() !== 10)
		logger(`Expected miterLimit to initially be 10 but got ${defaultShapeStyle.getMiterLimit()}`);
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
			'width': 10,
			'miterLimit': 15
		},
		'material': {
			'fill': {
				'color': new Colour('black')
			}
		}
	});
	if (s.pen.miterLimit !== 15)
		logger(`Expected pen.miterLimit to be 15 but got ${s.pen.miterLimit}`);
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
	s.setFontWeight(FontWeight.Bold);
	s.setFontFamily('Courier');
	if (typeof s.getFont() !== 'string')
		logger('getFont() expected to return a string but got something else.  Result = ' + s.getFont());
	if (s.getMiterLimit() !== 15)
		logger(`Expected getMiterLimit() to return 15 but got ${s.getMiterLimit()}`);
}

function testDeepClone(logger) {
	const c = new ShapeStyle();
	c.setPenWidth(5);
	c.setPenColor(new Colour('#123'));
	c.setFillColor(new Colour('#567'));
	c.setMiterLimit(16);
	c.setFontWeight(FontWeight.Bold);
	const clone = c.deepClone();
	if (clone.getPenWidth() !== 5)
		logger('clone pen width expected to be 5 but got ' + clone.getPenWidth());
	if (!clone.getPenColor().equals(new Colour('#123')))
		logger('clone pen width expected to be #112233 but got ' + clone.getPenColor());
	if (!clone.getFillColor().equals(new Colour('#567')))
		logger('clone fill color expected to be #556677 but got ' + clone.getFillColor());
	if (clone.getFontWeight() !== FontWeight.Bold)
		logger('clone font weight expected to be bold but got ' + clone.getFontWeight());
	if (clone.getMiterLimit() !== 16)
		logger(`cloned miterLimit expected to be 16 but got ${clone.getMiterLimit()}`);
	c.setPenWidth(6);
	c.setPenColor(new Colour('#234'));
	c.setFillColor(new Colour('#890'));
	c.setFontWeight(FontWeight.Normal);
	c.setMiterLimit(20);
	if (clone.getPenWidth() !== 5)
		logger('After mutating original copy, clone pen width expected to be 5(not 6) but got ' + clone.getPenWidth());
	if (!clone.getPenColor().equals(new Colour('#123')))
		logger('After mutating original copy, clone pen width expected to be #112233(not #223344) but got ' + clone.getPenColor());
	if (!clone.getFillColor().equals(new Colour('#567')))
		logger('After mutating original copy, clone fill color expected to be #556677(not #889900) but got ' + clone.getFillColor());
	if (clone.getFontWeight() !== FontWeight.Bold)
		logger('After mutating original copy, clone font weight expected to be bold but got ' + clone.getFontWeight());
	if (clone.getMiterLimit() !== 16)
		logger(`After mutating original copy, clone miterLimit expected to still be 16 but got ${clone.getMiterLimit()}`);
}

function testIsFillVisible(logger) {
	const cases = [
	{'out': false},// fill defaults to transparent
	{'material': {'fill': {'color': Transparent}}, 'out': false},
	{'material': {'fill': {'color': new Colour('#fff')}}, 'out': true},
	{'material': {'fill': {'color': new AlphaColour('#0fff')}}, 'out': false},
	{'material': {'fill': {'color': new AlphaColour('#1fff')}}, 'out': true},
	{'material': {'fill': {'color': new AlphaColour('#ffff')}}, 'out': true},
	{'material': {'fill': {'gradient': createRadialGradient()}}, 'out': true}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const shapeStyle = new ShapeStyle(caseInfo);
		const result = shapeStyle.isFillVisible();
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
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
	c.setMiterLimit(100);
	if (c.getMiterLimit() !== 100)
		logger('Expected getMiterLimit() to return 100 but got ' + c.getMiterLimit());
}

export function testShapeStyle(logger) {
	wrapAndCall([
		testConstructor,
		testDeepClone,
		testDefaultShapeStyle,
		testIsFillVisible,
		testSetFillGradient,
		testSetPenGradient,
		testVariousMethods
	], logger);
};