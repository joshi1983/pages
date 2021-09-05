import { MessageTypes } from '../../MessageTypes.js';
import { ParseMessage } from '../../../parsing/loggers/ParseMessage.js';
import { showParseMessagesAtLine } from './showParseMessagesAtLine.js';

export class LineNumber {
	constructor(index) {
		this.index = index;
		this.isExecutionPoint = false;
		this.hasBreakpoint = false;
		this.clearMessages();
	}

	addMessage(message) {
		if (!(message instanceof ParseMessage))
			throw new Error('message must be a ParseMessage');
		this.messages.push(message);
		if (this.mostUrgentMessageType === undefined ||
		MessageTypes.getMostUrgentType(message.type, this.mostUrgentMessageType) !== this.mostUrgentMessageType) {
			this.mostUrgentMessageType = message.type;
			this.messageTypeClassName = MessageTypes.getClassName(this.mostUrgentMessageType);
			this.refreshDivClasses();
		}
	}

	clearMessages() {
		this.messageTypeClassName = undefined;
		this.mostUrgentMessageType = undefined;
		this.messages = [];
		this.refreshDivClasses();
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.innerText = this.index;
			this.refreshDivClasses();
			const outer = this;
			this.div.addEventListener('click', function() {
				outer.refreshDivClasses();
			});
		}
		return this.div;
	}

	hasMessage() {
		return this.mostUrgentMessageType !== undefined;
	}

	refreshDivClasses() {
		if (this.div !== undefined) {
			this.div.removeAttribute('title');
			showParseMessagesAtLine(this);
			if (this.hasBreakpoint) {
				this.div.classList.add('breakpoint', 'line-number');
				this.div.setAttribute('title', `Line ${this.index} with a breakpoint`);
			}
			else {
				this.div.classList.remove('breakpoint');
			}
		}
	}

	setHasBreakpoint(newVal) {
		if (typeof newVal !== 'boolean')
			throw new Error('newVal must be boolean but got ' + newVal);
		if (newVal !== this.hasBreakpoint) {
			this.hasBreakpoint = newVal;
			this.refreshDivClasses();
		}
	}

	setExecutionPoint(isExecutionPoint) {
		if (this.isExecutionPoint !== isExecutionPoint) {
			this.isExecutionPoint = isExecutionPoint;
			this.refreshDivClasses();
		}
	}
};