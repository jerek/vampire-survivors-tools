/**
 * Contains game data and provides functions for retrieving it.
 */
VSBT.Data = new function () {
    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} ArcanaData Data describing an arcana.
     * @property {string}   description
     * @property {ArcanaId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}   name
     */

    /** @typedef {number} ArcanaId An arcana's ID. */

    /**
     * @typedef {Object} CharacterData Data describing a character.
     * @property {CharacterId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name        The character's first name.
     * @property {string}      description
     * @property {string}      surname
     * @property {WeaponId}    weaponId
     */

    /** @typedef {number} CharacterId A character's ID. */

    /**
     * @typedef {Object} PassiveData Data describing a passive item.
     * @property {string}    description
     * @property {PassiveId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}    name
     */

    /** @typedef {number} PassiveId A passive item's ID. */

    /**
     * @typedef {Object} StageData Data describing a stage.
     * @property {string}      description
     * @property {StageId}     id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {PassiveId[]} passives    The passive items that can be found on the stage.
     */

    /** @typedef {number} StageId A stage's ID. */

    /**
     * @typedef {Object} WeaponData Data describing a weapon.
     * @property {string}   description
     * @property {WeaponId} id            This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}   name
     */

    /** @typedef {number} WeaponId A weapon's ID. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<ArcanaId, ArcanaData>} A custom representation of the game's arcana data. */
    const ARCANAS = {
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<CharacterId, CharacterData>} A custom representation of the game's character data. */
    const CHARACTERS = {
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<PassiveId, PassiveData>} A custom representation of the game's passive item data. */
    const PASSIVES = {
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<StageId, StageData>} A custom representation of the game's stage data. */
    const STAGES = {
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<WeaponId, WeaponData>} A custom representation of the game's weapon data. */
    const WEAPONS = {
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Returns the arcana with the given ID.
     *
     * @param {ArcanaId} id
     * @return {ArcanaData|undefined}
     */
    this.getArcana = id => getData(ARCANAS, id);

    /**
     * Returns a list of all arcana IDs.
     *
     * @return {ArcanaId[]}
     */
    this.getArcanaIds = () => getIds(ARCANAS);

    /**
     * Returns the character with the given ID.
     *
     * @param {CharacterId} id
     * @return {CharacterData|undefined}
     */
    this.getCharacter = id => getData(CHARACTERS, id);

    /**
     * Returns a list of all character IDs.
     *
     * @return {CharacterId[]}
     */
    this.getCharacterIds = () => getIds(CHARACTERS);

    /**
     * Returns the passive item with the given ID.
     *
     * @param {PassiveId} id
     * @return {PassiveData|undefined}
     */
    this.getPassive = id => getData(PASSIVES, id);

    /**
     * Returns a list of all passive item IDs.
     *
     * @return {PassiveId[]}
     */
    this.getPassiveIds = () => getIds(PASSIVES);

    /**
     * Returns the stage with the given ID.
     *
     * @param {StageId} id
     * @return {StageData|undefined}
     */
    this.getStage = id => getData(STAGES, id);

    /**
     * Returns a list of all stage IDs.
     *
     * @return {StageId[]}
     */
    this.getStageIds = () => getIds(STAGES);

    /**
     * Returns the weapon with the given ID.
     *
     * @param {WeaponId} id
     * @return {WeaponData|undefined}
     */
    this.getWeapon = id => getData(WEAPONS, id);

    /**
     * Returns a list of all weapon IDs.
     *
     * @return {WeaponId[]}
     */
    this.getWeaponIds = () => getIds(WEAPONS);

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Returns data by ID from the given entity lookup.
     *
     * @param {Object<number, Object>} entities
     * @param {number}                 id
     * @return {Object|undefined}
     */
    function getData(entities, id) {
        if (entities[id]) {
            return VSBT.Util.copyProperties({}, entities[id]);
        }
    }

    /**
     * Returns a list of IDs from the given entity lookup.
     *
     * @param {Object<number, Object>} entities
     * @return {number[]}
     */
    function getIds(entities) {
        return Object.keys(entities).map(id => parseInt(id));
    }

    /**
     * Sets IDs in all entity lookups.
     */
    function init() {
        setTimeout(() => {
            [ARCANAS, CHARACTERS, PASSIVES, STAGES, WEAPONS].forEach(entities => {
                Object.keys(entities).forEach(idString => {
                    let id = parseInt(idString);

                    // Rewrite this object with the ID added, and put it first for development convenience.
                    entities[idString] = VSBT.Util.copyProperties({}, {id: id}, entities[idString]);
                });
            });
        });
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    VSBT.registerInitCallback(init);
};
