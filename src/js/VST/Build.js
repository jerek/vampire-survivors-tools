/**
 * The core code for managing the build tool.
 */
VST.Build = new function () {
    // We can alias any class-like here, since this is loaded last.
    const Data = VST.Data;
    const DOM = VST.DOM;
    const Hash = VST.Hash;
    const Img = VST.Img;
    const Page = VST.Page;
    const Util = VST.Util;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} Build All data describing a build.
     * @property {BuildIdList}      arcanas             A list of the selected arcanas' IDs.
     * @property {number|undefined} character           The ID of the currently selected character.
     * @property {BuildIdList}      passiveItems        A list of the selected passive items' IDs.
     * @property {BuildIdList}      passiveItemsBackup  A list of the selected backup passive items' IDs, which will
     *                                                  automatically replace passives based on what's on the stage.
     * @property {number|undefined} stage               The ID of the currently selected stage.
     * @property {boolean}          stageIncludedInHash Whether to include the stage in the hash.
     * @property {BuildIdList}      weapons             A list of the selected weapons' IDs.
     */

    /** @typedef {number[]} BuildIdList A sparse ID list. Indexes go to the entity's max - 1, and there can be gaps. */

    /** @typedef {string} CharDisplayMode What style of display a character box should be. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {number} The maximum number of arcanas that a build can contain. */
    this.ARCANAS_MAX = 3;

    /** @type {number} The maximum number of standard passive items that a build can contain. */
    this.PASSIVE_ITEMS_MAX = 6;

    /** @type {number} The maximum number of weapons that a build can contain. */
    this.WEAPONS_MAX = 6;

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {CharDisplayMode} The default. A square box with their short name, image, and starting weapons. */
    const CHAR_DISPLAY_MODE_DEFAULT = 'default';
    /** @type {CharDisplayMode} Like default, but wider. With full name, description, weapon frames, optional button. */
    const CHAR_DISPLAY_MODE_DETAILS = 'details';
    /** @type {CharDisplayMode} A rectangular box with a blue BG. Contains only the full name and description. */
    const CHAR_DISPLAY_MODE_TOOLTIP = 'tooltip';

    /** @type {string} The base HTML class for the character selection area. */
    const CHAR_SELECTION_CLASS = 'vst-build-chars-char';

    /** @type {Build} The default build state when initially loading or resetting the tool. */
    const EMPTY_BUILD = {
        arcanas: [],
        character: undefined,
        passiveItems: [],
        passiveItemsBackup: [],
        stage: undefined,
        stageIncludedInHash: true,
        weapons: [],
    };

    /** @type {number} The scaling size of the character and weapon images in the standard character boxes. */
    const IMAGE_SCALE_CHAR_BOX = 1.72;

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {Build} The currently loaded character build. */
        build: Util.copyProperties({}, EMPTY_BUILD),

        /** @type {Object} References to various DOM elements. */
        elements: {
            /** @type {HTMLDivElement} The element containing the list of arcanas. */
            arcanas: undefined,

            /** @type {HTMLDivElement} The element containing the list of characters. */
            characters: undefined,

            /** @type {HTMLDivElement} The element containing the character selection area. */
            charactersWrapper: undefined,

            /** @type {HTMLDivElement} The element containing the list of passive items. */
            passiveItems: undefined,

            /** @type {HTMLDivElement} The element containing the list of stages. */
            stages: undefined,

            /** @type {HTMLDivElement} The element containing the list of weapons. */
            weapons: undefined,
        },
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Returns the current build.
     *
     * @return {Build}
     */
    this.getBuild = () => {
        return Util.copyProperties({}, my.build);
    };

    /**
     * Sets up the main tool.
     */
    this.init = () => {
        renderCharacterSelection();

        // Initializing hash support will also do an initial read of the hash to load a build.
        Hash.init();
    };

    /**
     * Applies the given build to the tool.
     *
     * @param {Build}  build
     */
    this.set = function (build) {
        VST.debug('Setting build:', build);
        build = Util.copyProperties({}, build);
        my.build = build;

        setCharacter(build.character, true);
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Displays the character selection options in the main container.
     */
    function renderCharacterSelection() {
        let container = Page.getContainer();

        my.elements.charactersWrapper = DOM.ce('section', {dataset: {section: 'characters'}}, container);

        DOM.ce('h2', undefined, my.elements.charactersWrapper, DOM.ct('Character Selection'));

        my.elements.characters = DOM.ce('div', {className: 'vst-build-chars'}, my.elements.charactersWrapper);
        Data.getCharacterIds().forEach(charId => {
            // noinspection JSValidateTypes Realistically, this can't actually return undefined.
            /** @type {CharacterData} */
            let character = Data.getCharacter(charId);

            let frame = renderCharacterBox(
                character,
                CHAR_DISPLAY_MODE_DEFAULT,
                'a',
                CHAR_SELECTION_CLASS,
                my.elements.characters,
            );
            frame.href = 'javascript:';
            frame.addEventListener('click', setCharacter.bind(null, charId));

            renderCharacterBox(
                character,
                CHAR_DISPLAY_MODE_TOOLTIP,
                'span',
                `${CHAR_SELECTION_CLASS}-tooltip`,
                frame,
            );
        });
    }

    /**
     * Appends a character display box to the given parent element.
     *
     * @param {CharacterData}   char
     * @param {CharDisplayMode} mode          What style of display this character box should be.
     * @param {string}          tagName       The tag name to use for the element.
     * @param {string}          usageClass    An HTML class to identify this usage of the character box styles.
     * @param {Node}            appendTo
     * @return {HTMLAnchorElement}
     */
    function renderCharacterBox(char, mode, tagName, usageClass, appendTo) {
        // By default, the styles are based only on this class and its extensions.
        let baseClass = 'vs-char-box';

        // The main box element.
        let box = DOM.ce(tagName, {
            className: `${baseClass} ${usageClass}`,
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
            let weapon = Data.getWeapon(weaponId);
            let weaponFrame = DOM.ce('span', {className: `${baseClass}-weapons-frame`}, weapons);
            Img.createImage(Img.ITEMS, weapon.frameName, weaponFrame, IMAGE_SCALE_CHAR_BOX);
        });

        // The description, which is only visible in some modes.
        if (char.description) {
            DOM.ce('span', {className: `${baseClass}-description`}, box, DOM.ct(char.description));
        }

        return box;
    }

    /**
     * Set the given character's ID as the current character.
     *
     * @param {number}  characterId
     * @param {boolean} [fromBuild] Whether this is being set due to loading a build, and therefore don't set weapons.
     */
    function setCharacter(characterId, fromBuild) {
        let char = Data.getCharacter(characterId);
        if (!char) {
            VST.error('Could not set requested character.', characterId);

            return;
        }

        my.build.character = characterId;

        my.elements.charactersWrapper.dataset.selected = 'true';

        // Update the selected character.
        my.elements.characters.querySelectorAll(':scope > .vs-char-box[data-selected="true"]')
            .forEach(char => delete char.dataset.selected);
        my.elements.characters.querySelector(':scope > .vs-char-box[data-character="' + characterId + '"]')
            .dataset.selected = 'true';

        // TODO: Uncomment this once weapons are supported.
        // if (!fromBuild) {
        //     char.weaponIds.forEach(weaponId => setWeapon(weaponId));
        // }

        Hash.write();
    }
};
