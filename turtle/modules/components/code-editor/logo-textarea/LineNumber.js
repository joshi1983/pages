import { MessageTypes } from '../../MessageTypes.js';
import { ParseMessage } from '../../../parsing/loggers/ParseMessage.js';
import { ParseMessageViewer } from './ParseMessageViewer.js';

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
				//outer.hasBreakpoint = !outer.hasBreakpoint;
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
			if (!this.div.classList.contains(this.messageTypeClassName)) {
				this.div.className = '';
				this.div.classList.add('line-number');
				if (this.isExecutionPoint)
					this.div.classList.add('execution-point');
				const span = this.div.querySelector('span');
				if (span !== null)
					this.div.removeChild(span);
				if (this.messageTypeClassName !== undefined) {
					this.div.classList.add(this.messageTypeClassName);
					const newSpan = document.createElement('span');
					newSpan.classList.add('fa', MessageTypes.getIconClassName(this.mostUrgentMessageType));
					this.div.appendChild(newSpan);
					const outer = this;
					newSpan.addEventListener('click', function() {
						ParseMessageViewer.show(outer.messages, outer.index);
					});
				}
			}
			if (this.hasBreakpoint === true) {
				this.div.classList.add('breakpoint');
				this.div.setAttribute('title', `Line ${this.index} with a breakpoint`);
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