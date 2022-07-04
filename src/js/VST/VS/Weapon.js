/**
 * Functions related to Vampire Survivors weapons.
 */
VST.VS.Weapon = new function () {
    const self = this;
    const DOM = VST.DOM;
    const Img = VST.VS.Img;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /** @typedef {string} WeaponDisplayMode What style of display a character box should be. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {WeaponDisplayMode} The default. Just the weapon icon. */
    this.DISPLAY_MODE_DEFAULT = 'default';
    /** @type {WeaponDisplayMode} Has a frame around the weapon icon. */
    this.DISPLAY_MODE_FRAME   = 'frame';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {number} The standard scaling size of weapon images. */
    const IMAGE_SCALE = 2;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the weapon with the given ID.
     *
     * @param {WeaponId} id
     * @return {WeaponData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_WEAPON, id);

    /**
     * Returns a list of all weapon IDs.
     *
     * @return {WeaponId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_WEAPON);

    /**
     * Appends a weapon image to the given parent element.
     *
     * @param {WeaponData}        weapon
     * @param {Node}              appendTo
     * @param {WeaponDisplayMode} [mode]           What style of display this character box should be.
     * @param {number}            [scale]          The 1-base scale at which images should be displayed. Defaults to 2.
     * @param {string}            [tagName="span"] The tag name to use for the element.
     * @return {HTMLSpanElement|HTMLElement}
     */
    this.render = function (weapon, appendTo, mode, scale, tagName) {
        // By default, the styles are based only on this class and its extensions.
        let baseClass = 'vs-weapon';

        let wrapper = DOM.ce(tagName || 'span', {
            className: baseClass,
            dataset: {
                mode: mode || self.DISPLAY_MODE_DEFAULT,
            },
        }, appendTo);

        let image = Img.createImage(Img.ITEMS, weapon.frameName, wrapper, scale || IMAGE_SCALE);
        image.classList.add(`${baseClass}-image`);

        return wrapper;
    };
};
