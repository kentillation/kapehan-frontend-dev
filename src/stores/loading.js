import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: false,
        message: '',
        _minDisplayTime: 300,
        _showTime: null,
        _timeoutId: null
    }),
    actions: {
        show(message = '') {
            if (this._timeoutId) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }

            this.isLoading = true;
            this.message = message;
            this._showTime = Date.now();

            this._timeoutId = setTimeout(() => {
                this._timeoutId = null;
            }, this._minDisplayTime);
        },
        hide() {
            const elapsed = Date.now() - this._showTime;
            const remainingTime = this._minDisplayTime - elapsed;

            if (remainingTime > 0 && this._timeoutId) {
                clearTimeout(this._timeoutId);
                this._timeoutId = setTimeout(() => {
                    this._actuallyHide();
                }, remainingTime);
            } else {
                this._actuallyHide();
            }
        },
        _actuallyHide() {
            this.isLoading = false;
            this.message = '';
            this._showTime = null;
            this._timeoutId = null;
        }
    }
});