/**
 * Functions related to Vampire Survivors weapons.
 */
VST.VS.Weapon = new function () {
    const VS = VST.VS;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the weapon with the given ID.
     *
     * @param {WeaponId} id
     * @return {WeaponData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_WEAPON, id);

    /**
     * Returns a list of all weapon IDs.
     *
     * @return {WeaponId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_WEAPON);
};
