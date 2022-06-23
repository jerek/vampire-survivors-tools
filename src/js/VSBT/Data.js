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
     * Returns the data with the given ID from the given data object.
     *
     * @param {Object} dataObject
     * @param {number} id
     * @return {Object|undefined}
     */
    function getData(dataObject, id) {
        if (dataObject[id]) {
            return VSBT.Util.copyProperties({}, dataObject[id]);
        }
    }

    /**
     * Returns a list of IDs from the given data object.
     *
     * @param {Object<number, *>} dataObject
     * @return {number[]}
     */
    function getIds(dataObject) {
        return Object.keys(dataObject).map(id => parseInt(id));
    }

    /**
     * Sets IDs in all the data objects.
     */
    function init() {
        setTimeout(() => {
            [ARCANAS, CHARACTERS, PASSIVES, STAGES, WEAPONS].forEach(dataObject => {
                Object.keys(dataObject).forEach(idString => {
                    dataObject[idString] = VSBT.Util.copyProperties({}, {id: parseInt(idString)}, dataObject[idString]);
                });
            });
        });
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    VSBT.registerInitCallback(init);
};
