/**
    * Creates custom events that can be emitted inside the components.
*/
export const Event = (options = {}) => {
    return (target, propertyName) => {
        const descriptor = {
            get() {
                const _this = this;
                return {
                    emit(value) {
                        const eventName = options && options.eventName ? options.eventName : propertyName;
                        const eventOptions = Object.assign({}, { detail: value, bubbles: true, cancelable: true }, options);
                        const event = new CustomEvent(eventName, eventOptions);
                        _this.dispatchEvent(event);
                    }
                };
            }
        };
        return Object.defineProperty(target, propertyName, descriptor);
    };
};
//# sourceMappingURL=event.js.map