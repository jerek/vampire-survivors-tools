// noinspection JSClosureCompilerSyntax EventTarget is implemented in a non-standard way, but it works fine.
/**
 * The core code for managing the build tool.
 *
 * @implements {EventTarget}
 */
VST.Build = new function () {
    const self = this;
    // We can alias any class-like here, since this is loaded last.
    const Arcana = VST.VS.Arcana;
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
     * @property {CharacterId} character       The ID of the currently selected character.
     * @property {number}      maxWeapons      The maximum number of weapons allowed in the build.
     * @property {BuildIdList} passives        A list of the selected passive items' IDs.
     * @property {BuildIdList} passives-backup A list of the selected backup passive items' IDs, which will
     *                                         automatically replace passives based on what's on the stage.
     * @property {StageId}     stage           The ID of the currently selected stage.
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
        maxWeapons: 6,
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
        /** @type {boolean} Whether it's currently okay to trigger changed build events, which will update the hash. */
        allowChangedBuildEvents: true,

        /** @type {Build} The currently loaded character build. */
        build: Util.copyProperties({}, EMPTY_BUILD),

        /** @type {number} A value returned by requestAnimationFrame, used to throttle responsive width updates. */
        requestedWidthUpdateFrame: undefined,
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
        renderArcanasSection();

        requestListWidthUpdate();

        if (!self.addEventListener) {
            let target = new EventTarget();
            self.addEventListener = target.addEventListener.bind(target);
            self.dispatchEvent = target.dispatchEvent.bind(target);
            self.removeEventListener = target.removeEventListener.bind(target);

            this.addEventListener(EVENT_CHANGED_BUILD, self.Hash.write, false);

            // Technically this isn't related to this condition, but it'll likewise only need to be set up once, so
            // we'll piggyback on it.
            window.addEventListener('resize', requestListWidthUpdate);
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

        // Max Weapons
        // TODO: update max weapons display

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
        for (let slot = 0; slot < self.ARCANAS_MAX; slot++) {
            let arcanaId = my.build.arcanas[slot];
            if (arcanaId) {
                let arcana = Arcana.get(arcanaId);
                if (!arcana) {
                    VST.error('Could not load arcana found in build.', arcanaId);

                    continue;
                }

                updateArcanaDisplay(slot, arcana);
            }
        }

        // Stage / Stage In Hash
        // TODO
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Dispatches an event indicating that the build has changed.
     */
    function dispatchChangedBuildEvent() {
        if (!my.allowChangedBuildEvents) {
            return;
        }

        self.dispatchEvent(new CustomEvent(EVENT_CHANGED_BUILD));
    }

    /**
     * Displays the arcanas section in the main container.
     */
    function renderArcanasSection() {
        let section = SECTIONS[SECTION_ARCANAS];
        renderSectionContainer(SECTION_ARCANAS);

        //                  //
        // SELECTED ARCANAS //
        //                  //

        for (let slot = 0; slot < section.max; slot++) {
            let slotElement = DOM.ce('div', {
                className: 'vst-build-selected-slot',
                dataset: {
                    slot: slot,
                },
            }, section.selected);
            slotElement.addEventListener('click', () => setArcana(self.EMPTY_ID, slot));
        }

        //              //
        // ARCANAS LIST //
        //              //

        Arcana.getIds().forEach(arcanaId => {
            // noinspection JSValidateTypes Realistically, this can't actually return undefined.
            /** @type {ArcanaData} */
            let arcana = Arcana.get(arcanaId);

            let card = Arcana.renderCard(arcana, 'a');
            card.addEventListener('click', () => setArcana(arcanaId));
            section.list.appendChild(card);
        });
    }

    /**
     * Displays the character section in the main container.
     */
    function renderCharacterSection() {
        let section = SECTIONS[SECTION_CHARACTER];
        renderSectionContainer(SECTION_CHARACTER);

        //                 //
        // CHARACTERS LIST //
        //                 //

        Character.getIds().forEach(characterId => {
            // noinspection JSValidateTypes Realistically, this can't actually return undefined.
            /** @type {CharacterData} */
            let character = Character.get(characterId);

            let box = Character.renderBox(
                character,
                Character.DISPLAY_MODE_DEFAULT,
                'a',
            );
            box.addEventListener('click', () => setCharacter(characterId));
            section.list.appendChild(box);
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

        //                //
        // SELECTED ITEMS //
        //                //

        for (let slot = 0; slot < section.max; slot++) {
            let slotElement = DOM.ce('div', {
                className: 'vst-build-selected-slot',
                dataset: {
                    slot: slot,
                },
            }, section.selected);
            slotElement.addEventListener('click', () => setItem(sectionId, self.EMPTY_ID, slot));

            updateItemDisplay(sectionId, slot);
        }

        //            //
        // ITEMS LIST //
        //            //

        let itemClass = VS.getTypeClass(section.entityType);
        itemClass.getIds().forEach(itemId => {
            let item = itemClass.get(itemId);

            let box = Item.render(
                section.entityType,
                item,
                Item.DISPLAY_MODE_FRAME,
                undefined,
                'a',
                requestListWidthUpdate,
            );
            box.addEventListener('click', () => {
                let success = setItem(sectionId, itemId);
                if (!success) {
                    // Display an "error" animation for user feedback.
                    box.dataset.animation = 'error';
                    setTimeout(() => delete box.dataset.animation, 300);
                }
            });
            section.list.appendChild(box);
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

        section.selected = DOM.ce('div', {
            className: 'vst-build-selected',
            dataset: {
                section: sectionId,
            },
        }, section.container);

        DOM.ce('h2', undefined, section.container, DOM.ct(section.listHeading));

        section.list = DOM.ce('div', {
            className: 'vst-build-list',
            dataset: {
                section: sectionId,
            },
        }, section.container);
    }

    /**
     * Requests an update to list widths on the next animation frame, if there isn't already one pending.
     */
    function requestListWidthUpdate() {
        if (my.requestedWidthUpdateFrame) {
            return;
        }

        my.requestedWidthUpdateFrame = requestAnimationFrame(() => {
            updateListWidths();
            my.requestedWidthUpdateFrame = 0;
        });
    }

    /**
     * Select the arcana with the given ID in the first available or given slot.
     *
     * @param {ArcanaId} arcanaId
     * @param {number}   [slot]    Defaults to the first available slot.
     * @return {boolean} Whether the arcana was successfully added.
     */
    function setArcana(arcanaId, slot) {
        let section = SECTIONS[SECTION_ARCANAS];

        let debug = function (message) {
            let args = ['setArcana:'].concat(Array.prototype.slice.call(arguments));
            VST.debug.apply(VST.debug, args);
        };

        debug('Called', 'ID:', arcanaId, 'Slot:', slot);

        if (slot === undefined) {
            // When the user clicks an arcana that's already in the build, remove it.
            if (arcanaId !== self.EMPTY_ID && my.build.arcanas.includes(arcanaId)) {
                slot = my.build.arcanas.indexOf(arcanaId);
                arcanaId = self.EMPTY_ID;
            }
        } else {
            // When the user clicks a build slot that's already empty, do nothing.
            if (my.build.arcanas[slot] === self.EMPTY_ID) {
                // Nothing to do.
                debug('Nothing to do');

                return false;
            }
        }

        // If there's no slot specified, find the first available slot.
        if (slot === undefined) {
            for (let potentialSlot = 0; potentialSlot < section.max; potentialSlot++) {
                if (!my.build.arcanas[potentialSlot]) {
                    slot = potentialSlot;
                    break;
                }
            }

            if (slot === undefined) {
                // We couldn't find a slot for this arcana, do nothing.
                debug('No available slot found');

                return false;
            }
        }

        // Get the arcana data, both to validate the ID and because we'll need it to update the display.
        let arcana;
        if (arcanaId !== self.EMPTY_ID) {
            arcana = Arcana.get(arcanaId);
            if (!arcana) {
                VST.error('Could not find the requested arcana to set.', arcanaId);

                return false;
            }
        }

        // If we're clearing or replacing a slot, set the arcana that was here to no longer appear selected.
        if (typeof my.build.arcanas[slot] === 'number' && my.build.arcanas[slot] !== self.EMPTY_ID) {
            setEntityAsSelected(section, my.build.arcanas[slot], false);
        }

        // Set the arcana in the build.
        my.build.arcanas[slot] = arcanaId;

        // Update the relevant slot.
        updateArcanaDisplay(slot, arcana);

        dispatchChangedBuildEvent();

        debug('Success');

        return true;
    }

    /**
     * Set the given character's ID as the current character.
     *
     * @param {CharacterId} characterId
     * @param {boolean}     [fromBuild] Whether this is from a build, and therefore weapons should not be modified.
     */
    function setCharacter(characterId, fromBuild) {
        let section = SECTIONS[SECTION_CHARACTER];

        /** @type {CharacterData} */
        let character;
        if (characterId !== self.EMPTY_ID) {
            character = Character.get(characterId);
            if (!character) {
                VST.error('Could not find the requested character to set.', characterId);

                return;
            }
        }

        let previousCharacterId = my.build.character;
        my.build.character = characterId;

        section.container.dataset.selected = JSON.stringify(!!characterId);

        // Update the selected character.
        section.selected.innerHTML = '';
        if (character) {
            section.selected.appendChild(Character.renderBox(
                character,
                Character.DISPLAY_MODE_DETAILS,
                undefined,
                'Change',
                () => setCharacter(self.EMPTY_ID),
            ));
        }

        my.allowChangedBuildEvents = false;

        // If this isn't from an existing build...
        if (!fromBuild) {
            // ...and we're clearing the character, remove the character's weapons.
            if (characterId === self.EMPTY_ID && previousCharacterId !== self.EMPTY_ID) {
                let previousCharacter = Character.get(previousCharacterId);
                if (previousCharacter) {
                    let weaponEvolutions = {};

                    // Remove any of this character's original weapons, and collect information on their evolutions.
                    (previousCharacter.weaponIds || []).forEach(weaponId => {
                        if (my.build.weapons.includes(weaponId)) {
                            let slot = my.build.weapons.indexOf(weaponId);
                            setItem(SECTION_WEAPONS, self.EMPTY_ID, slot);
                        }
                        Weapon.getAllEvolutions(weaponId).forEach(weapon => {
                            weaponEvolutions[weapon.id] = weapon;
                        });
                    });

                    // Remove any of this character's evolved original weapons.
                    Object.keys(weaponEvolutions).forEach(weaponId => {
                        weaponId = parseInt(weaponId);
                        if (my.build.weapons.includes(weaponId)) {
                            let slot = my.build.weapons.indexOf(weaponId);
                            setItem(SECTION_WEAPONS, self.EMPTY_ID, slot);
                        }
                    });

                    // Remove any of this character's original passive items.
                    (previousCharacter.passiveIds || []).forEach(passiveId => {
                        if (my.build.passives.includes(passiveId)) {
                            let slot = my.build.passives.indexOf(passiveId);
                            setItem(SECTION_PASSIVES, self.EMPTY_ID, slot);
                        }
                    });
                }
            }

            // ...and we're setting a character, also set the character's weapons/passives.
            if (characterId !== self.EMPTY_ID) {
                (character.weaponIds || []).forEach(weaponId => {
                    // If this build already includes this character's weapon, do nothing.
                    if (my.build.weapons.includes(weaponId)) {
                        return;
                    }

                    setItem(SECTION_WEAPONS, weaponId);
                });

                (character.passiveIds || []).forEach(passiveId => {
                    // If this build already includes this character's passive item, do nothing.
                    if (my.build.passives.includes(passiveId)) {
                        return;
                    }

                    setItem(SECTION_PASSIVES, passiveId);
                });
            }
        }

        // Because this may have revealed character or other lists for the first time at this resolution, update widths.
        requestListWidthUpdate();

        my.allowChangedBuildEvents = true;

        dispatchChangedBuildEvent();
    }

    /**
     * Enable or disable the styles to indicate that an entity in a list is selected.
     *
     * @param {BuildSectionConfig} section
     * @param {number}             id
     * @param {boolean}            selected
     */
    function setEntityAsSelected(section, id, selected) {
        section.list.querySelector(`.vs-entity[data-type="${section.entityType}"][data-id="${id}"]`)
            .dataset.selected = JSON.stringify(selected);
    }

    /**
     * Equip the item with the given ID in the first available or given slot.
     *
     * @param {BuildSectionId}     sectionId
     * @param {WeaponId|PassiveId} itemId
     * @param {number}             [slot]    Defaults to the first available slot.
     * @return {boolean} Whether the item was successfully added.
     */
    function setItem(sectionId, itemId, slot) {
        let section = SECTIONS[sectionId];

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
            let maxItems = section.max;
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

        // If we're clearing or replacing a slot, set the item that was here to no longer appear selected.
        if (typeof my.build[sectionId][slot] === 'number' && my.build[sectionId][slot] !== self.EMPTY_ID) {
            setEntityAsSelected(section, my.build[sectionId][slot], false);
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
     * Show the given arcana in the specified slot, or clear the slot if no arcana was given.
     *
     * @param {number}     slot
     * @param {ArcanaData} [arcana]
     */
    function updateArcanaDisplay(slot, arcana) {
        let section = SECTIONS[SECTION_ARCANAS];

        let incomplete = false;
        for (let slotIndex = 0; slotIndex < section.max; slotIndex++) {
            if (!my.build.arcanas[slotIndex]) {
                incomplete = true;
                break;
            }
        }
        section.container.dataset.selected = JSON.stringify(!incomplete);

        // Update the selected arcana.
        let slotElement = section.selected.querySelector(':scope > [data-slot="' + slot + '"]');
        slotElement.innerHTML = '';
        if (arcana) {
            slotElement.appendChild(Arcana.renderCard(arcana, 'a'));
        }

        if (arcana) {
            // Update the arcana's style in the list.
            setEntityAsSelected(section, arcana.id, true);
        }

        if (!arcana && incomplete) {
            // Because this may have revealed the arcana list for the first time at this resolution, update widths.
            requestListWidthUpdate();
        }
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

        // Update the selected item.
        let slotElement = section.selected.querySelector(':scope > [data-slot="' + slot + '"]');
        slotElement.innerHTML = '';
        slotElement.appendChild(
            Item.render(
                section.entityType,
                item,
                Item.DISPLAY_MODE_EQUIPPED,
                Item.SELECTED_SCALE,
                item ? 'a' : undefined,
            ),
        );

        if (item) {
            // Update the item's style in the list.
            setEntityAsSelected(section, item.id, true);
        }

        // TODO: Update evolution indicators

        if (!item && incomplete) {
            // Because this may have revealed an item list for the first time at this resolution, update widths.
            requestListWidthUpdate();
        }
    }

    /**
     * Update the widths of all entity lists to have the most even distribution of entities that's possible within them.
     */
    function updateListWidths() {
        let container = Page.getContainer();
        let containerWidth = container.clientWidth;

        container.querySelectorAll('.vst-build-list').forEach(list => {
            if (list.offsetParent === null) {
                // This list is currently hidden, there's nothing to check yet.
                return;
            }

            let entities = list.querySelectorAll('.vs-entity');
            let entityCount = entities.length;
            if (!entityCount) {
                // No entities found, probably not fully initialized yet.
                return;
            }

            // Determine the entity width that we need to support.
            let entity = entities[0];
            let entityStyle = getComputedStyle(entity);
            let entityWidth = entity.clientWidth + parseInt(entityStyle.marginLeft) + parseInt(entityStyle.marginRight);

            // Determine how many entities would be ideal per row that are able to fit.
            let maxEntitiesPerRow = Math.floor(containerWidth / entityWidth);
            let minimumEntityRowCount = Math.ceil(entityCount / maxEntitiesPerRow);
            let targetEntitiesPerRow = Math.ceil(entityCount / minimumEntityRowCount);

            // The 0.5 extra entity provides more than enough wiggle room to account for imperfect browser rendering.
            list.style.maxWidth = ((targetEntitiesPerRow + 0.5) * entityWidth) + 'px';
        });
    }
};
