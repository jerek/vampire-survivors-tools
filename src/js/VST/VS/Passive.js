/**
 * Functions related to Vampire Survivors passive items.
 */
VST.VS.Passive = new function () {
    const self = this;
    const Item = VST.VS.Item;
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
     * Returns the weapon that can result from evolving the given passive item.
     *
     * @param {PassiveId} id
     * @return {WeaponData|undefined}
     */
    this.getEvolution = id => {
        let evolutionId = Item.getPassiveEvolutionMap()[id];
        if (evolutionId) {
            return self.get(evolutionId);
        }
    };

    /**
     * Returns a list of all passive item IDs.
     *
     * @return {PassiveId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_PASSIVE);
};
