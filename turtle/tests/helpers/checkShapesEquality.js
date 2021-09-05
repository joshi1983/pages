import { prefixWrapper } from './prefixWrapper.js';

export function checkShapesEquality(shapesArray, shapesInfo, logger) {
	if (!(shapesArray instanceof Array))
		throw new Error(`shapesArray must be an Array but found ${shapesArray}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	if (shapesInfo === undefined)
		return; // nothing to check because shapesInfo was not specified.
	if (!(shapesInfo instanceof Array))
		throw new Error(`shapesInfo must either be undefined or an Array but found ${shapesInfo}`);

	if (shapesArray.length !== shapesInfo.length)
		logger(`Expected ${shapesInfo.length} shapes but found ${shapesArray.length}`);
	else {
		for (let i = 0; i < shapesInfo.length; i++) {
			const shape = shapesArray[i];
			const shapeInfo = shapesInfo[i];
			const plogger = prefixWrapper(`Shape ${i}`, logger);
			if (typeof shapeInfo !== 'object') {
				const msg = `Every shapesInfo element must be an object but found ${shapeInfo} at index ${i}`;
				console.error(msg);
				plogger(msg);
			}
			else {
				if (shapeInfo.className !== undefined) {
					const className = shape.constructor.name;
					if (className !== shapeInfo.className)
						plogger(`Expected class name ${shapeInfo.className} but found ${className}`);
				}
				for (const key in shapeInfo) {
					if (key !== 'className' && shapeInfo.hasOwnProperty(key)) {
						if (shapeInfo[key] !== shape[key])
							plogger(`Expected ${key} to have the value ${shapeInfo[key]} but found ${shape[key]}`);
					}
				}
			}
		}
	}
};