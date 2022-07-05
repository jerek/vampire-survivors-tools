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
     * @property {number}      character           The ID of the currently selected character.
     * @property {BuildIdList} passiveItems        A list of the selected passive items' IDs.
     * @property {BuildIdList} passiveItemsBackup  A list of the selected backup passive items' IDs, which will
     *                                             automatically replace passives based on what's on the stage.
     * @property {number}      stage               The ID of the currently selected stage.
     * @property {boolean}     stageIncludedInHash Whether to include the stage in the hash.
     * @property {BuildIdList} weapons             A list of the selected weapons' IDs.
     */

    /** @typedef {number[]} BuildIdList A sparse ID list. Indexes go to the entity's max - 1, and there can be gaps. */

    /** @typedef {string} BuildSectionId An area of the build tool where a certain type of entity is managed. */

    /**
     * @typedef {Object} BuildSectionConfig
     * @property {HTMLDivElement} container   The element containing the section.
     * @property {HTMLDivElement} list        The element containing the list of entities.
     * @property {string}         listHeading The text shown above the list.
     * @property {HTMLDivElement} selected    The element containing the currently selected entities.
     * @property {number}         [max]       The max number of entities that can be selected in this section.
     */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {number} The maximum number of arcanas that a build can contain. */
    this.ARCANAS_MAX = 3;

    /** @type {number} Several parts of builds always expect numbers, so this is used as a null value, and is kept in a
     *  constant so that their uses can be easily found and tracked. */
    this.EMPTY_ID = 0;

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
        character: this.EMPTY_ID,
        passiveItems: [],
        passiveItemsBackup: [],
        stage: this.EMPTY_ID,
        stageIncludedInHash: true,
        weapons: [],
    };

    /** @type {string} The event type when the build changes. */
    const EVENT_CHANGED_BUILD = 'changed-build';

    /** @type {BuildSectionId} */ const SECTION_ARCANAS = 'arcanas';
    /** @type {BuildSectionId} */ const SECTION_CHARACTER = 'character';
    /** @type {BuildSectionId} */ const SECTION_PASSIVES = 'passives';
    /** @type {BuildSectionId} */ const SECTION_PASSIVES_BACKUP = 'passives-backup';
    /** @type {BuildSectionId} */ const SECTION_STAGE = 'stage';
    /** @type {BuildSectionId} */ const SECTION_WEAPONS = 'weapons';

    /** @type {Object<BuildSectionId, BuildSectionConfig>} A map of section strings to their config and elements. */
    const SECTIONS = {
        [SECTION_ARCANAS]: {
            container: undefined,
            list: undefined,
            listHeading: 'Arcanas',
            max: self.ARCANAS_MAX,
            selected: undefined,
        },
        [SECTION_CHARACTER]: {
            container: undefined,
            list: undefined,
            listHeading: 'Character Selection',
            selected: undefined,
        },
        [SECTION_PASSIVES]: {
            container: undefined,
            list: undefined,
            listHeading: 'Passive Items',
            max: self.PASSIVE_ITEMS_MAX,
            selected: undefined,
        },
        [SECTION_PASSIVES_BACKUP]: {
            container: undefined,
            list: undefined,
            listHeading: 'Backup Passive Items',
            selected: undefined,
        },
        [SECTION_STAGE]: {
            container: undefined,
            list: undefined,
            listHeading: 'Stage',
            selected: undefined,
        },
        [SECTION_WEAPONS]: {
            container: undefined,
            list: undefined,
            listHeading: 'Weapons',
            max: self.WEAPONS_MAX,
            selected: undefined,
        },
    };

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {Build} The currently loaded character build. */
        build: Util.copyProperties({}, EMPTY_BUILD),

        /** @type {Object} References to various DOM elements. */
        elements: {
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
     * Displays the character section in the main container.
     */
    function renderCharacterSection() {
        let section = SECTIONS[SECTION_CHARACTER];
        renderSectionContainer(SECTION_CHARACTER);

        section.list     = DOM.ce('div', {className: 'vst-build-character-list'    }, section.container);
        section.selected = DOM.ce('div', {className: 'vst-build-selected-character'}, section.container);

        Character.getIds().forEach(characterId => {
            // noinspection JSValidateTypes Realistically, this can't actually return undefined.
            /** @type {CharacterData} */
            let character = Character.get(characterId);

            let box = Character.renderBox(
                character,
                Character.DISPLAY_MODE_DEFAULT,
                'a',
                section.list,
            );
            box.href = 'javascript:';
            box.addEventListener('click', setCharacter.bind(self.EMPTY_ID, characterId));

            Character.renderBox(
                character,
                Character.DISPLAY_MODE_TOOLTIP,
                'span',
                box,
            );
        });
    }

    /**
     * Appends a new section wrapper to the main container and returns it.
     *
     * @param {BuildSectionId} sectionId
     */
    function renderSectionContainer(sectionId) {
        let section = SECTIONS[sectionId];

        section.container = DOM.ce('section', {
            dataset: {
                section: sectionId,
            },
        }, Page.getContainer());

        DOM.ce('h2', undefined, section.container, DOM.ct(section.listHeading));
    }

    /**
     * Set the given character's ID as the current character.
     *
     * @param {number}  characterId
     * @param {boolean} [fromBuild] Whether this is from a build, and therefore weapons should not be modified.
     */
    function setCharacter(characterId, fromBuild) {
        let section = SECTIONS[SECTION_CHARACTER];

        let character;
        if (characterId !== self.EMPTY_ID) {
            character = Character.get(characterId);
            if (!character) {
                VST.error('Could not find the requested character to set.', characterId);

                return;
            }
        }

        my.build.character = characterId;

        section.container.dataset.selected = JSON.stringify(!!characterId);

        // Update the selected character.
        section.selected.innerHTML = '';
        if (character) {
            Character.renderBox(
                character,
                Character.DISPLAY_MODE_DETAILS,
                'span',
                section.selected,
                'Change',
                () => setCharacter(self.EMPTY_ID),
            );
        }

        // TODO: Uncomment this once weapons are supported.
        // if (!fromBuild) {
        //     character.weaponIds.forEach(weaponId => setWeapon(weaponId));
        // }

        dispatchChangedBuildEvent();
    }
};
