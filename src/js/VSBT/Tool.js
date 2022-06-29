/**
 * The core code for managing the build tool.
 */
VSBT.Tool = new function () {
    // We can alias any class-like here, since this is loaded last.
    const DOM = VSBT.DOM;
    const Page = VSBT.Page;
    const Util = VSBT.Util;

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

    /** @type {number} The maximum number of arcanas that a build can contain. */
    const ARCANAS_MAX = 3;

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

    /** @type {number} The maximum number of standard passive items that a build can contain. */
    const PASSIVE_ITEMS_MAX = 6;

    /** @type {number} The maximum number of weapons that a build can contain. */
    const WEAPONS_MAX = 6;

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

    // ------- //
    // PRIVATE //
    // ------- //
};
