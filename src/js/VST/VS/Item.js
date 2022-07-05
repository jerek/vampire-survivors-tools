/**
 * Functions related to Vampire Survivors weapons and passive items.
 */
VST.VS.Item = new function () {
    const self = this;
    const DOM = VST.DOM;
    const Img = VST.VS.Img;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /** @typedef {string} ItemDisplayMode What style of display a character box should be. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {ItemDisplayMode} The default. Just the item icon. */
    this.DISPLAY_MODE_DEFAULT = 'default';
    /** @type {ItemDisplayMode} Has a frame around the item icon. */
    this.DISPLAY_MODE_FRAME = 'frame';
    /** @type {ItemDisplayMode} Has semi-transparent frame behind the icon. */
    this.DISPLAY_MODE_EQUIPPED = 'equipped';

    /** @type {number} The scale used when displaying selected items. */
    this.SELECTED_SCALE = 2.66666;

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {number} The pixel size of an item icon at a scale of 1. */
    const BASE_ICON_SIZE = 16;

    /** @type {number} The standard scaling size of item images. */
    const IMAGE_SCALE = 2;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Appends an item image to the given parent element.
     *
     * @param {WeaponData|PassiveData} item
     * @param {Node}                   appendTo
     * @param {ItemDisplayMode}        [mode]           What style of display this character box should be.
     * @param {number}                 [scale]          The 1-base scale at which images should be displayed. Default: 2
     * @param {string}                 [tagName="span"] The tag name to use for the element.
     * @return {HTMLSpanElement|HTMLElement}
     */
    this.render = function (item, appendTo, mode, scale, tagName) {
        // By default, the styles are based only on this class and its extensions.
        let baseClass = 'vs-item';

        if (!scale) {
            scale = IMAGE_SCALE;
        }

        let size = BASE_ICON_SIZE * scale;
        let style = {
            height: `${size}px`,
            width: `${size}px`,
        };
        if (mode === self.DISPLAY_MODE_FRAME) {
            style.padding = `${size * 0.25}px`;
        }

        let wrapper = DOM.ce(tagName || 'span', {
            className: baseClass,
            dataset: {
                mode: mode || self.DISPLAY_MODE_DEFAULT,
            },
            style: style,
        }, appendTo);

        let image = Img.createImage(Img.ITEMS, item.frameName, wrapper, scale);
        image.classList.add(`${baseClass}-image`);
        image.style.height = style.height;
        image.style.width = style.width;

        return wrapper;
    };
};
