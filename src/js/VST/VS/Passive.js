/**
 * Functions related to Vampire Survivors passive items.
 */
VST.VS.Passive = new function () {
    const self = this;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {EntityData} PassiveData Data describing a passive item.
     * @property {string}      description
     * @property {string}      frameName     The filename of the passive item's image within the "items" sprite.
     * @property {PassiveId}   id            This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {number}      order         The order that this passive item is displayed in the in-game Collection.
     * @property {VsType}      type          The Passive Item type ID.
     * @property {PassiveVsId} vsId          The passive item's VS entity string ID.
     * @property {boolean}     [hidden]      Whether this passive item isn't shown as an option to put in builds.
     * @property {PassiveId[]} [reqPassives] The passive items required to get this passive item.
     * @property {WeaponId[]}  [reqWeapons]  The weapons required to get this passive item.
     */

    /** @typedef {EntityId} PassiveId A passive item's ID. */

    /** @typedef {VsId} PassiveVsId A passive item's VS entity string ID. */

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
            vsId: 'POWER',
        },
        [VS.PASSIVE_ID_ARMOR]: {
            name: 'Armor',
            description: 'Reduces incoming damage by 1. Increases retaliatory damage by 10%.',
            frameName: 'ArmorIron.png',
            order: 2,
            vsId: 'ARMOR',
        },
        [VS.PASSIVE_ID_HOLLOW_HEART]: {
            name: 'Hollow Heart',
            description: 'Augments max health by 20%.',
            frameName: 'HeartBlack.png',
            order: 3,
            vsId: 'MAXHEALTH',
        },
        [VS.PASSIVE_ID_PUMMAROLA]: {
            name: 'Pummarola',
            description: 'Character recovers 0.2 HP per second.',
            frameName: 'HeartRuby.png',
            order: 4,
            vsId: 'REGEN',
        },
        [VS.PASSIVE_ID_EMPTY_TOME]: {
            name: 'Empty Tome',
            description: 'Reduces weapons cooldown by 8%.',
            frameName: 'Book2.png',
            order: 5,
            vsId: 'COOLDOWN',
        },
        [VS.PASSIVE_ID_CANDELABRADOR]: {
            name: 'Candelabrador',
            description: 'Augments area of attacks by 10%.',
            frameName: 'Candelabra.png',
            order: 6,
            vsId: 'AREA',
        },
        [VS.PASSIVE_ID_BRACER]: {
            name: 'Bracer',
            description: 'Increases projectiles speed by 10%.',
            frameName: 'Gauntlet.png',
            order: 7,
            vsId: 'SPEED',
        },
        [VS.PASSIVE_ID_SPELLBINDER]: {
            name: 'Spellbinder',
            description: 'Increases duration of weapon effects by 10%.',
            frameName: 'EmblemEye.png',
            order: 8,
            vsId: 'DURATION',
        },
        [VS.PASSIVE_ID_DUPLICATOR]: {
            name: 'Duplicator',
            description: 'Weapons fire more projectiles.',
            frameName: 'Ring.png',
            order: 9,
            vsId: 'AMOUNT',
        },
        [VS.PASSIVE_ID_WINGS]: {
            name: 'Wings',
            description: 'Character moves 10% faster.',
            frameName: 'Wing.png',
            order: 10,
            vsId: 'MOVESPEED',
        },
        [VS.PASSIVE_ID_ATTRACTORB]: {
            name: 'Attractorb',
            description: 'Character pickups items from further away.',
            frameName: 'OrbGlow.png',
            order: 11,
            vsId: 'MAGNET',
        },
        [VS.PASSIVE_ID_CLOVER]: {
            name: 'Clover',
            description: 'Character gets 10% luckier.',
            frameName: 'Clover.png',
            order: 12,
            vsId: 'LUCK',
        },
        [VS.PASSIVE_ID_CROWN]: {
            name: 'Crown',
            description: 'Character gains 8% more experience.',
            frameName: 'Crown.png',
            order: 13,
            vsId: 'GROWTH',
        },
        [VS.PASSIVE_ID_STONE_MASK]: {
            name: 'Stone Mask',
            description: 'Character earns 10% more coins.',
            frameName: 'Mask.png',
            order: 14,
            vsId: 'GREED',
        },
        [VS.PASSIVE_ID_SKULL_O_MANIAC]: {
            name: 'Skull O\'Maniac',
            description: 'Increases enemy speed, health, quantity, and frequency by 10%.',
            frameName: 'Curse.png',
            order: 15,
            vsId: 'CURSE',
        },
        [VS.PASSIVE_ID_TIRAGISU]: {
            name: 'Tiragisú',
            description: 'Revives once with 50% health.',
            frameName: 'Tiramisu.png',
            order: 16,
            vsId: 'REVIVAL',
        },
        [VS.PASSIVE_ID_TORRONAS_BOX]: {
            name: 'Torrona\'s Box',
            description: 'Cursed item, but increases Might, Projectile Speed, Duration, and Area by 4%.',
            frameName: 'torrone.png',
            order: 17,
            vsId: 'PANDORA',
        },
        // Although these appear among the passive weapons in the in-game collection, they only come from the arcana,
        // and aren't needed to display in the build tool, so they're marked as hidden.
        [VS.PASSIVE_ID_CYGNUS]: {
            name: 'Cygnus',
            description: 'Bombards in a circling zone.',
            frameName: 'Silf1_counter.png',
            hidden: true,
            order: 18,
            vsId: 'SILF_COUNTER',
        },
        [VS.PASSIVE_ID_ZHAR_PTYTSIA]: {
            name: 'Zhar Ptytsia',
            description: 'Bombards in a circling zone.',
            frameName: 'Silf2_counter.png',
            hidden: true,
            order: 19,
            vsId: 'SILF2_COUNTER',
        },
        [VS.PASSIVE_ID_RED_MUSCLE]: {
            name: 'Red Muscle',
            description: 'Fires quickly in four fixed directions.',
            frameName: 'Guns_counter.png',
            hidden: true,
            order: 20,
            vsId: 'GUNS_COUNTER',
        },
        [VS.PASSIVE_ID_TWICE_UPON_A_TIME]: {
            name: 'Twice Upon a Time',
            description: 'Fires quickly in four fixed directions.',
            frameName: 'Guns2_counter.png',
            hidden: true,
            order: 21,
            vsId: 'GUNS2_COUNTER',
        },
        [VS.PASSIVE_ID_FLOCK_DESTROYER]: {
            name: 'Flock Destroyer',
            description: 'Summons capricious projectiles. Might interact with pickups.',
            frameName: 'Cat_counter.png',
            hidden: true,
            order: 22,
            vsId: 'GATTI_COUNTER',
        },
        [VS.PASSIVE_ID_SILVER_RING]: {
            name: 'Silver Ring',
            description: 'Wear ... Clock ...',
            frameName: 'silverring.png',
            order: 23,
            vsId: 'SILVER',
        },
        [VS.PASSIVE_ID_GOLD_RING]: {
            name: 'Gold Ring',
            description: '... With ... Lancet',
            frameName: 'goldring.png',
            order: 24,
            vsId: 'GOLD',
        },
        [VS.PASSIVE_ID_METAGLIO_LEFT]: {
            name: 'Metaglio Left',
            description: 'Channels dark powers to protect the bearer.',
            frameName: 'bsleft.png',
            order: 25,
            vsId: 'LEFT',
        },
        [VS.PASSIVE_ID_METAGLIO_RIGHT]: {
            name: 'Metaglio Right',
            description: 'Channels dark powers to curse the bearer.',
            frameName: 'bsright.png',
            order: 26,
            vsId: 'RIGHT',
        },
        [VS.PASSIVE_ID_SOLE_SOLUTION]: {
            name: 'Sole Solution',
            description: 'Gift of Victory Sword. The more enemies are defeated, the stronger it grows.',
            frameName: 'solesolution.png',
            order: 27,
            reqPassives: [VS.PASSIVE_ID_TORRONAS_BOX],
            reqWeapons: [VS.WEAPON_ID_VICTORY_SWORD],
            vsId: 'SOLES',
        },
    };

    /** @type {Object<DlcId, Array<{id: PassiveId, vsId: PassiveVsId}>>} The passive items from each DLC, in order. */
    const DLC_PASSIVES = {
        [VS.DLC_TIDES_OF_THE_FOSCARI]: [
            {id: VS.PASSIVE_ID_ACADEMY_BADGE, vsId: "ACADEMYBADGE"},
        ],
    };

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_PASSIVE;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Add any relevant passive-specific tooltip content to the given passive item tooltip.
     *
     * @param {HTMLDivElement} tooltip
     * @param {PassiveData}    passive
     */
    this.addTooltipContent = function (tooltip, passive) {
        VS.Item.addTooltipContent(tooltip, passive);
    };

    /**
     * Returns the passive item with the given ID.
     *
     * @param {PassiveId} id
     * @return {PassiveData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns the ID of the passive item with the given VS entity string ID, or undefined.
     *
     * @param {PassiveVsId} stringId
     * @return {WeaponId|undefined}
     */
    this.getIdByStringId = stringId => {
        let id = Object.keys(DATA).find(id => DATA[id].vsId === stringId);

        return id && parseInt(id) || undefined;
    };

    /**
     * Returns the weapon that can result from evolving the given passive item.
     *
     * @param {PassiveId} id
     * @return {Array<WeaponData>|undefined}
     */
    this.getEvolutions = id => {
        let evolutionIds = VS.Item.getPassiveEvolutionMap()[id];
        if (evolutionIds) {
            return evolutionIds.map(evolutionId => VS.Weapon.get(evolutionId));
        }
    };

    /**
     * Returns a list of all passive item IDs.
     *
     * When called during initialization, this may not be in the final order.
     *
     * @return {PassiveId[]}
     */
    this.getIds = () => VS.getSortedIds(DATA);

    /**
     * Import the given passive item data.
     *
     * @param {DlcId} dlc
     * @param {Object<PassiveVsId, Array<Object<string, *>>>} data
     */
    this.importDlcData = (dlc, data) => {
        const Weapon = VS.Weapon;

        // Find the highest order that's been used so far. The added data will increase from there.
        let order = 0;
        self.getIds().forEach(id => {
            order = Math.max(order, DATA[id].order);
        });

        /** @type {Object<PassiveVsId, PassiveVsId>} A map of base items to their evolutions. */
        (DLC_PASSIVES[dlc] || []).forEach(dlcPassive => {
            /** @type {Array<Object<string, *>>} Data from the DLC's JSON files. Base data, then level-up data. */
            let dlcData = data[dlcPassive.vsId];
            let baseData = dlcData[0];

            /** @type {PassiveData} */
            let passiveData = {
                name: baseData.name,
                description: baseData.description,
                dlc: dlc,
                frameName: baseData.frameName,
                id: dlcPassive.id,
                order: ++order,
                type: TYPE,
                vsId: dlcPassive.vsId,
            };

            if (baseData.evolvesFrom && baseData.evolvesFrom.length) {
                passiveData.reqWeapons = [];
                baseData.evolvesFrom.forEach(fromVsId => {
                    passiveData.reqWeapons.push(Weapon.getIdByStringId(fromVsId));
                });
            }

            if (baseData.requires && baseData.requires.length) {
                passiveData.reqPassives = [];
                baseData.requires.forEach(fromVsId => {
                    passiveData.reqPassives.push(self.getIdByStringId(fromVsId));
                });
            }

            DATA[dlcPassive.id] = passiveData;
        });
    };

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
