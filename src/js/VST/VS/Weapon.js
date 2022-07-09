/**
 * Functions related to Vampire Survivors weapons.
 */
VST.VS.Weapon = new function () {
    const self = this;
    const Item = VST.VS.Item;
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
     * Returns all weapons that can result from evolving the given weapon.
     *
     * @param {WeaponId} id
     * @return {WeaponData[]}
     */
    this.getAllEvolutions = id => {
        let weaponEvolutionMap = Item.getWeaponEvolutionMap();
        let evolutions = [];

        let nextId = weaponEvolutionMap[id];
        while (nextId) {
            let evolvedWeapon = self.get(nextId);
            evolutions.push(evolvedWeapon);
            nextId = weaponEvolutionMap[evolvedWeapon.id];
        }

        return evolutions;
    };

    /**
     * Returns the weapon that can result from evolving the given weapon.
     *
     * @param {WeaponId} id
     * @return {WeaponData|undefined}
     */
    this.getEvolution = id => {
        let evolutionId = Item.getWeaponEvolutionMap()[id];
        if (evolutionId) {
            return self.get(evolutionId);
        }
    };

    /**
     * Returns a list of all weapon IDs.
     *
     * @return {WeaponId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_WEAPON);
};
