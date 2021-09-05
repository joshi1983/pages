export class Status {
	constructor(incompleteTitle, completeTitle) {
		this.e = document.createElement('div');
		this.e.classList.add('status-item');
		this.iconElement = document.createElement('span');
		this.iconElement.setAttribute('class', 'fa fa-solid fa-hourglass');
		this.textSpan = document.createElement('span');
		this.textSpan.classList.add('text');
		this.e.appendChild(this.iconElement);
		this.e.appendChild(this.textSpan);
		this.textSpan.innerText = incompleteTitle;
		this.completeTitle = completeTitle;
		this._completeListeners = [];
		this._isCompleted = false;
		this._isCompleteDispatched = false;
	}

	addCompleteListener(callback) {
		if (typeof callback !== 'function')
			throw new Error(`callback must be a function but found ${callback}`);

		this._completeListeners.push(callback);
	}

	completed() {
		this._isCompleted = true;
		this.iconElement.setAttribute('class', 'fa fa-solid fa-check');
		this.textSpan.innerText = this.completeTitle;
		if (this._isCompleteDispatched !== true) {
			for (const completeListener of this._completeListeners)
				completeListener();

			this._isCompleteDispatched = true;
		}
		this.updated();
	}

	setTitle(title) {
		this.textSpan.innerText = title;
	}

	updated() {
		this.e.classList.toggle('complete', this._isCompleted);
	}
};