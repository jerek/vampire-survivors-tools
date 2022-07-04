/**
 * Functions related to Vampire Survivors stages.
 */
VST.VS.Stage = new function () {
    const VS = VST.VS;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the stage with the given ID.
     *
     * @param {StageId} id
     * @return {StageData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_STAGE, id);

    /**
     * Returns a list of all stage IDs.
     *
     * @return {StageId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_STAGE);
};
