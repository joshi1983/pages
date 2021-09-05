import { TurtleDrawState } from '../../modules/drawing/TurtleDrawState.js';

export function testTurtleDrawStateOrientation(logger) {
	const tds = new TurtleDrawState();
	tds.setRoll(1);
	if (tds.getRoll() !== 1)
		logger(`Expected roll to be 1 but got ${tds.getRoll()}`);
	if (tds.hasInitialOrientation() !== false)
		logger(`Expected hasInitialOrientation() to return false but got ${tds.hasInitialOrientation()}`);
	tds.reset();
	tds.setPitch(1);
	if (tds.getPitch() !== 1)
		logger(`Expected pitch to be 1 but got ${tds.getPitch()}`);
};