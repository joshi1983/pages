import { messageToDivNoProcessLinks } from '../../modules/components/messageToDivNoProcessLinks.js';
import { MessageTypes } from '../../modules/components/MessageTypes.js';

export function testMessageToDivNoProcessLinks(logger) {
	const types = [MessageTypes.TypeError, MessageTypes.TypePrinted, MessageTypes.TypeSpecial,
	MessageTypes.TypeSuccess, MessageTypes.TypeTip, MessageTypes.TypeWarning];
	types.forEach(function(type) {
		function check(result) {
			if (!(result instanceof Element))
				logger('result expected to be an Element');
			else {
				if (result.textContent !== "Hello")
					logger('textContent expected to be Hello but got ' + result.textContent);
			}
		}
		const div1 = messageToDivNoProcessLinks("Hello", type, false);
		check(div1);
		const div2 = messageToDivNoProcessLinks("<strong>Hello</strong>", type, true);
		check(div2);
	});
};