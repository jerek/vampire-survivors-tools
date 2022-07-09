/**
 * Functions related to Vampire Survivors stages.
 */
VST.VS.Stage = new function () {
    const VS = VST.VS;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_STAGE;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the stage with the given ID.
     *
     * @param {StageId} id
     * @return {StageData|undefined}
     */
    this.get = id => VS.getData(TYPE, id);

    /**
     * Returns a list of all stage IDs.
     *
     * @return {StageId[]}
     */
    this.getIds = () => VS.getIds(TYPE);
};
