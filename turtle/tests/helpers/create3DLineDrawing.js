import { createDrawingFromCode } from './createDrawingFromCode.js';
import { noop } from '../../modules/noop.js';

export function create3DLineDrawing() {
	const code = `to drawShape :size
	localmake "gap :size * 0.4
	localmake "squareSize :size - :gap
	localmake "numSides 4
	localmake "center pos
	setPenSize :size * 0.007
	repeat :numSides [
		jumpRight :gap + :squareSize / 2
		rect :squareSize :squareSize
		jumpTo :center
		rollRight 360 / :numSides
	]
end

pitchUp 30
left 20
pitchUp 10
drawShape 100`;
	const logger = noop;
	const result = createDrawingFromCode(code, logger);
	return result;
};