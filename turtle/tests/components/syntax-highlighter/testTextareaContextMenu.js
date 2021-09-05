import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { processors } from '../../../modules/components/syntax-highlighter/textareaContextMenu.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testProcessors(logger) {
	const staticMethodNames = ['getPopupName', 'isApplicable', 'process'];
	processors.forEach(function(processor, index) {
		const plogger = prefixWrapper(`Processor ${index} with name ${processor.constructor.name}`, logger);
		staticMethodNames.forEach(function(name) {
		if (typeof processor[name] !== 'function')
			plogger(`Expected to find a static method named ${name} but got typeof result ${typeof processor[name]}`);
		});
	});
}

export function testTextareaContextMenu(logger) {
	wrapAndCall([
		testProcessors
	], logger);
};