import { deepCloneVariables } from './deepCloneVariables.js';

/*
Should be called from the context of an ExecutionContext.
*/
export function proceduralImage(procedureName, width, height) {
	const turtle = this.turtle;
	const initialVariables = deepCloneVariables(this.globalVariables);
	const shape = turtle.drawState.proceduralImage(procedureName, width, height, initialVariables);
	if (shape.isVisible()) {
		turtle.drawing.addForegroundShape(shape);
	}
};