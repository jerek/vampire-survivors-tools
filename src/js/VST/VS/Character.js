/**
 * Functions related to Vampire Survivors characters.
 */
VST.VS.Character = new function () {
    const DOM = VST.DOM;
    const Img = VST.Img;
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
    /** @type {CharDisplayMode} A rectangular box with a blue BG. Contains only the full name and description. */
    this.DISPLAY_MODE_TOOLTIP = 'tooltip';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {number} The scaling size of the character and weapon images in the standard character boxes. */
    const IMAGE_SCALE_CHAR_BOX = 1.72;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the character with the given ID.
     *
     * @param {CharacterId} id
     * @return {CharacterData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_CHARACTER, id);

    /**
     * Returns a list of all character IDs.
     *
     * @return {CharacterId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_CHARACTER);

    /**
     * Appends a character display box to the given parent element.
     *
     * If both the buttonText and buttonAction optional params are supplied, a blue button will be added to the
     * bottom-right of the character box. The button may still not be visible, depending on the mode.
     *
     * @param {CharacterData}   char
     * @param {CharDisplayMode} mode          What style of display this character box should be.
     * @param {string}          tagName       The tag name to use for the element.
     * @param {Node}            appendTo
     * @param {string}          [buttonText]   The text to display on the optional button.
     * @param {function}        [buttonAction] The function to execute when clicking the optional button.
     * @return {HTMLAnchorElement}
     */
    this.renderBox = function (char, mode, tagName, appendTo, buttonText, buttonAction) {
        // By default, the styles are based only on this class and its extensions.
        let baseClass = 'vs-char-box';

        // The main box element.
        let box = DOM.ce(tagName, {
            className: baseClass,
            dataset: {
                character: char.id,
                hasDescription: !!char.description,
                mode: mode,
            },
        }, appendTo);

        // The BG, which is automatically sized to the box.
        DOM.ce('span', {className: `${baseClass}-bg`}, box);

        // The character's name. Some modes will only show the base name, without the prefix and surname.
        let nameClass = `${baseClass}-name`;
        let name = DOM.ce('span', {className: nameClass}, box);
        if (char.prefix) {
            DOM.ce('span', {className: `${nameClass}-prefix`}, name, DOM.ct(char.prefix + ' '))
        }
        name.append(DOM.ct(char.name));
        if (char.surname) {
            DOM.ce('span', {className: `${nameClass}-surname`}, name, DOM.ct(' ' + char.surname));
        }

        // The default image of the character.
        let sprite = char.spriteAlt || Img.CHARACTERS;
        let image = Img.createImage(sprite, char.spriteName, box, IMAGE_SCALE_CHAR_BOX);
        image.classList.add(`${baseClass}-image`);

        // The weapons the character can equip.
        let weapons = DOM.ce('span', {className: `${baseClass}-weapons`, dataset: {count: char.weaponIds.length}}, box);
        char.weaponIds.forEach(weaponId => {
            let weapon = VS.Weapon.get(weaponId);
            let weaponFrame = DOM.ce('span', {className: `${baseClass}-weapons-frame`}, weapons);
            Img.createImage(Img.ITEMS, weapon.frameName, weaponFrame, IMAGE_SCALE_CHAR_BOX);
        });

        // The description, which is only visible in some modes.
        if (char.description) {
            DOM.ce('span', {className: `${baseClass}-description`}, box, DOM.ct(char.description));
        }

        if (buttonText && buttonAction) {
            let button = DOM.createButton(buttonText, buttonAction, box, DOM.BUTTON_BLUE);
            button.classList.add('vs-char-box-button');
        }

        return box;
    };
};