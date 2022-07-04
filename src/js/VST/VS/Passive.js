/**
 * Functions related to Vampire Survivors passive items.
 */
VST.VS.Passive = new function () {
    const VS = VST.VS;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the passive item with the given ID.
     *
     * @param {PassiveId} id
     * @return {PassiveData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_PASSIVE, id);

    /**
     * Returns a list of all passive item IDs.
     *
     * @return {PassiveId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_PASSIVE);
};
