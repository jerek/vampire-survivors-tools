/**
 * Functions related to Vampire Survivors DLC.
 */
VST.VS.DLC = new function () {
    const DOM = VST.DOM;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {EntityData} DlcData Data describing a DLC.
     * @property {DlcId}  id        The ID number where the DLC is stored when downloaded from Steam.
     * @property {string} name      The full official name of the DLC.
     * @property {string} shorthand The shortened version of the name appended to the basename of the DLC's JSON files.
     */

    /** @typedef {EntityId} DlcId A DLC's ID. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // noinspection JSValidateTypes Types and IDs are filled during initialization, so ignore warnings here.
    /**
     * @type {Object<DlcId, DlcData>} A custom representation of the game's DLC data.
     * @property {DlcId[]} sortedIds
     */
    const DATA = {
    };

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_DLC;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Add any relevant dlc-specific tooltip content to the given tooltip.
     *
     * @param {HTMLDivElement} tooltip
     * @param {DlcId}          [dlc]
     */
    this.addTooltipContent = (tooltip, dlc) => {
        if (dlc) {
            DOM.ce('div', {className: 'vst-tooltip-heading'}, tooltip, DOM.ct('DLC'));
            DOM.ce('div', undefined, tooltip, DOM.ct(VS.DLC.getName(dlc)));
        }
    };

    /**
     * Returns the DLC with the given ID.
     *
     * @param {DlcId} id
     * @return {DlcData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns the character sprite used for the given DLC, or undefined if there is none.
     *
     * @param {DlcId} id
     * @return {VsSprite|undefined}
     */
    this.getCharacterSprite = id => {
        return {
        }[id];
    };

    /**
     * Returns a list of all DLC IDs.
     *
     * When called during initialization, this may not be in the final order.
     *
     * @return {DlcId[]}
     */
    this.getIds = () => VS.getSortedIds(DATA);

    /**
     * Returns the name of the given DLC.
     *
     * @param {DlcId} dlc
     * @return {string}
     */
    this.getName = dlc => DATA[dlc].name;

    /**
     * Returns the shorthand for the DLC with the given ID.
     *
     * @param {DlcId} dlc
     * @return {string}
     */
    this.getShorthand = dlc => DATA[dlc].shorthand;

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
