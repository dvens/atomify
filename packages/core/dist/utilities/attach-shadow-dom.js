export const attachShadowDom = (target) => {
    if (!target.shadowRoot && target.__canAttachShadowDom) {
        target.attachShadow({ mode: 'open' });
    }
};
//# sourceMappingURL=attach-shadow-dom.js.map