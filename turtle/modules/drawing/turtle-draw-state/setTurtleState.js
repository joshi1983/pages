import { convertToAlphaColourOrTransparent } from '../../parsing/execution/instructions/data-type-converters/convertToAlphaColourOrTransparent.js';
import { FontWeight } from '../vector/shapes/style/FontWeight.js';
import { isNumber } from '../../isNumber.js';
import { isValidOrientationMatrix } from './isValidOrientationMatrix.js';
import { LineCap } from '../vector/shapes/style/LineCap.js';
import { Orientation2D } from '../vector/Orientation2D.js';
import { Vector3D } from '../vector/Vector3D.js';

export function setTurtleState(turtleDrawState, newState) {
	const newFillBlendMode = newState.get('fillBlendMode');
	if (Number.isInteger(newFillBlendMode))
		turtleDrawState.style.setFillBlendMode(newFillBlendMode);
	const newFillColor = newState.get('fillColor');
	if (newFillColor !== undefined)
		turtleDrawState.style.setFillColor(convertToAlphaColourOrTransparent(newFillColor));
	const newFillGradient = newState.get('fillGradient');
	if (newFillGradient === undefined || newFillGradient instanceof Map)
		turtleDrawState.style.setFillGradient(newFillGradient);
	const newFontFamily = newState.get('fontFamily');
	if (typeof newFontFamily === 'string')
		turtleDrawState.style.setFontFamily(newFontFamily);
	const newFontSize = newState.get('fontSize');
	if (isNumber(newFontSize) && newFontSize > 0)
		turtleDrawState.style.setFontSize(newFontSize);

	const newPenBlendMode = newState.get('penBlendMode');
	if (Number.isInteger(newPenBlendMode))
		turtleDrawState.style.setPenBlendMode(newPenBlendMode);

	const newPenDown = newState.get('isPenDown');
	if (newPenDown === true)
		turtleDrawState.penDown();
	else if (newPenDown === false)
		turtleDrawState.penUp();
	const fontWeight = newState.get('fontWeight');
	if (typeof fontWeight === 'string')
		turtleDrawState.setFontWeight(FontWeight.parse(fontWeight));
	const lineCap = newState.get('lineCap');
	if (typeof lineCap === 'string')
		turtleDrawState.setLineCap(LineCap.parse(lineCap));
	const lineJoinStyle = newState.get('lineJoinStyle');
	if (typeof lineJoinStyle === 'string')
		turtleDrawState.setLineJoinStyle(lineJoinStyle);
	const newPenWidth = newState.get('penSize');
	if (isNumber(newPenWidth))
		turtleDrawState.setPenWidth(newPenWidth);
	const newPosition = newState.get('position');
	if (newPosition instanceof Array && newPosition.length >= 2 && newPosition.length <= 3 && 
	isNumber(newPosition[0]) && isNumber(newPosition[1]) && (
	newPosition.length !== 3 || isNumber(newPosition[2])))
		turtleDrawState.setPosition(new Vector3D(newPosition));
	const orientationData = newState.get('orientation');
	if (isNumber(orientationData)) {
		turtleDrawState.orientation = new Orientation2D(orientationData);
	}
	else if (isValidOrientationMatrix(orientationData)) {
		turtleDrawState.setOrientation(orientationData);
	}
	const newPenColor = newState.get('penColor');
	if (newPenColor !== undefined)
		turtleDrawState.style.setPenColor(convertToAlphaColourOrTransparent(newPenColor));
	const newPenGradient = newState.get('penGradient');
	if (newPenGradient === undefined || newPenGradient instanceof Map)
		turtleDrawState.style.setPenGradient(newPenGradient);
};