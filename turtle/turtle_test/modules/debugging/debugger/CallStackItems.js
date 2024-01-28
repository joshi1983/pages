import { CallStackItem } from './CallStackItem.js';
import { LogoProgramExecuter } from '../../parsing/execution/LogoProgramExecuter.js';

export class CallStackItems {
	constructor(executer) {
		if (!(executer instanceof LogoProgramExecuter))
			throw new Error('executer must be an instance of LogoProgramExecuter');

		this.itemsMap = new Map();
		this.executer = executer;
		const outer = this;
		executer.addEventListener('program-changed', function() {
			outer.itemsMap.clear();
		});
	}

	getDivs() {
		return this.getStackItems().map(function(item) {
			return item.getDiv();
		});
	}

	getStackItems() {
		const outer = this;
		return this.executer.executionContext.procedureStack.map(function(proc, index) {
			if (!outer.itemsMap.has(proc))
				outer.itemsMap.set(proc, new CallStackItem(proc, index));
			return outer.itemsMap.get(proc);
		});
	}

	_removeUnusedItemDivs(container) {
		const currentProcedures = new Set(this.getStackItems());
		if (this.itemsMap.size === 0) {
			container.innerText = ''; // remove all children.
			/*
			This case likely fixes a bug. 
			I had lots of trouble reproducing a bug while relying 
			completely on the for-loop below but it existed where old 
			call stack items would remain in the document.
			The numbering would be like "1, 2, 3, 1, 2, 1, 2, 3..." after a while.
			*/
		}
		else {
			const usedDivs = new Set();
			for (const [key, value] of this.itemsMap) {
				if (currentProcedures.has(value)) {
					usedDivs.add(value.getDiv());
				}
				else {
					value.getDiv().remove();
					this.itemsMap.delete(key);
				}
			}
			const divs = container.querySelectorAll(':scope > div');
			divs.forEach(function(div) {
				if (!usedDivs.has(div)) {
					div.remove();
				}
			});
		}
	}

	refreshContainer(container) {
		const divs = this.getDivs();
		const noProcsDiv = document.getElementById('debugger-call-stack-container-no-procedures');
		if (divs.length === 0) {
			if (noProcsDiv)
				noProcsDiv.style.removeProperty('display');
			this._removeUnusedItemDivs(container);
		}
		else {
			if (noProcsDiv)
				noProcsDiv.style.display = 'none';
			this._removeUnusedItemDivs(container);
			divs.filter(d => d.parentNode !== container).forEach(function(div) {
				container.appendChild(div);
			});
		}
	}
};