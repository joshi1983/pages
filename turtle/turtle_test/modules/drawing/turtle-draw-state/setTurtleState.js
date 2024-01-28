import { convertToAlphaColourOrTransparent } from '../../parsing/execution/instructions/data-type-converters/convertToAlphaColourOrTransparent.js';
import { isNumber } from '../../isNumber.js';
import { LineCap } from '../vector/shapes/style/LineCap.js';
import { MathCommands } from '../../command-groups/MathCommands.js';
import { Vector3D } from '../vector/Vector3D.js';

export function setTurtleState(turtleDrawState, newState) {
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
	const newPenDown = newState.get('isPenDown');
	if (newPenDown === true)
		turtleDrawState.penDown();
	else if (newPenDown === false)
		turtleDrawState.penUp();
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
	const newHeadingDegrees = newState.get('heading');
	if (isNumber(newHeadingDegrees))
		turtleDrawState.setHeading(newHeadingDegrees * MathCommands.degToRadianScale);
	const newPenColor = newState.get('penColor');
	if (newPenColor !== undefined)
		turtleDrawState.style.setPenColor(convertToAlphaColourOrTransparent(newPenColor));
	const newPenGradient = newState.get('penGradient');
	if (newPenGradient === undefined || newPenGradient instanceof Map)
		turtleDrawState.style.setPenGradient(newPenGradient);
};