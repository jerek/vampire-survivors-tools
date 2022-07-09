/**
 * Functions related to Vampire Survivors weapons and passive items.
 */
VST.VS.Item = new function () {
    const self = this;
    const Img = VST.VS.Img;
    const Util = VST.Util
    const VS = VST.VS;
    const Weapon = VST.VS.Weapon;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /** @typedef {string} ItemDisplayMode What style of display a rendered item should be. */

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {Object<PassiveId, WeaponId>} A generated map of passive IDs to weapons that they can evolve into. */
        passiveEvolutions: undefined,

        /** @type {Object<WeaponId, WeaponId>} A generated map of weapon IDs to weapons that they can evolve into. */
        weaponEvolutions: undefined,
    };

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

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Returns an ID map of passives to the weapons that they can evolve into.
     *
     * @return {Object<PassiveId, WeaponId>}
     */
    this.getPassiveEvolutionMap = () => my.passiveEvolutions;

    /**
     * Returns an ID map of weapons to the weapons that they can evolve into.
     *
     * @return {Object<WeaponId, WeaponId>}
     */
    this.getWeaponEvolutionMap = () => my.weaponEvolutions;

    /**
     * Returns elements created to display an item image.
     *
     * @param {VsType}                 type            The item's entity type.
     * @param {WeaponData|PassiveData} [item]
     * @param {ItemDisplayMode}        [mode]          What style of display this character box should be.
     * @param {number}                 [scale]         The 1-base scale at which images should be displayed. Default: 2
     * @param {string}                 [tagName="div"] The tag name to use for the element.
     * @param {function}               [callback]      A function executed after the image is loaded.
     * @return {HTMLSpanElement|HTMLElement}
     */
    this.render = function (type, item, mode, scale, tagName, callback) {
        if (!scale) {
            scale = IMAGE_SCALE;
        }

        let entity = VS.createEntityElements(type, item, tagName, mode || self.DISPLAY_MODE_DEFAULT);

        let size = BASE_ICON_SIZE * scale;
        let style = {
            height: `${size}px`,
            width: `${size}px`,
        };
        Util.copyProperties(entity.content.style, style);
        if (mode === self.DISPLAY_MODE_FRAME) {
            entity.content.style.padding = `${size * 0.25}px`;
        }

        if (item) {
            let setImagePos = image => {
                image.style.top = 'calc(50% - ' + parseInt(image.style.height) / 2 + 'px' + ')';
                image.style.left = 'calc(50% - ' + parseInt(image.style.width) / 2 + 'px' + ')';
                if (callback) {
                    callback();
                }
            };
            let image = Img.createImage(Img.ITEMS, item.frameName, scale, setImagePos);
            Util.copyProperties(image.style, style);
            setImagePos(image);
            entity.content.appendChild(image);

            entity.wrapper.appendChild(VS.createTooltip(item));
        }

        return entity.wrapper;
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Generates evolution data lookups.
     */
    function initEvolutionData() {
        my.weaponEvolutions = {};
        my.passiveEvolutions = {};
        Weapon.getIds().forEach(weaponId => {
            let weapon = Weapon.get(weaponId);
            (weapon.reqWeapons || []).forEach(requiredWeaponId => my.weaponEvolutions[requiredWeaponId] = weaponId);
            (weapon.reqPassives || []).forEach(requiredPassiveId => my.passiveEvolutions[requiredPassiveId] = weaponId);
        });
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    VST.registerInitCallback(initEvolutionData);
};
