import { BufferedParseLogger } from '../../../modules/parsing/loggers/BufferedParseLogger.js';
import { createRootToken } from '../../helpers/createRootToken.js';
import { MessageTypes } from '../../../modules/components/MessageTypes.js';
import { ParseMessage } from '../../../modules/parsing/loggers/ParseMessage.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

const token = createRootToken();

function testBasics(logger) {
	const bpLogger = new BufferedParseLogger();
	[true, false].forEach(function(isHTML) {
		bpLogger.error('Something is wrong', token, isHTML);
		bpLogger.warn('Something could be done better', token, isHTML);
		bpLogger.tip('Consider using this.  It will be more efficient.', token, isHTML);
	});
	if (bpLogger._messages.length !== 6)
		logger('Expected to have 6 messages but we instead have ' + bpLogger._messages.length);
	const bpLogger2 = new BufferedParseLogger();
	bpLogger.sendAllMessagesTo(bpLogger2);
	if (bpLogger2._messages.length !== 6)
		logger('Expected to have 6 messages in bpLogger2 after sending them all but we instead have ' + bpLogger2._messages.length);

	bpLogger.reset();
	if (bpLogger._messages.length !== 0)
		logger('Expected to have 0 messages but we instead have ' + bpLogger._messages.length);
	const messages = bpLogger.getMessages();
	if (!(messages instanceof Array))
		logger('messages expected to be an Array but it is not.  messages: ' + messages);
}

function testLogAll(logger) {
	const messages = [
		new ParseMessage(MessageTypes.TypeError, 'hi', token, false)
	];
	const bpLogger = new BufferedParseLogger();
	bpLogger.logAll(messages);
}

export function testBufferedParseLogger(logger) {
	wrapAndCall([
		testBasics,
		testLogAll
	], logger);
};