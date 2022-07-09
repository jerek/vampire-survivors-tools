/**
 * Functions and classes for managing Vampire Survivors entities and assets.
 */
VST.VS = new function () {
    const self = this;
    const DOM = VST.DOM;
    const Util = VST.Util;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {EntityData} ArcanaData Data describing an arcana.
     * @property {string}   description
     * @property {ArcanaId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}   name
     * @property {VsType}   type        The Arcana type ID.
     */

    /** @typedef {EntityId} ArcanaId An arcana's ID. */

    /**
     * @typedef {EntityData} CharacterData Data describing a character.
     * @property {CharacterId}  id           This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}       name         The character's common name.
     * @property {string}       description  The character's in-game description.
     * @property {number}       order        The order that this character is shown in.
     * @property {VsSpriteFunc} spriteAlt    The sprite that the filename exists in, if different from "characters".
     * @property {string}       spriteName   The filename of the character's image within the "characters" sprite.
     * @property {VsType}       type         The Character type ID.
     * @property {PassiveId[]}  [passiveIds] The passive items the character starts with.
     * @property {string}       [prefix]     Text shown before the character's name when showing their full name.
     * @property {string}       [surname]    Text shown after the character's name when showing their full name.
     * @property {WeaponId[]}   [weaponIds]  The weapons the character starts with.
     */

    /** @typedef {EntityId} CharacterId A character's ID. */

    /**
     * @typedef {Object} EntityData Data describing an entity.
     * @property {string}   description
     * @property {EntityId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}   name
     * @property {VsType}   type        The entity's type ID.
     */

    /** @typedef {number} EntityId An entity's ID. */

    /**
     * @typedef {EntityData} PassiveData Data describing a passive item.
     * @property {string}    description
     * @property {string}    frameName   The filename of the passive item's image within the "items" sprite.
     * @property {PassiveId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}    name
     * @property {number}    order       The order that this passive item is displayed in the in-game Collection.
     * @property {VsType}    type        The Passive Item type ID.
     */

    /** @typedef {EntityId} PassiveId A passive item's ID. */

    /**
     * @typedef {EntityData} StageData Data describing a stage.
     * @property {string}      description
     * @property {StageId}     id             This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {number}      order          The order that this stage is displayed when starting a run.
     * @property {PassiveId[]} passives       The passive items that can be found on the stage.
     * @property {VsType}      type           The Stage type ID.
     * @property {boolean}     [hideFromTool] Whether to hide this stage when selecting a stage for a build.
     */

    /** @typedef {EntityId} StageId A stage's ID. */

    /** @typedef {string} VsType A Vampire Survivors entity type. E.g. character, weapon, stage, etc. */

    /**
     * @typedef {EntityData} WeaponData Data describing a weapon.
     * @property {string}      description
     * @property {string}      frameName     The filename of the weapon's image within the "items" sprite.
     * @property {WeaponId}    id            This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {number}      order         The order that this weapon is displayed in the in-game Collection.
     * @property {VsType}      type          The Weapon type ID.
     * @property {PassiveId[]} [reqPassives] The passive items required to get this evolved weapon.
     * @property {WeaponId[]}  [reqWeapons]  The weapons required to get this evolved weapon.
     */

    /** @typedef {EntityId} WeaponId A weapon's ID. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    //         //
    // GENERAL //
    //         //

    /** @type {VsType} A weapon or passive item that a character can equip. */
    this.META_TYPE_ITEM = 'item';

    /** @type {VsType} An arcana that a character can collect. */
    this.TYPE_ARCANA = 'arcana';

    /** @type {VsType} A character that the player can play as. */
    this.TYPE_CHARACTER = 'character';

    /** @type {VsType} A passive item that a character can equip. */
    this.TYPE_PASSIVE = 'passive';

    /** @type {VsType} A level where a character is played. */
    this.TYPE_STAGE = 'stage';

    /** @type {VsType} A weapon that a character can equip. */
    this.TYPE_WEAPON = 'weapon';

    //     //
    // IDS //
    //     //

    // Passive Items have constants since they're referred to by ID in multiple places.
    /** @type {PassiveId} */ this.PASSIVE_ID_SPINACH = 1;
    /** @type {PassiveId} */ this.PASSIVE_ID_ARMOR = 2;
    /** @type {PassiveId} */ this.PASSIVE_ID_HOLLOW_HEART = 3;
    /** @type {PassiveId} */ this.PASSIVE_ID_PUMMAROLA = 4;
    /** @type {PassiveId} */ this.PASSIVE_ID_EMPTY_TOME = 5;
    /** @type {PassiveId} */ this.PASSIVE_ID_CANDELABRADOR = 6;
    /** @type {PassiveId} */ this.PASSIVE_ID_BRACER = 7;
    /** @type {PassiveId} */ this.PASSIVE_ID_SPELLBINDER = 8;
    /** @type {PassiveId} */ this.PASSIVE_ID_DUPLICATOR = 9;
    /** @type {PassiveId} */ this.PASSIVE_ID_WINGS = 10;
    /** @type {PassiveId} */ this.PASSIVE_ID_ATTRACTORB = 11;
    /** @type {PassiveId} */ this.PASSIVE_ID_CLOVER = 12;
    /** @type {PassiveId} */ this.PASSIVE_ID_CROWN = 13;
    /** @type {PassiveId} */ this.PASSIVE_ID_STONE_MASK = 14;
    /** @type {PassiveId} */ this.PASSIVE_ID_SKULL_O_MANIAC = 15;
    /** @type {PassiveId} */ this.PASSIVE_ID_TIRAGISU = 16;
    /** @type {PassiveId} */ this.PASSIVE_ID_TORRONAS_BOX = 17;
    /** @type {PassiveId} */ this.PASSIVE_ID_SILVER_RING = 18;
    /** @type {PassiveId} */ this.PASSIVE_ID_GOLD_RING = 19;
    /** @type {PassiveId} */ this.PASSIVE_ID_METAGLIO_LEFT = 20;
    /** @type {PassiveId} */ this.PASSIVE_ID_METAGLIO_RIGHT = 21;

    // Weapons have constants since they're referred to by ID in multiple places.
    /** @type {WeaponId} */ this.WEAPON_ID_WHIP = 1;
    /** @type {WeaponId} */ this.WEAPON_ID_BLOODY_TEAR = 2;
    /** @type {WeaponId} */ this.WEAPON_ID_MAGIC_WAND = 3;
    /** @type {WeaponId} */ this.WEAPON_ID_HOLY_WAND = 4;
    /** @type {WeaponId} */ this.WEAPON_ID_KNIFE = 5;
    /** @type {WeaponId} */ this.WEAPON_ID_THOUSAND_EDGE = 6;
    /** @type {WeaponId} */ this.WEAPON_ID_AXE = 7;
    /** @type {WeaponId} */ this.WEAPON_ID_DEATH_SPIRAL = 8;
    /** @type {WeaponId} */ this.WEAPON_ID_CROSS = 9;
    /** @type {WeaponId} */ this.WEAPON_ID_HEAVEN_SWORD = 10;
    /** @type {WeaponId} */ this.WEAPON_ID_KING_BIBLE = 11;
    /** @type {WeaponId} */ this.WEAPON_ID_UNHOLY_VESPERS = 12;
    /** @type {WeaponId} */ this.WEAPON_ID_FIRE_WAND = 13;
    /** @type {WeaponId} */ this.WEAPON_ID_HELLFIRE = 14;
    /** @type {WeaponId} */ this.WEAPON_ID_GARLIC = 15;
    /** @type {WeaponId} */ this.WEAPON_ID_SOUL_EATER = 16;
    /** @type {WeaponId} */ this.WEAPON_ID_SANTA_WATER = 17;
    /** @type {WeaponId} */ this.WEAPON_ID_LA_BORRA = 18;
    /** @type {WeaponId} */ this.WEAPON_ID_RUNETRACER = 19;
    /** @type {WeaponId} */ this.WEAPON_ID_NO_FUTURE = 20;
    /** @type {WeaponId} */ this.WEAPON_ID_LIGHTNING_RING = 21;
    /** @type {WeaponId} */ this.WEAPON_ID_THUNDER_LOOP = 22;
    /** @type {WeaponId} */ this.WEAPON_ID_PENTAGRAM = 23;
    /** @type {WeaponId} */ this.WEAPON_ID_GORGEOUS_MOON = 24;
    /** @type {WeaponId} */ this.WEAPON_ID_PEACHONE = 25;
    /** @type {WeaponId} */ this.WEAPON_ID_EBONY_WINGS = 26;
    /** @type {WeaponId} */ this.WEAPON_ID_VANDALIER = 27;
    /** @type {WeaponId} */ this.WEAPON_ID_PHIERA_DER_TUPHELLO = 28;
    /** @type {WeaponId} */ this.WEAPON_ID_EIGHT_THE_SPARROW = 29;
    /** @type {WeaponId} */ this.WEAPON_ID_PHIERAGGI = 30;
    /** @type {WeaponId} */ this.WEAPON_ID_GATTI_AMARI = 31;
    /** @type {WeaponId} */ this.WEAPON_ID_VICIOUS_HUNGER = 32;
    /** @type {WeaponId} */ this.WEAPON_ID_SONG_OF_MANA = 33;
    /** @type {WeaponId} */ this.WEAPON_ID_MANNAJJA = 34;
    /** @type {WeaponId} */ this.WEAPON_ID_SHADOW_PINION = 35;
    /** @type {WeaponId} */ this.WEAPON_ID_VALKYRIE_TURNER = 36;
    /** @type {WeaponId} */ this.WEAPON_ID_CLOCK_LANCET = 37;
    /** @type {WeaponId} */ this.WEAPON_ID_INFINITE_CORRIDOR = 38;
    /** @type {WeaponId} */ this.WEAPON_ID_LAUREL = 39;
    /** @type {WeaponId} */ this.WEAPON_ID_CRIMSON_SHROUD = 40;
    /** @type {WeaponId} */ this.WEAPON_ID_VENTO_SACRO = 41;
    /** @type {WeaponId} */ this.WEAPON_ID_FUWALAFUWALOO = 42;
    /** @type {WeaponId} */ this.WEAPON_ID_BONE = 43;
    /** @type {WeaponId} */ this.WEAPON_ID_CHERRY_BOMB = 44;
    /** @type {WeaponId} */ this.WEAPON_ID_CARRELLO = 45;
    /** @type {WeaponId} */ this.WEAPON_ID_CELESTIAL_DUSTING = 46;
    /** @type {WeaponId} */ this.WEAPON_ID_LA_ROBBA = 47;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Creates a standard entity wrapper, used for the display of most entities.
     *
     * @param {VsType}     type            Although entities carry their type, the entity is optional, so we need this.
     * @param {EntityData} [entity]
     * @param {string}     [tagName="div"]
     * @param {string}     [mode]
     * @return {{wrapper: HTMLDivElement, content: HTMLDivElement}}
     */
    this.createEntityElements = function (type, entity, tagName, mode) {
        let elements = {};

        elements.wrapper = DOM.ce(tagName || 'div', {
            className: 'vs-entity',
            dataset: {
                metaType: self.getMetaType(type),
                type: type,
            },
        });
        if (entity) {
            elements.wrapper.dataset.id = entity.id.toString();
        }
        if (mode) {
            elements.wrapper.dataset.mode = mode;
        }

        elements.content = DOM.ce('div', {className: 'vs-entity-content'}, elements.wrapper)

        return elements;
    };

    /**
     * Create a tooltip with the given content.
     *
     * @param {EntityData|CharacterData} entity Any entity data, but character data is listed for its unique properties.
     * @return {HTMLDivElement}
     */
    this.createTooltip = function (entity) {
        let tooltip = document.createDocumentFragment();

        //      //
        // NAME //
        //      //

        let name = DOM.ce('div', {
            className: 'vst-tooltip-name',
        });
        if (entity.prefix) {
            name.appendChild(DOM.ct(entity.prefix + ' '));
        }
        name.appendChild(DOM.ct(entity.name));
        if (entity.surname) {
            name.appendChild(DOM.ct(' ' + entity.surname));
        }
        tooltip.appendChild(name);

        //             //
        // DESCRIPTION //
        //             //

        if (entity.description) {
            tooltip.appendChild(DOM.ce('div', {
                className: 'vst-tooltip-description',
            }, undefined, DOM.ct(entity.description)));
        }

        return DOM.createTooltip(tooltip);
    };

    /**
     * Prepares the given data object for general use. Specifically:
     * - Sets types and IDs in all entities.
     * - Builds a sorted ID list.
     * - Freezes the object so that it's no longer modifiable, so that entities can't be accidentally changed.
     *
     * @param {VsType}                       type
     * @param {Object<EntityId, EntityData>} data
     */
    this.finalizeData = (type, data) => {
        let ids = [];

        // Set types and IDs, and get the list of IDs.
        Object.keys(data).forEach(idString => {
            let id = parseInt(idString);

            // Rewrite this object with the type & ID added, and put them first for development convenience.
            data[idString] = Util.copyProperties(
                {},
                {type: type, id: id},
                data[idString],
            );

            // Add this ID to the list of IDs to be sorted.
            ids.push(id);
        });

        // Sort the ID list by the entity order.
        ids.sort((a, b) => {
            let aSort = data[a].order || data[a].id || 0;
            let bSort = data[b].order || data[b].id || 0;

            return aSort > bSort ? 1 : -1;
        });
        data.sortedIds = ids;

        // Freeze the data object, so it can't be accidentally modified.
        Object.freeze(data);
    };

    /**
     * Returns data by ID of the given entity type.
     *
     * @param {VsType} type
     * @param {number} id
     * @return {EntityData|undefined}
     */
    this.getData = function (type, id) {
        self.getTypeClass(type).get(id);
    };

    /**
     * Returns a list of IDs from the given entity lookup.
     *
     * @param {VsType} type
     * @return {number[]}
     */
    this.getIds = function (type) {
        return self.getTypeClass(type).getIds();
    };

    /**
     * Returns the meta type of the given type.
     *
     * @param {VsType} type
     * @return {VsType}
     */
    this.getMetaType = function (type) {
        if ([self.TYPE_WEAPON, self.TYPE_PASSIVE].includes(type)) {
            return self.META_TYPE_ITEM;
        }

        return type;
    };

    /**
     * Returns the class associated with the given type.
     *
     * @param {VsType} type
     * @return {object}
     */
    this.getTypeClass = function (type) {
        switch (type) {
            case self.TYPE_ARCANA:    return self.Arcana;
            case self.TYPE_CHARACTER: return self.Character;
            case self.TYPE_PASSIVE:   return self.Passive;
            case self.TYPE_STAGE:     return self.Stage;
            case self.TYPE_WEAPON:    return self.Weapon;
        }
    };
};
