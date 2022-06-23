/**
 * Helper functions for dealing with the DOM.
 */
VSBT.DOM = new function () {
    /**
     * Returns an element created with the given options.
     *
     * @param {string} tag          The HTML tag name.
     * @param {object} [properties] Properties to assign to the element. Can be multi-level, such as for style props.
     * @param {Node}   [appendTo]   The parent to append the created element to.
     * @param {Node}   [childNode]  A node to append to the created element.
     */
    this.ce = (tag, properties, appendTo, childNode) => {
        let element = document.createElement(tag);

        if (properties) {
            VSBT.Util.copyProperties(element, properties);
        }

        if (childNode) {
            element.appendChild(childNode);
        }

        if (appendTo) {
            appendTo.appendChild(element);
        }

        return element;
    };

    /**
     * Returns a text node containing the given text.
     *
     * @param {string} text
     * @return {Text}
     */
    this.ct = text => document.createTextNode(text);
};
