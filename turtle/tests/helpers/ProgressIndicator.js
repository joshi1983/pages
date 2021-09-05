import { isNumber } from '../../modules/isNumber.js';

export class ProgressIndicator {
	constructor(name) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but got ${name}`);
		this.name = name;
		this.ratio = 0;
		this.isVisible = false;
	}

	completed() {
		if (this.isCompleted === true)
			return; // ignore request to mark completed task since it was already completed.
		this.isCompleted = true;
		this.div.classList.add('completed');
		const outer = this;
		setTimeout(function() {
			outer.div.remove();
			outer.div = undefined;
			outer.progress = undefined;
			outer.container = undefined;
			outer.messageElement = undefined;
		}, 5000);
	}

	setMessage(s) {
		if (this.messageElement !== undefined)
			this.messageElement.innerText = s;
	}

	setProgressRatio(ratio) {
		if (!isNumber(ratio))
			throw new Error(`ratio must be a number but got ${ratio}`);
		this.ratio = ratio;
		if (this.container !== undefined) {
			if (this.progress === undefined) {
				this.div = document.createElement('div');
				this.div.classList.add('progress-viewer');
				const topRow = document.createElement('div');
				topRow.classList.add('top-row');
				const span = document.createElement('span');
				span.appendChild(document.createTextNode(`${this.name}`));
				span.classList.add('progress-indicator-name');
				topRow.appendChild(span);
				const progressContainer = document.createElement('div');
				progressContainer.classList.add('progress-container');
				this.progressSpan = document.createElement('span');
				this.progress = document.createElement('progress');
				this.progress.setAttribute('max', 100);
				progressContainer.appendChild(this.progressSpan);
				progressContainer.appendChild(this.progress);
				topRow.appendChild(progressContainer);
				this.div.appendChild(topRow);
				this.messageElement = document.createElement('div');
				this.messageElement.classList.add('message-element');
				this.div.appendChild(this.messageElement);
				this.container.append(this.div);
			}
			this.progress.value = 100 * ratio;
			this.progressSpan.innerText = `${(ratio * 100).toFixed(2)}%`;
		}
	}

	show(container) {
		if (this.container !== undefined)
			throw new Error(`ProgressIndicator should not be shown more than once. container is already set.`);
		this.container = container;
		this.setProgressRatio(this.ratio);
	}
};