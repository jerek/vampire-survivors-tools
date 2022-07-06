/**
 * Functions related to Vampire Survivors weapons.
 */
VST.VS.Weapon = new function () {
    const self = this;
    const VS = VST.VS;

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {Object<PassiveId, WeaponId>} An ID map of passives to the weapons that they can evolve into. */
        passiveEvolutions: undefined,

        /** @type {Object<WeaponId, WeaponId>} An ID map of weapons to the weapons that they can evolve into. */
        weaponEvolutions: undefined,
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

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
     * @return {Object<WeaponId, WeaponData>}
     */
    this.getAllEvolutions = id => {
        let evolutions = {};

        let nextId = id;
        while (nextId) {
            let weapon = self.getEvolution(nextId);
            if (weapon) {
                evolutions[weapon.id] = weapon;
                nextId = weapon.id;
            } else {
                nextId = null;
            }
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
        let evolutionId = getWeaponEvolutionMap()[id];
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

    /**
     * Returns an ID map of passives to the weapons that they can evolve into.
     *
     * @return {Object<PassiveId, WeaponId>}
     */
    this.getPassiveEvolutionMap = () => {
        if (!my.passiveEvolutions) {
            generateEvolutionMaps();
        }

        return my.passiveEvolutions;
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Generates maps of items to the weapons that they can evolve into.
     */
    function generateEvolutionMaps() {
        my.weaponEvolutions = {};
        my.passiveEvolutions = {};
        self.getIds().forEach(weaponId => {
            let weapon = self.get(weaponId);
            (weapon.reqWeapons || []).forEach(requiredWeaponId => my.weaponEvolutions[requiredWeaponId] = weaponId);
            (weapon.reqPassives || []).forEach(requiredPassiveId => my.passiveEvolutions[requiredPassiveId] = weaponId);
        });
    }

    /**
     * Returns an ID map of weapons to the weapons that they can evolve into.
     *
     * @return {Object<WeaponId, WeaponId>}
     */
    function getWeaponEvolutionMap() {
        if (!my.weaponEvolutions) {
            generateEvolutionMaps();
        }

        return my.weaponEvolutions;
    }
};
