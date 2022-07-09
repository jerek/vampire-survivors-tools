/**
 * Functions related to Vampire Survivors characters.
 */
VST.VS.Character = new function () {
    const self = this;
    const DOM = VST.DOM;
    const Img = VST.VS.Img;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /** @typedef {string} CharDisplayMode What style of display a character box should be. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {CharDisplayMode} The default. A square box with their short name, image, and starting weapons. */
    this.DISPLAY_MODE_DEFAULT = 'default';
    /** @type {CharDisplayMode} Like default, but wider. With full name, description, weapon frames, optional button. */
    this.DISPLAY_MODE_DETAILS = 'details';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {number} The scaling size of the character and weapon images in the standard character boxes. */
    const IMAGE_SCALE_CHAR_BOX = 1.72;

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_CHARACTER;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the character with the given ID.
     *
     * @param {CharacterId} id
     * @return {CharacterData|undefined}
     */
    this.get = id => VS.getData(TYPE, id);

    /**
     * Returns a list of all character IDs.
     *
     * @return {CharacterId[]}
     */
    this.getIds = () => VS.getIds(TYPE);

    /**
     * Returns elements created to display a character box.
     *
     * If both the buttonText and buttonAction optional params are supplied, a blue button will be added to the
     * bottom-right of the character box. The button may still not be visible, depending on the mode.
     *
     * @param {CharacterData}   char
     * @param {CharDisplayMode} mode            What style of display this character box should be.
     * @param {string}          [tagName="div"] The tag name to use for the element.
     * @param {string}          [buttonText]    The text to display on the optional button.
     * @param {function}        [buttonAction]  The function to execute when clicking the optional button.
     * @return {HTMLDivElement|HTMLAnchorElement}
     */
    this.renderBox = function (char, mode, tagName, buttonText, buttonAction) {
        let baseClass = 'vs-char-box';

        let entity = VS.createEntityElements(TYPE, char, tagName, mode || self.DISPLAY_MODE_DEFAULT);
        entity.content.classList.add(baseClass);

        // The BG, which is automatically sized to the box.
        DOM.ce('div', {className: `${baseClass}-bg`}, entity.content);

        // The character's name. Some modes will only show the base name, without the prefix and surname.
        let nameClass = `${baseClass}-name`;
        let name = DOM.ce('div', {className: nameClass}, entity.content);
        if (char.prefix) {
            DOM.ce('span', {className: `${nameClass}-prefix`}, name, DOM.ct(char.prefix + ' '));
        }
        name.append(DOM.ct(char.name));
        if (char.surname) {
            DOM.ce('span', {className: `${nameClass}-surname`}, name, DOM.ct(' ' + char.surname));
        }

        // The default image of the character.
        let sprite = char.spriteAlt || Img.CHARACTERS;
        let image = Img.createImage(sprite, char.spriteName, IMAGE_SCALE_CHAR_BOX);
        image.classList.add(`${baseClass}-image`);
        entity.content.appendChild(image);

        // The weapons the character can equip.
        let weapons = DOM.ce('div', {
            className: `${baseClass}-weapons`,
            dataset: {
                count: (char.weaponIds || []).length,
            },
        }, entity.content);
        let itemDisplayMode = mode === self.DISPLAY_MODE_DEFAULT ?
            VS.Item.DISPLAY_MODE_DEFAULT :
            VS.Item.DISPLAY_MODE_FRAME;
        (char.weaponIds || []).forEach(weaponId => {
            // noinspection JSCheckFunctionSignatures Realistically, this can't actually return undefined.
            weapons.appendChild(
                VS.Item.render(VS.TYPE_WEAPON, VS.Weapon.get(weaponId), itemDisplayMode, IMAGE_SCALE_CHAR_BOX),
            );
        });

        // The description, which is only visible in some modes.
        if (char.description) {
            DOM.ce('div', {className: `${baseClass}-description`}, entity.content, DOM.ct(char.description));
        }

        if (buttonText && buttonAction) {
            let button = DOM.createButton(
                buttonText,
                buttonAction,
                DOM.BUTTON_COLOR_BLUE,
                DOM.BUTTON_STYLE_DEFAULT_CASE,
            );
            button.classList.add('vs-char-box-button');
            entity.content.appendChild(button);
        }

        if (mode === self.DISPLAY_MODE_DEFAULT) {
            entity.wrapper.appendChild(VS.createTooltip(char));
        }

        return entity.wrapper;
    };
};
