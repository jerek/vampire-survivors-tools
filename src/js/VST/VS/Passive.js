/**
 * Functions related to Vampire Survivors passive items.
 */
VST.VS.Passive = new function () {
    const VS = VST.VS;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // noinspection JSValidateTypes Types and IDs are filled during initialization, so ignore warnings here.
    /**
     * @type {Object<PassiveId, PassiveData>} A custom representation of the game's passive item data.
     * @property {PassiveId[]} sortedIds
     */
    const DATA = {
        [VS.PASSIVE_ID_SPINACH]: {
            name: 'Spinach',
            description: 'Raises inflicted damage by 10%.',
            frameName: 'Leaf.png',
            order: 1,
        },
        [VS.PASSIVE_ID_ARMOR]: {
            name: 'Armor',
            description: 'Reduces incoming damage by 1. Increases retaliatory damage by 10%.',
            frameName: 'ArmorIron.png',
            order: 2,
        },
        [VS.PASSIVE_ID_HOLLOW_HEART]: {
            name: 'Hollow Heart',
            description: 'Augments max health by 20%.',
            frameName: 'HeartBlack.png',
            order: 3,
        },
        [VS.PASSIVE_ID_PUMMAROLA]: {
            name: 'Pummarola',
            description: 'Character recovers 0.2 HP per second.',
            frameName: 'HeartRuby.png',
            order: 4,
        },
        [VS.PASSIVE_ID_EMPTY_TOME]: {
            name: 'Empty Tome',
            description: 'Reduces weapons cooldown by 8%.',
            frameName: 'Book2.png',
            order: 5,
        },
        [VS.PASSIVE_ID_CANDELABRADOR]: {
            name: 'Candelabrador',
            description: 'Augments area of attacks by 10%.',
            frameName: 'Candelabra.png',
            order: 6,
        },
        [VS.PASSIVE_ID_BRACER]: {
            name: 'Bracer',
            description: 'Increases projectiles speed by 10%.',
            frameName: 'Gauntlet.png',
            order: 7,
        },
        [VS.PASSIVE_ID_SPELLBINDER]: {
            name: 'Spellbinder',
            description: 'Increases duration of weapon effects by 10%.',
            frameName: 'EmblemEye.png',
            order: 8,
        },
        [VS.PASSIVE_ID_DUPLICATOR]: {
            name: 'Duplicator',
            description: 'Weapons fire more projectiles.',
            frameName: 'Ring.png',
            order: 9,
        },
        [VS.PASSIVE_ID_WINGS]: {
            name: 'Wings',
            description: 'Character moves 10% faster.',
            frameName: 'Wing.png',
            order: 10,
        },
        [VS.PASSIVE_ID_ATTRACTORB]: {
            name: 'Attractorb',
            description: 'Character pickups items from further away.',
            frameName: 'OrbGlow.png',
            order: 11,
        },
        [VS.PASSIVE_ID_CLOVER]: {
            name: 'Clover',
            description: 'Character gets 10% luckier.',
            frameName: 'Clover.png',
            order: 12,
        },
        [VS.PASSIVE_ID_CROWN]: {
            name: 'Crown',
            description: 'Character gains 8% more experience.',
            frameName: 'Crown.png',
            order: 13,
        },
        [VS.PASSIVE_ID_STONE_MASK]: {
            name: 'Stone Mask',
            description: 'Character earns 10% more coins.',
            frameName: 'Mask.png',
            order: 14,
        },
        [VS.PASSIVE_ID_SKULL_O_MANIAC]: {
            name: 'Skull O\'Maniac',
            description: 'Increases enemy speed, health, quantity, and frequency by 10%.',
            frameName: 'Curse.png',
            order: 15,
        },
        [VS.PASSIVE_ID_TIRAGISU]: {
            name: 'Tiragisú',
            description: 'Revives once with 50% health.',
            frameName: 'Tiramisu.png',
            order: 16,
        },
        [VS.PASSIVE_ID_TORRONAS_BOX]: {
            name: 'Torrona\'s Box',
            description: 'Cursed item, but increases Might, Projectile Speed, Duration, and Area by 4%.',
            frameName: 'torrone.png',
            order: 17,
        },
        [VS.PASSIVE_ID_SILVER_RING]: {
            name: 'Silver Ring',
            description: 'Wear ... Clock ...',
            frameName: 'silverring.png',
            order: 18,
        },
        [VS.PASSIVE_ID_GOLD_RING]: {
            name: 'Gold Ring',
            description: '... With ... Lancet',
            frameName: 'goldring.png',
            order: 19,
        },
        [VS.PASSIVE_ID_METAGLIO_LEFT]: {
            name: 'Metaglio Left',
            description: 'Channels dark powers to protect the bearer.',
            frameName: 'bsleft.png',
            order: 20,
        },
        [VS.PASSIVE_ID_METAGLIO_RIGHT]: {
            name: 'Metaglio Right',
            description: 'Channels dark powers to curse the bearer.',
            frameName: 'bsright.png',
            order: 21,
        },
    };

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_PASSIVE;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the passive item with the given ID.
     *
     * @param {PassiveId} id
     * @return {PassiveData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns the weapon that can result from evolving the given passive item.
     *
     * @param {PassiveId} id
     * @return {WeaponData|undefined}
     */
    this.getEvolution = id => {
        let evolutionId = VS.Item.getPassiveEvolutionMap()[id];
        if (evolutionId) {
            return VS.Weapon.get(evolutionId);
        }
    };

    /**
     * Returns a list of all passive item IDs.
     *
     * @return {PassiveId[]}
     */
    this.getIds = () => DATA.sortedIds;

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
