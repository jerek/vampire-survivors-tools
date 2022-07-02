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
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Appends a character display box to the given parent element.
     *
     * @param {CharacterData} char
     * @param {boolean}       extraDetails  Whether to print the character's full name and description.
     * @param {string}        tagName       The tag name to use for the element.
     * @param {string}        usageClass    An HTML class to identify this usage of the character box styles.
     * @param {Node}          appendTo
     * @return {HTMLAnchorElement}
     */
    function renderCharacterBox(char, extraDetails, tagName, usageClass, appendTo) {
        // By default, the styles are based only on this class and its extensions.
        let baseClass = 'vs-char-box';

        /** @type {string[]} The classes to apply to the main element. The base class has the core styles. */
        let boxClasses = [baseClass];
        if (extraDetails) {
            boxClasses.push(`${baseClass}-extra-details`);
        }
        boxClasses.push(usageClass);

        // The main box element.
        let box = DOM.ce(tagName, {
            className: boxClasses.join(' '),
            dataset: {character: char.id},
        }, appendTo);

        // The BG, which is automatically sized to the box.
        DOM.ce('span', {className: `${baseClass}-bg`}, box);

        // The character's shorthand or full name.
        let name = extraDetails ? [char.prefix, char.name, char.surname] : [char.name];
        name.filter(Boolean);
        name = name.join(' ');
        DOM.ce('span', {className: `${baseClass}-name`}, box, DOM.ct(name));

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

        // If we're including extra details, add the description.
        if (extraDetails) {
            DOM.ce('span', {className: `${baseClass}-description`}, box, DOM.ct(char.description));
        }

        return box;
    }
};
