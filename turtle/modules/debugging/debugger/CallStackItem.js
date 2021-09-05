import { Command } from '../../parsing/Command.js';
import { ExecutingProcedure } from '../../parsing/execution/ExecutingProcedure.js';
import { Variables } from './Variables.js';

export class CallStackItem {
	constructor(executingProcedure, index) {
		if (!(executingProcedure instanceof ExecutingProcedure))
			throw new Error('executingProcedure must be an instance of ExecutingProcedure');
		if (!Number.isInteger(index))
			throw new Error('index must be an integer. Not: ' + index);

		this.executingProcedure = executingProcedure;
		this.variables = new Variables(executingProcedure.localVariables);
		this.index = index;
	}

	_refreshVariables() {
		if (this.variablesContainer !== undefined) {
			const outer = this;
			this.variables.getDivs().filter(d => d.parentNode !== outer.variablesContainer).forEach(function(div) {
				outer.variablesContainer.appendChild(div);
			});
		}
	}

	toggleCollapse() {
		this.div.classList.toggle('collapsed');
		this.carot.classList.toggle('fa-angle-right');
		this.carot.classList.toggle('fa-angle-down');
		if (this.carot.classList.contains('collapsed')) {
			
		}
		else {
			this._refreshVariables();
		}
	}

	getDiv() {
		if (this.div === undefined) {
			const div = document.createElement('div');
			div.classList.add('collapsed');
			if (Command.getCommandInfo(this.executingProcedure.procedure.name) !== undefined)
				div.classList.add('internal-proc');

			this.carot = document.createElement('span');
			this.carot.classList.add('fa', 'fa-angle-right');
			const indexElement = document.createElement('span');
			indexElement.classList.add('index');
			indexElement.innerText = '' + (this.index + 1);
			const nameElement = document.createElement('h5');
			nameElement.classList.add('name', 'clickable');
			const outer = this;
			nameElement.addEventListener('click', function() {
				outer.toggleCollapse();
			});
			nameElement.appendChild(indexElement);
			nameElement.appendChild(this.carot);
			const nameSpan = document.createElement('span');
			nameSpan.innerText = this.executingProcedure.procedure.name;
			nameElement.appendChild(nameSpan);
			div.appendChild(nameElement);
			this.variablesContainer = document.createElement('div');
			this.variablesContainer.classList.add('variables');
			div.appendChild(this.variablesContainer);
			this.div = div;
		}
		// no need to refresh variables if collapsed
		if (!this.carot.classList.contains('collapsed'))
			this._refreshVariables();
		return this.div;
	}
};