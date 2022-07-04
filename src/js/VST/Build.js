// noinspection JSClosureCompilerSyntax EventTarget is implemented in a non-standard way, but it works fine.
/**
 * The core code for managing the build tool.
 *
 * @implements {EventTarget}
 */
VST.Build = new function () {
    const self = this;
    // We can alias any class-like here, since this is loaded last.
    const Character = VST.VS.Character;
    const DOM = VST.DOM;
    const Page = VST.Page;
    const Util = VST.Util;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} Build All data describing a build.
     * @property {BuildIdList} arcanas             A list of the selected arcanas' IDs.
     * @property {number|null} character           The ID of the currently selected character.
     * @property {BuildIdList} passiveItems        A list of the selected passive items' IDs.
     * @property {BuildIdList} passiveItemsBackup  A list of the selected backup passive items' IDs, which will
     *                                             automatically replace passives based on what's on the stage.
     * @property {number|null} stage               The ID of the currently selected stage.
     * @property {boolean}     stageIncludedInHash Whether to include the stage in the hash.
     * @property {BuildIdList} weapons             A list of the selected weapons' IDs.
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
        character: null,
        passiveItems: [],
        passiveItemsBackup: [],
        stage: null,
        stageIncludedInHash: true,
        weapons: [],
    };

    /** @type {string} The event type when the build changes. */
    const EVENT_CHANGED_BUILD = 'changed-build';

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
            arcanasList: undefined,

            /** @type {HTMLDivElement} The element containing the arcanas selection area. */
            arcanasSection: undefined,

            /** @type {HTMLDivElement} The element containing the list of characters. */
            characterList: undefined,

            /** @type {HTMLDivElement} The element containing the character selection area. */
            characterSection: undefined,

            /** @type {HTMLDivElement} The element containing the list of passive items. */
            passiveItemsList: undefined,

            /** @type {HTMLDivElement} The element containing the passive items selection area. */
            passiveItemsSection: undefined,

            /** @type {HTMLDivElement} The element containing the currently selected arcanas. */
            selectedArcanas: undefined,

            /** @type {HTMLDivElement} The element containing the currently selected character. */
            selectedCharacter: undefined,

            /** @type {HTMLDivElement} The element containing the currently selected passive items. */
            selectedPassiveItems: undefined,

            /** @type {HTMLDivElement} The element containing the currently selected stage. */
            selectedStage: undefined,

            /** @type {HTMLDivElement} The element containing the currently selected weapons. */
            selectedWeapons: undefined,

            /** @type {HTMLDivElement} The element containing the list of stages. */
            stagesList: undefined,

            /** @type {HTMLDivElement} The element containing the stage selection area. */
            stageSection: undefined,

            /** @type {HTMLDivElement} The element containing the list of weapons. */
            weaponsList: undefined,

            /** @type {HTMLDivElement} The element containing the weapons selection area. */
            weaponsSection: undefined,
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

        if (!self.addEventListener) {
            let target = new EventTarget();
            self.addEventListener = target.addEventListener.bind(target);
            self.dispatchEvent = target.dispatchEvent.bind(target);
            self.removeEventListener = target.removeEventListener.bind(target);

            this.addEventListener(EVENT_CHANGED_BUILD, self.Hash.write, false);
        }

        // Initializing hash support will also do an initial read of the hash to load a build.
        self.Hash.init();
    };

    /**
     * Applies the given build to the tool.
     *
     * @param {Build} build
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
     * Dispatches an event indicating that the build has changed.
     */
    function dispatchChangedBuildEvent() {
        self.dispatchEvent(new CustomEvent(EVENT_CHANGED_BUILD));
    }

    /**
     * Displays the character selection options in the main container.
     */
    function renderCharacterSelection() {
        let section = renderSection('character', 'Character Selection');

        my.elements.characterList = DOM.ce('div', {className: 'vst-build-character-list'}, section);
        Character.getIds().forEach(characterId => {
            // noinspection JSValidateTypes Realistically, this can't actually return undefined.
            /** @type {CharacterData} */
            let character = Character.get(characterId);

            let box = Character.renderBox(
                character,
                Character.DISPLAY_MODE_DEFAULT,
                'a',
                my.elements.characterList,
            );
            box.href = 'javascript:';
            box.addEventListener('click', setCharacter.bind(null, characterId));

            Character.renderBox(
                character,
                Character.DISPLAY_MODE_TOOLTIP,
                'span',
                box,
            );
        });

        my.elements.selectedCharacter = DOM.ce('div', {className: 'vst-build-selected-character'}, section);
    }

    /**
     * Appends a new section wrapper to the main container and returns it.
     *
     * @param {string} section
     * @param {string} headingText
     * @return {HTMLDivElement}
     */
    function renderSection(section, headingText) {
        let wrapper = my.elements[`${section}Section`] = DOM.ce('section', {
            dataset: {
                section: section,
            },
        }, Page.getContainer());

        DOM.ce('h2', undefined, wrapper, DOM.ct(headingText));

        return wrapper;
    }

    /**
     * Set the given character's ID as the current character.
     *
     * @param {number|null} characterId
     * @param {boolean}     [fromBuild] Whether this is from a build, and therefore weapons should not be modified.
     */
    function setCharacter(characterId, fromBuild) {
        let character;
        if (characterId !== null) {
            character = Character.get(characterId);
            if (!character) {
                VST.error('Could not set requested character.', characterId);

                return;
            }
        }

        my.build.character = characterId;

        my.elements.characterSection.dataset.selected = JSON.stringify(!!characterId);

        // Update the selected character.
        my.elements.selectedCharacter.innerHTML = '';
        if (character) {
            Character.renderBox(
                character,
                Character.DISPLAY_MODE_DETAILS,
                'span',
                my.elements.selectedCharacter,
                'Change',
                () => setCharacter(null),
            );
        }

        // TODO: Uncomment this once weapons are supported.
        // if (!fromBuild) {
        //     character.weaponIds.forEach(weaponId => setWeapon(weaponId));
        // }

        let sections = Page.getContainer().querySelectorAll(':scope > section');
        if (characterId === null) {
            // Re-hide the other sections.
            sections.forEach(section => {
                if (section.dataset.section !== 'character') {
                    section.style.display = 'none';
                }
            });
        } else {
            // Reveal any hidden sections.
            sections.forEach(section => section.style.display = 'block');
        }

        dispatchChangedBuildEvent();
    }
};
