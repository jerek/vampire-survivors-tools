/**
 * Functions related to Vampire Survivors weapons.
 */
VST.VS.Weapon = new function () {
    const self = this;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {EntityData} WeaponData Data describing a weapon.
     * @property {string}      description
     * @property {string}      frameName     The filename of the weapon's image within the "items" sprite.
     * @property {WeaponId}    id            This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {number}      order         The order that this weapon is displayed in the in-game Collection.
     * @property {VsType}      type          The Weapon type ID.
     * @property {PassiveId[]} [reqPassives] The passive items required to get this evolved weapon.
     * @property {WeaponId[]}  [reqWeapons]  The weapons required to get this evolved weapon.
     */

    /** @typedef {EntityId} WeaponId A weapon's ID. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // noinspection JSValidateTypes Types and IDs are filled during initialization, so ignore warnings here.
    /**
     * @type {Object<WeaponId, WeaponData>} A custom representation of the game's weapon data.
     * @property {WeaponId[]} sortedIds
     */
    const DATA = {
        [VS.WEAPON_ID_WHIP]: {
            name: 'Whip',
            description: 'Attacks horizontally, passes through enemies.',
            frameName: 'Whip.png',
            order: 1,
        },
        [VS.WEAPON_ID_BLOODY_TEAR]: {
            name: 'Bloody Tear',
            description: 'Evolved Whip. Can deal critical damage and absorb HP.',
            frameName: 'Whip2.png',
            order: 2,
            reqPassives: [VS.PASSIVE_ID_HOLLOW_HEART],
            reqWeapons: [VS.WEAPON_ID_WHIP],
        },
        [VS.WEAPON_ID_MAGIC_WAND]: {
            name: 'Magic Wand',
            description: 'Fires at the nearest enemy.',
            frameName: 'WandHoly.png',
            order: 3,
        },
        [VS.WEAPON_ID_HOLY_WAND]: {
            name: 'Holy Wand',
            description: 'Evolved Magic Wand. Fires with no delay.',
            frameName: 'WandHoly2.png',
            order: 4,
            reqPassives: [VS.PASSIVE_ID_EMPTY_TOME],
            reqWeapons: [VS.WEAPON_ID_MAGIC_WAND],
        },
        [VS.WEAPON_ID_KNIFE]: {
            name: 'Knife',
            description: 'Fires quickly in the faced direction.',
            frameName: 'Knife.png',
            order: 5,
        },
        [VS.WEAPON_ID_THOUSAND_EDGE]: {
            name: 'Thousand Edge',
            description: 'Evolved Knife. Fires with no delay.',
            frameName: 'Knife2.png',
            order: 6,
            reqPassives: [VS.PASSIVE_ID_BRACER],
            reqWeapons: [VS.WEAPON_ID_KNIFE],
        },
        [VS.WEAPON_ID_AXE]: {
            name: 'Axe',
            description: 'High damage, high Area scaling.',
            frameName: 'Axe.png',
            order: 7,
        },
        [VS.WEAPON_ID_DEATH_SPIRAL]: {
            name: 'Death Spiral',
            description: 'Evolved Axe. Passes through enemies.',
            frameName: 'Scythe.png',
            order: 8,
            reqPassives: [VS.PASSIVE_ID_CANDELABRADOR],
            reqWeapons: [VS.WEAPON_ID_AXE],
        },
        [VS.WEAPON_ID_CROSS]: {
            name: 'Cross',
            description: 'Aims at nearest enemy, has boomerang effect.',
            frameName: 'Cross.png',
            order: 9,
        },
        [VS.WEAPON_ID_HEAVEN_SWORD]: {
            name: 'Heaven Sword',
            description: 'Evolved Cross. Can deal critical damage.',
            frameName: 'HeavenSword.png',
            order: 10,
            reqPassives: [VS.PASSIVE_ID_CLOVER],
            reqWeapons: [VS.WEAPON_ID_CROSS],
        },
        [VS.WEAPON_ID_KING_BIBLE]: {
            name: 'King Bible',
            description: 'Orbits around the character.',
            frameName: 'HolyBook.png',
            order: 11,
        },
        [VS.WEAPON_ID_UNHOLY_VESPERS]: {
            name: 'Unholy Vespers',
            description: 'Evolved King Bible. Never ends.',
            frameName: 'UnholyBook.png',
            order: 12,
            reqPassives: [VS.PASSIVE_ID_SPELLBINDER],
            reqWeapons: [VS.WEAPON_ID_KING_BIBLE],
        },
        [VS.WEAPON_ID_FIRE_WAND]: {
            name: 'Fire Wand',
            description: 'Fires at a random enemy, deals heavy damage.',
            frameName: 'WandFire.png',
            order: 13,
        },
        [VS.WEAPON_ID_HELLFIRE]: {
            name: 'Hellfire',
            description: 'Evolved Fire Wand. Passes through enemies.',
            frameName: 'Hellfire.png',
            order: 14,
            reqPassives: [VS.PASSIVE_ID_SPINACH],
            reqWeapons: [VS.WEAPON_ID_FIRE_WAND],
        },
        [VS.WEAPON_ID_GARLIC]: {
            name: 'Garlic',
            description: 'Damages nearby enemies. Reduces resistance to knockback and freeze.',
            frameName: 'Garlic.png',
            order: 15,
        },
        [VS.WEAPON_ID_SOUL_EATER]: {
            name: 'Soul Eater',
            description: 'Evolved Garlic. Steals hearts. Power increases when recovering HP.',
            frameName: 'OrbOrange.png',
            order: 16,
            reqPassives: [VS.PASSIVE_ID_PUMMAROLA],
            reqWeapons: [VS.WEAPON_ID_GARLIC],
        },
        [VS.WEAPON_ID_SANTA_WATER]: {
            name: 'Santa Water',
            description: 'Generates damaging zones.',
            frameName: 'HolyWater.png',
            order: 17,
        },
        [VS.WEAPON_ID_LA_BORRA]: {
            name: 'La Borra',
            description: 'Evolved Santa Water. Damaging zones follow you and grow when they move.',
            frameName: 'Water2.png',
            order: 18,
            reqPassives: [VS.PASSIVE_ID_ATTRACTORB],
            reqWeapons: [VS.WEAPON_ID_SANTA_WATER],
        },
        [VS.WEAPON_ID_RUNETRACER]: {
            name: 'Runetracer',
            description: 'Passes through enemies, bounces around.',
            frameName: 'Diamond2.png',
            order: 19,
        },
        [VS.WEAPON_ID_NO_FUTURE]: {
            name: 'NO FUTURE',
            description: 'Evolved Runetracer. Explodes when bouncing and in retaliation.',
            frameName: 'Carnage.png',
            order: 20,
            reqPassives: [VS.PASSIVE_ID_ARMOR],
            reqWeapons: [VS.WEAPON_ID_RUNETRACER],
        },
        [VS.WEAPON_ID_LIGHTNING_RING]: {
            name: 'Lightning Ring',
            description: 'Strikes at random enemies.',
            frameName: 'LighningRing.png',
            order: 21,
        },
        [VS.WEAPON_ID_THUNDER_LOOP]: {
            name: 'Thunder Loop',
            description: 'Evolved Lightning Ring. Projectiles strike twice.',
            frameName: 'Thunderloop.png',
            order: 22,
            reqPassives: [VS.PASSIVE_ID_DUPLICATOR],
            reqWeapons: [VS.WEAPON_ID_LIGHTNING_RING],
        },
        [VS.WEAPON_ID_PENTAGRAM]: {
            name: 'Pentagram',
            description: 'Erases everything in sight.',
            frameName: 'Pentagram.png',
            order: 23,
        },
        [VS.WEAPON_ID_GORGEOUS_MOON]: {
            name: 'Gorgeous Moon',
            description: 'Evolved Pentagram. Generates extra gems and gathers all of them.',
            frameName: 'Pentagram2.png',
            order: 24,
            reqPassives: [VS.PASSIVE_ID_CROWN],
            reqWeapons: [VS.WEAPON_ID_PENTAGRAM],
        },
        [VS.WEAPON_ID_PEACHONE]: {
            name: 'Peachone',
            description: 'Bombards in a circling zone.',
            frameName: 'Silf1.png',
            order: 25,
        },
        [VS.WEAPON_ID_EBONY_WINGS]: {
            name: 'Ebony Wings',
            description: 'Bombards in a circling zone.',
            frameName: 'Silf2.png',
            order: 26,
        },
        [VS.WEAPON_ID_VANDALIER]: {
            name: 'Vandalier',
            description: 'Union of Ebony Wings and Peachone.',
            frameName: 'Silf3.png',
            order: 27,
            reqWeapons: [VS.WEAPON_ID_PEACHONE, VS.WEAPON_ID_EBONY_WINGS],
        },
        [VS.WEAPON_ID_PHIERA_DER_TUPHELLO]: {
            name: 'Phiera Der Tuphello',
            description: 'Fires quickly in four fixed directions.',
            frameName: 'Guns.png',
            order: 28,
        },
        [VS.WEAPON_ID_EIGHT_THE_SPARROW]: {
            name: 'Eight The Sparrow',
            description: 'Fires quickly in four fixed directions.',
            frameName: 'Guns2.png',
            order: 29,
        },
        [VS.WEAPON_ID_PHIERAGGI]: {
            name: 'Phieraggi',
            description: 'Union of Phiera Der Tuphello and Eight The Sparrow. Scales with Revivals.',
            frameName: 'Guns3.png',
            order: 30,
            reqPassives: [VS.PASSIVE_ID_TIRAGISU],
            reqWeapons: [VS.WEAPON_ID_PHIERA_DER_TUPHELLO, VS.WEAPON_ID_EIGHT_THE_SPARROW],
        },
        [VS.WEAPON_ID_GATTI_AMARI]: {
            name: 'Gatti Amari',
            description: 'Summons capricious projectiles. Might interact with pickups.',
            frameName: 'Cat.png',
            order: 31,
        },
        [VS.WEAPON_ID_VICIOUS_HUNGER]: {
            name: 'Vicious Hunger',
            description: 'Evolved Gatti Amari. Might turn anything into gold.',
            frameName: 'cateye.png',
            order: 32,
            reqPassives: [VS.PASSIVE_ID_STONE_MASK],
            reqWeapons: [VS.WEAPON_ID_GATTI_AMARI],
        },
        [VS.WEAPON_ID_SONG_OF_MANA]: {
            name: 'Song Of Mana',
            description: 'Attacks vertically, passes through enemies.',
            frameName: 'Song.png',
            order: 33,
        },
        [VS.WEAPON_ID_MANNAJJA]: {
            name: 'Mannajja',
            description: 'Evolved Song of Mana. Might slow enemies down.',
            frameName: 'Song2.png',
            order: 34,
            reqPassives: [VS.PASSIVE_ID_SKULL_O_MANIAC],
            reqWeapons: [VS.WEAPON_ID_SONG_OF_MANA],
        },
        [VS.WEAPON_ID_SHADOW_PINION]: {
            name: 'Shadow Pinion',
            description: 'Generates damaging zones when moving, strikes when stopping.',
            frameName: 'trapano.png',
            order: 35,
        },
        [VS.WEAPON_ID_VALKYRIE_TURNER]: {
            name: 'Valkyrie Turner',
            description: 'Evolved Shadow Pinion. Bigger, longer, faster, stronger.',
            frameName: 'trapano2.png',
            order: 36,
            reqPassives: [VS.PASSIVE_ID_WINGS],
            reqWeapons: [VS.WEAPON_ID_SHADOW_PINION],
        },
        [VS.WEAPON_ID_CLOCK_LANCET]: {
            name: 'Clock Lancet',
            description: 'Chance to freeze enemies in time.',
            frameName: 'Lancet.png',
            order: 37,
        },
        [VS.WEAPON_ID_INFINITE_CORRIDOR]: {
            name: 'Infinite Corridor',
            description: 'Evolved Clock Lancet. Halves enemies health.',
            frameName: 'portal.png',
            order: 38,
            reqPassives: [VS.PASSIVE_ID_SILVER_RING, VS.PASSIVE_ID_GOLD_RING],
            reqWeapons: [VS.WEAPON_ID_CLOCK_LANCET],
        },
        [VS.WEAPON_ID_LAUREL]: {
            name: 'Laurel',
            description: 'Shields from damage when active.',
            frameName: 'Laurel.png',
            order: 39,
        },
        [VS.WEAPON_ID_CRIMSON_SHROUD]: {
            name: 'Crimson Shroud',
            description: 'Evolved Laurel. Caps incoming damage at 10. Retaliates when losing charges.',
            frameName: 'cape.png',
            order: 40,
            reqPassives: [VS.PASSIVE_ID_METAGLIO_LEFT, VS.PASSIVE_ID_METAGLIO_RIGHT],
            reqWeapons: [VS.WEAPON_ID_LAUREL],
        },
        [VS.WEAPON_ID_VENTO_SACRO]: {
            name: 'Vento Sacro',
            description: 'Stronger with continuous movement. Can deal critical damage.',
            frameName: 'Whip3.png',
            order: 41,
        },
        [VS.WEAPON_ID_FUWALAFUWALOO]: {
            name: 'Fuwalafuwaloo',
            description: 'Union of Vento Sacro and Bloody Tear. Critical hits might generate explosions.',
            frameName: 'Whip4.png',
            order: 42,
            reqWeapons: [VS.WEAPON_ID_VENTO_SACRO, VS.WEAPON_ID_BLOODY_TEAR],
        },
        [VS.WEAPON_ID_BONE]: {
            name: 'Bone',
            description: 'Throws a bouncing projectile.',
            frameName: 'Bone.png',
            order: 43,
        },
        [VS.WEAPON_ID_CHERRY_BOMB]: {
            name: 'Cherry Bomb',
            description: 'Throws a bouncing projectile. Explodes, sometimes.',
            frameName: 'Cherry.png',
            order: 44,
        },
        [VS.WEAPON_ID_CARRELLO]: {
            name: 'Carréllo',
            description: 'Throws a bouncing projectile. Number of bounces affected by Amount.',
            frameName: 'CartWheel.png',
            order: 45,
        },
        [VS.WEAPON_ID_CELESTIAL_DUSTING]: {
            name: 'Celestial Dusting',
            description: 'Throws a bouncing projectile. Cooldown reduces when moving.',
            frameName: 'flower.png',
            order: 46,
        },
        [VS.WEAPON_ID_LA_ROBBA]: {
            name: 'La Robba',
            description: 'Generates bouncing projectiles.',
            frameName: 'larobba.png',
            order: 47,
        },
    };

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_WEAPON;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Add any relevant weapon-specific tooltip content to the given weapon tooltip.
     *
     * @param {HTMLDivElement} tooltip
     * @param {WeaponData}     weapon
     */
    this.addTooltipContent = function (tooltip, weapon) {
        VS.Item.addTooltipContent(tooltip, weapon);
    };

    /**
     * Returns the weapon with the given ID.
     *
     * @param {WeaponId} id
     * @return {WeaponData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns all weapons that can result from evolving the given weapon.
     *
     * @param {WeaponId} id
     * @return {WeaponData[]}
     */
    this.getAllEvolutions = id => {
        let weaponEvolutionMap = VS.Item.getWeaponEvolutionMap();
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
        let evolutionId = VS.Item.getWeaponEvolutionMap()[id];
        if (evolutionId) {
            return self.get(evolutionId);
        }
    };

    /**
     * Returns a list of all weapon IDs.
     *
     * @return {WeaponId[]}
     */
    this.getIds = () => DATA.sortedIds;

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
