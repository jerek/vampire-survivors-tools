/**
 * Functions related to Vampire Survivors arcanas.
 */
VST.VS.Arcana = new function () {
    const VS = VST.VS;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the arcana with the given ID.
     *
     * @param {ArcanaId} id
     * @return {ArcanaData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_ARCANA, id);

    /**
     * Returns a list of all arcana IDs.
     *
     * @return {ArcanaId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_ARCANA);
};
