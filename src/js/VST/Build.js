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
    const Item = VST.VS.Item;
    const Page = VST.Page;
    const Util = VST.Util;
    const Passive = VST.VS.Passive;
    const VS = VST.VS;
    const Weapon = VST.VS.Weapon;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} Build All data describing a build.
     * @property {BuildIdList} arcanas         A list of the selected arcanas' IDs.
     * @property {number}      character       The ID of the currently selected character.
     * @property {BuildIdList} passives        A list of the selected passive items' IDs.
     * @property {BuildIdList} passives-backup A list of the selected backup passive items' IDs, which will
     *                                         automatically replace passives based on what's on the stage.
     * @property {number}      stage           The ID of the currently selected stage.
     * @property {boolean}     stageInHash     Whether to include the stage in the hash.
     * @property {BuildIdList} weapons         A list of the selected weapons' IDs.
     */

    /** @typedef {number[]} BuildIdList A sparse ID list. Indexes go to the entity's max - 1, and there can be gaps. */

    /** @typedef {string} BuildSectionId An area of the build tool where a certain type of entity is managed. */

    /**
     * @typedef {Object} BuildSectionConfig
     * @property {HTMLDivElement} container   The element containing the section.
     * @property {VsType}         entityType  The Vampire Survivors entity type that can be selected in this section.
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
        passives: [],
        'passives-backup': [],
        stage: this.EMPTY_ID,
        stageInHash: true,
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
            entityType: VS.TYPE_ARCANA,
            list: undefined,
            listHeading: 'Arcanas',
            max: self.ARCANAS_MAX,
            selected: undefined,
        },
        [SECTION_CHARACTER]: {
            container: undefined,
            entityType: VS.TYPE_CHARACTER,
            list: undefined,
            listHeading: 'Character Selection',
            selected: undefined,
        },
        [SECTION_PASSIVES]: {
            container: undefined,
            entityType: VS.TYPE_PASSIVE,
            list: undefined,
            listHeading: 'Passive Items',
            max: self.PASSIVE_ITEMS_MAX,
            selected: undefined,
        },
        [SECTION_PASSIVES_BACKUP]: {
            container: undefined,
            entityType: VS.TYPE_PASSIVE,
            list: undefined,
            listHeading: 'Backup Passive Items',
            selected: undefined,
        },
        [SECTION_STAGE]: {
            container: undefined,
            entityType: VS.TYPE_STAGE,
            list: undefined,
            listHeading: 'Stage',
            selected: undefined,
        },
        [SECTION_WEAPONS]: {
            container: undefined,
            entityType: VS.TYPE_WEAPON,
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
        renderCharacterSection();
        renderItemSection(SECTION_WEAPONS);
        renderItemSection(SECTION_PASSIVES);

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

        // Character
        setCharacter(build.character, true);

        // Weapons
        for (let slot = 0; slot < self.WEAPONS_MAX; slot++) {
            let weaponId = my.build.weapons[slot];
            if (weaponId) {
                let weapon = Weapon.get(weaponId);
                if (!weapon) {
                    VST.error('Could not load weapon found in build.', weaponId);

                    continue;
                }

                updateItemDisplay(SECTION_WEAPONS, slot, weapon);
            }
        }

        // Passive Items
        for (let slot = 0; slot < self.PASSIVE_ITEMS_MAX; slot++) {
            let passiveId = my.build.passives[slot];
            if (passiveId) {
                let passive = Passive.get(passiveId);
                if (!passive) {
                    VST.error('Could not load passive item found in build.', passiveId);

                    continue;
                }

                updateItemDisplay(SECTION_PASSIVES, slot, passive);
            }
        }

        // Backup Passive Items
        // TODO

        // Arcanas
        // TODO

        // Stage
        // TODO
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
     * Displays the weapon or passive selection options in the main container.
     *
     * @param {BuildSectionId} sectionId
     */
    function renderItemSection(sectionId) {
        let section = SECTIONS[sectionId];
        renderSectionContainer(sectionId);

        section.selected = DOM.ce('div', {
            className: 'vst-build-selected-items vst-build-selected-' + sectionId,
        });
        section.container.prepend(section.selected);

        section.list = DOM.ce('div', {
            className: `vst-build-items-list vst-build-${sectionId}-list`,
        }, section.container);

        for (let slot = 0; slot < section.max; slot++) {
            let slotElement = DOM.ce('span', {
                className: 'vst-build-selected-items-item',
                dataset: {
                    slot: slot,
                },
            }, section.selected);
            slotElement.addEventListener('click', () => setItem(sectionId, self.EMPTY_ID, slot));
        }

        VS.getIds(section.entityType).forEach(entityId => {
            let entity = VS.getData(section.entityType, entityId);

            let box = Item.render(
                entity,
                section.list,
                Item.DISPLAY_MODE_FRAME,
                undefined,
                'a',
            );
            box.href = 'javascript:';
            box.addEventListener('click', () => {
                let success = setItem(sectionId, entityId);
                if (!success) {
                    // Display an "error" animation for user feedback.
                    box.dataset.animation = 'error';
                    setTimeout(() => delete box.dataset.animation, 300);
                }
            });

            // TODO
            // Item.renderTooltip(item, box);
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

    /**
     * Equip the item with the given ID in the first available or given slot.
     *
     * @param {BuildSectionId} sectionId
     * @param {number}         itemId
     * @param {number}         [slot]    Defaults to the first available slot.
     * @return {boolean} Whether the item was successfully added.
     */
    function setItem(sectionId, itemId, slot) {
        let debug = function (message) {
            let args = ['setItem, ' + sectionId + ':'].concat(Array.prototype.slice.call(arguments));
            VST.debug.apply(VST.debug, args);
        };

        debug('Called', 'ID:', itemId, 'Slot:', slot);

        if (slot === undefined) {
            // When the user clicks an item that's already in the build, remove it.
            if (itemId !== self.EMPTY_ID && my.build[sectionId].includes(itemId)) {
                slot = my.build[sectionId].indexOf(itemId);
                itemId = self.EMPTY_ID;
            }
        } else {
            // When the user clicks a build slot that's already empty, do nothing.
            if (my.build[sectionId][slot] === self.EMPTY_ID) {
                // Nothing to do.
                debug('Nothing to do');

                return false;
            }
        }

        // If there's no slot specified, find the first available slot.
        if (slot === undefined) {
            let maxItems = SECTIONS[sectionId].max;
            for (let potentialSlot = 0; potentialSlot < maxItems; potentialSlot++) {
                if (!my.build[sectionId][potentialSlot]) {
                    slot = potentialSlot;
                    break;
                }
            }

            if (slot === undefined) {
                // We couldn't find a slot for this item, do nothing.
                debug('No available slot found');

                return false;
            }
        }

        // Get the item data, both to validate the ID and because we'll need it to update the display.
        let item;
        if (itemId !== self.EMPTY_ID) {
            item = sectionId === SECTION_WEAPONS ? Weapon.get(itemId) : Passive.get(itemId);
            if (!item) {
                VST.error('Could not find the requested item to set.', sectionId, itemId);

                return false;
            }
        }

        // Set the item in the build.
        my.build[sectionId][slot] = itemId;

        // Update the relevant slot.
        updateItemDisplay(sectionId, slot, item);

        dispatchChangedBuildEvent();

        debug('Success');

        return true;
    }

    /**
     * Show the given item in the specified slot, or clear the slot if no item was given.
     *
     * @param {BuildSectionId}         sectionId
     * @param {number}                 slot
     * @param {WeaponData|PassiveData} [item]
     */
    function updateItemDisplay(sectionId, slot, item) {
        let section = SECTIONS[sectionId];

        let incomplete = false;
        for (let slotIndex = 0; slotIndex < section.max; slotIndex++) {
            if (!my.build[sectionId][slotIndex]) {
                incomplete = true;
                break;
            }
        }
        section.container.dataset.selected = JSON.stringify(!incomplete);

        // Update the selected weapon.
        let slotElement = section.selected.querySelector(':scope > span[data-slot="' + slot + '"]');
        slotElement.innerHTML = '';
        if (item) {
            Item.render(item, slotElement, Item.DISPLAY_MODE_FRAME, Item.SELECTED_SCALE);
        }

        // TODO: Update evolution indicators
    }
};
