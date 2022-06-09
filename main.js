const CALCULATOR_RESULT = 'CALCULATOR_RESULT';
const CALCULATOR_HISTORY = 'CALCULATOR_HISTORY';

function Calculator() {
    if (!(this instanceof Calculator)) {
        return new Calculator();
    }

    this.history = '';
    this.result = '';
    this.$control = {};
    this.isCalcualated = false;
    this.memorize = {};

    return this;
}

Calculator.prototype._storeValue = function() {
    window.localStorage.setItem(CALCULATOR_RESULT, this.result);
    window.localStorage.setItem(CALCULATOR_HISTORY, this.history);
}

Calculator.prototype._displayValue = function() {
    this.$control.result.innerHTML = this.result;
    this.$control.history.innerHTML = this.history;
}

Calculator.prototype._calculation = function() {
    if (this.memorize[this.history]) {
        this.result = this.memorize[this.history];
    } else {
        console.log('eval');
        this.result = eval(this.history).toString();
        this.memorize[this.history] = this.result;
    }
}

Calculator.prototype._isInvalidResult = function() {
    return this.result.endsWith('.');
}

Calculator.prototype._isInValid = function() {
    return !this.history || this._isInvalidResult();
}

Calculator.prototype._resetHistory = function(isResetResult) {
    if (this.isCalcualated) {
        this.history = '';
        this.isCalcualated = false;

        if (isResetResult) {
            this.result = '';
        }
    }
}

Calculator.prototype._handleKeyboard = function(event) {
    const action = event.target.getAttribute('data-action');

    switch (action) {
        case 'C':
            this.history = '';
            this.result = '';
            this._resetHistory();
            break;
        case 'delete':
            this.result = this.result.slice(0 , -1);
            this._resetHistory();
            break;
        case '/':
        case '*':
        case '-':
        case '+':
        case '%':
            if (this.history) {
                if (this.result) {
                    this.history += ' ' + this.result;
                    this._calculation();
                    this.history = this.result + ' ' + action;
                    this.result = '';
                } else {
                    this.history = this.history.slice(0 , -1);
                    this.history += action;
                }
            }  else {
                if (this._isInvalidResult()) return;

                if (this.result) {
                    this.history = this.result + ' ' + action;
                    this.result = '';
                }
            }

            break;
        case '=':
            if (this._isInValid()) return;

            if (!this.isCalcualated) {
                this.history += ' ' + this.result;
            }
            this._calculation();
            this.isCalcualated = true;
            break;
        case '.':
            if (this.result.includes(action)) return;

            if (this.result) {
                this.result += action;
            } else {
                this.result = `0.`;
            }
            this._resetHistory();
            break;
        case '-1':
            if (!this.result) return;

            this.result = this.result * -1;
            this._resetHistory();
            break;
        default:
            this._resetHistory(true);
            this.result = this.result === '0' ? '' : this.result;
            this.result += action;
    }

    this._displayValue();
    this._storeValue();
}

Calculator.prototype._redrawLastestCalculaton = function() {
    this.result = window.localStorage.getItem(CALCULATOR_RESULT);
    this.history = window.localStorage.getItem(CALCULATOR_HISTORY);

    this._displayValue();
}

Calculator.prototype.init = function() {
    this.$control.history = document.getElementById('calculator__history');
    this.$control.result = document.getElementById('calculator__result');
    this.$control.keyboard = Array.from(document.querySelectorAll('.calculator__btn'));

    this.$control.keyboard.forEach(element => {
        element.addEventListener('click', this._handleKeyboard.bind(this))
    });

    this._redrawLastestCalculaton();
}

const app = Calculator();
app.init();