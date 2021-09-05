import { StringUtils } from '../../../StringUtils.js';

export class EasingFunction {
	equals(other) {
		if (other.constructor.name !== this.constructor.name)
			return false;
		return true;
	}

	toJavaScriptExpression() {
		return `new this.${this.constructor.name}()`;
	}

	toPrintedString() {
		return StringUtils.firstCharLower(this.constructor.name);
	}
};