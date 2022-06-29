/**
 * Helper functions for dealing with the DOM.
 */
VST.DOM = new function () {
    const self = this;
    const Util = VST.Util;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /** @typedef {string} ButtonColor One of the Vampire Survivors button colors. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    /** @type {ButtonColor} */ this.BUTTON_BLUE = 'blue';
    /** @type {ButtonColor} */ this.BUTTON_GREEN = 'green';
    /** @type {ButtonColor} */ this.BUTTON_RED = 'red';

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

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
            Util.copyProperties(element, properties);
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
     * Returns a Vampire Survivors button created with the given options.
     *
     * @param {string}      text
     * @param {function}    callback
     * @param {Node}        [appendTo] The parent to append the created element to.
     * @param {ButtonColor} [color]    Defaults to blue.
     * @return {HTMLAnchorElement}
     */
    this.createButton = function (text, callback, appendTo, color) {
        let button = self.ce('a', {
            className: 'vs-button',
            dataset: {
                color: color || this.BUTTON_BLUE,
            },
            href: 'javascript:',
        }, appendTo, self.ct(text));
        button.addEventListener('click', callback);

        return button;
    };

    /**
     * Returns a text node containing the given text.
     *
     * @param {string} text
     * @return {Text}
     */
    this.ct = text => document.createTextNode(text);
};
