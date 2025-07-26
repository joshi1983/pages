import { ProgressIndicator } from '../../helpers/ProgressIndicator.js';
import { ZippedExamples } from '../../../modules/file/file-load-example/ZippedExamples.js';

export async function testZippedExamples(logger) {
	const indicator = new ProgressIndicator('testZippedExamples');
	logger.indicators.push(indicator);
	indicator.setMessage('Waiting for zip');
	await ZippedExamples.asyncInit();
	indicator.setMessage('Got zip');
	const content = ZippedExamples.getContentForFilename('spiral.lgo');
	if (typeof content !== 'string')
		logger(`Expected spiral.lgo to be a string but got ${content}`);
	else if (content.length === 0)
		logger(`Expected content.length to not be 0 but got length ${content.length}`);
	indicator.completed();
};