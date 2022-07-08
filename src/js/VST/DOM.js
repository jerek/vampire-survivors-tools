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

    /** @typedef {string} ButtonStyle A set of adjustments to make to a button's style. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // Button colors. The in-game assets only have hover/active effects for blue and green buttons.
    /** @type {ButtonColor} */ this.BUTTON_COLOR_BLUE  = 'blue';
    /** @type {ButtonColor} */ this.BUTTON_COLOR_GREEN = 'green';
    /** @type {ButtonColor} */ this.BUTTON_COLOR_RED   = 'red';

    // Button styles. The small style includes using default casing.
    /** @type {ButtonStyle} */ this.BUTTON_STYLE_SMALL        = 'small';
    /** @type {ButtonStyle} */ this.BUTTON_STYLE_DEFAULT_CASE = 'default-case';

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
     * @param {function}    [callback]
     * @param {Node}        [appendTo] The parent to append the created element to.
     * @param {ButtonColor} [color]    Defaults to blue.
     * @param {ButtonStyle} [style]
     * @return {HTMLAnchorElement}
     */
    this.createButton = function (text, callback, appendTo, color, style) {
        let button = self.ce('a', {
            className: 'vs-button',
            dataset: {
                color: color || this.BUTTON_COLOR_BLUE,
            },
            href: 'javascript:',
        }, appendTo, self.ct(text));

        if (callback) {
            button.addEventListener('click', callback);
        }

        if (style) {
            button.dataset.style = style;
        }

        return button;
    };

    /**
     * Create a tooltip with the given content, and optionally append it to a parent.
     *
     * @param {string|Node} content
     * @return {HTMLDivElement|DocumentFragment}
     */
    this.createTooltip = function (content) {
        // If there's no tooltip content, return a document fragment that will "melt away" when appended.
        if (!content) {
            return document.createDocumentFragment();
        }

        if (!content.nodeType) {
            content = self.ct(content);
        }

        return self.ce('div', {className: 'vst-tooltip'}, undefined, content);
    };

    /**
     * Returns a text node containing the given text.
     *
     * @param {string} text
     * @return {Text}
     */
    this.ct = text => document.createTextNode(text);
};
