/**
 * Contains game data and provides functions for retrieving it.
 */
VST.Data = new function () {
    const Util = VST.Util;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} ArcanaData Data describing an arcana.
     * @property {string}   description
     * @property {ArcanaId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}   name
     */

    /** @typedef {number} ArcanaId An arcana's ID. */

    /**
     * @typedef {Object} CharacterData Data describing a character.
     * @property {CharacterId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name        The character's common name.
     * @property {string}      description
     * @property {WeaponId[]}  weaponIds
     * @property {string}      [prefix]    Text shown before the character's name when showing their full name.
     * @property {string}      [surname]   Text shown after the character's name when showing their full name.
     */

    /** @typedef {number} CharacterId A character's ID. */

    /**
     * @typedef {Object} PassiveData Data describing a passive item.
     * @property {string}    description
     * @property {PassiveId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}    name
     * @property {number}    order       The order that this passive item is displayed in the in-game Collection.
     */

    /** @typedef {number} PassiveId A passive item's ID. */

    /**
     * @typedef {Object} StageData Data describing a stage.
     * @property {string}      description
     * @property {StageId}     id             This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {number}      order          The order that this stage is displayed when starting a run.
     * @property {PassiveId[]} passives       The passive items that can be found on the stage.
     * @property {boolean}     [hideFromTool] Whether to hide this stage when selecting a stage for a build.
     */

    /** @typedef {number} StageId A stage's ID. */

    /**
     * @typedef {Object} WeaponData Data describing a weapon.
     * @property {string}      description
     * @property {WeaponId}    id            This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {number}      order         The order that this weapon is displayed in the in-game Collection.
     * @property {PassiveId[]} [reqPassives] The passive items required to get this evolved weapon.
     * @property {WeaponId[]}  [reqWeapons]  The weapons required to get this evolved weapon.
     */

    /** @typedef {number} WeaponId A weapon's ID. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // === //
    // IDS //
    // === //

    // Passive Items have constants since they're referred to by ID in multiple places.
    /** @type {PassiveId} */ const PASSIVE_ID_SPINACH = 1;
    /** @type {PassiveId} */ const PASSIVE_ID_ARMOR = 2;
    /** @type {PassiveId} */ const PASSIVE_ID_HOLLOW_HEART = 3;
    /** @type {PassiveId} */ const PASSIVE_ID_PUMMAROLA = 4;
    /** @type {PassiveId} */ const PASSIVE_ID_EMPTY_TOME = 5;
    /** @type {PassiveId} */ const PASSIVE_ID_CANDELABRADOR = 6;
    /** @type {PassiveId} */ const PASSIVE_ID_BRACER = 7;
    /** @type {PassiveId} */ const PASSIVE_ID_SPELLBINDER = 8;
    /** @type {PassiveId} */ const PASSIVE_ID_DUPLICATOR = 9;
    /** @type {PassiveId} */ const PASSIVE_ID_WINGS = 10;
    /** @type {PassiveId} */ const PASSIVE_ID_ATTRACTORB = 11;
    /** @type {PassiveId} */ const PASSIVE_ID_CLOVER = 12;
    /** @type {PassiveId} */ const PASSIVE_ID_CROWN = 13;
    /** @type {PassiveId} */ const PASSIVE_ID_STONE_MASK = 14;
    /** @type {PassiveId} */ const PASSIVE_ID_SKULL_O_MANIAC = 15;
    /** @type {PassiveId} */ const PASSIVE_ID_TIRAGISU = 16;
    /** @type {PassiveId} */ const PASSIVE_ID_SILVER_RING = 17;
    /** @type {PassiveId} */ const PASSIVE_ID_GOLD_RING = 18;
    /** @type {PassiveId} */ const PASSIVE_ID_METAGLIO_LEFT = 19;
    /** @type {PassiveId} */ const PASSIVE_ID_METAGLIO_RIGHT = 20;
    /** @type {PassiveId} */ const PASSIVE_ID_TORRONAS_BOX = 21;

    // Weapons have constants since they're referred to by ID in multiple places.
    /** @type {WeaponId} */ const WEAPON_ID_WHIP = 1;
    /** @type {WeaponId} */ const WEAPON_ID_BLOODY_TEAR = 2;
    /** @type {WeaponId} */ const WEAPON_ID_MAGIC_WAND = 3;
    /** @type {WeaponId} */ const WEAPON_ID_HOLY_WAND = 4;
    /** @type {WeaponId} */ const WEAPON_ID_KNIFE = 5;
    /** @type {WeaponId} */ const WEAPON_ID_THOUSAND_EDGE = 6;
    /** @type {WeaponId} */ const WEAPON_ID_AXE = 7;
    /** @type {WeaponId} */ const WEAPON_ID_DEATH_SPIRAL = 8;
    /** @type {WeaponId} */ const WEAPON_ID_CROSS = 9;
    /** @type {WeaponId} */ const WEAPON_ID_HEAVEN_SWORD = 10;
    /** @type {WeaponId} */ const WEAPON_ID_KING_BIBLE = 11;
    /** @type {WeaponId} */ const WEAPON_ID_UNHOLY_VESPERS = 12;
    /** @type {WeaponId} */ const WEAPON_ID_FIRE_WAND = 13;
    /** @type {WeaponId} */ const WEAPON_ID_HELLFIRE = 14;
    /** @type {WeaponId} */ const WEAPON_ID_GARLIC = 15;
    /** @type {WeaponId} */ const WEAPON_ID_SOUL_EATER = 16;
    /** @type {WeaponId} */ const WEAPON_ID_SANTA_WATER = 17;
    /** @type {WeaponId} */ const WEAPON_ID_LA_BORRA = 18;
    /** @type {WeaponId} */ const WEAPON_ID_RUNETRACER = 19;
    /** @type {WeaponId} */ const WEAPON_ID_NO_FUTURE = 20;
    /** @type {WeaponId} */ const WEAPON_ID_LIGHTNING_RING = 21;
    /** @type {WeaponId} */ const WEAPON_ID_THUNDER_LOOP = 22;
    /** @type {WeaponId} */ const WEAPON_ID_PENTAGRAM = 23;
    /** @type {WeaponId} */ const WEAPON_ID_GORGEOUS_MOON = 24;
    /** @type {WeaponId} */ const WEAPON_ID_PEACHONE = 25;
    /** @type {WeaponId} */ const WEAPON_ID_EBONY_WINGS = 26;
    /** @type {WeaponId} */ const WEAPON_ID_VANDALIER = 27;
    /** @type {WeaponId} */ const WEAPON_ID_PHIERA_DER_TUPHELLO = 28;
    /** @type {WeaponId} */ const WEAPON_ID_EIGHT_THE_SPARROW = 29;
    /** @type {WeaponId} */ const WEAPON_ID_PHIERAGGI = 30;
    /** @type {WeaponId} */ const WEAPON_ID_GATTI_AMARI = 31;
    /** @type {WeaponId} */ const WEAPON_ID_VICIOUS_HUNGER = 32;
    /** @type {WeaponId} */ const WEAPON_ID_SONG_OF_MANA = 33;
    /** @type {WeaponId} */ const WEAPON_ID_MANNAJJA = 34;
    /** @type {WeaponId} */ const WEAPON_ID_SHADOW_PINION = 35;
    /** @type {WeaponId} */ const WEAPON_ID_VALKYRIE_TURNER = 36;
    /** @type {WeaponId} */ const WEAPON_ID_CLOCK_LANCET = 37;
    /** @type {WeaponId} */ const WEAPON_ID_INFINITE_CORRIDOR = 38;
    /** @type {WeaponId} */ const WEAPON_ID_LAUREL = 39;
    /** @type {WeaponId} */ const WEAPON_ID_CRIMSON_SHROUD = 40;
    /** @type {WeaponId} */ const WEAPON_ID_VENTO_SACRO = 41;
    /** @type {WeaponId} */ const WEAPON_ID_FUWALAFUWALOO = 42;
    /** @type {WeaponId} */ const WEAPON_ID_BONE = 43;
    /** @type {WeaponId} */ const WEAPON_ID_CHERRY_BOMB = 44;
    /** @type {WeaponId} */ const WEAPON_ID_CARRELLO = 45;
    /** @type {WeaponId} */ const WEAPON_ID_CELESTIAL_DUSTING = 46;

    // =========== //
    // DATA STORES //
    // =========== //

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<ArcanaId, ArcanaData>} A custom representation of the game's arcana data. */
    const ARCANAS = {
        // 0: {name: 'Killer', description: '???'}, // If this is actually added, it'll need a different ID.
        // 1: {name: 'Aquarius', description: '???'},
        // 2: {name: '???', description: '???'},
        // 3: {name: 'Tragic', description: '???'},
        4: {
            name: 'IV - Awake',
            description: 'Gives +3 Revivals. Consuming a Revival gives +10% MaxHealth, +1 Armor, and +5% Might, ' +
                'Area, Duration, and Speed.',
        },
        5: {
            name: 'V - Chaos in the Dark Night',
            description: 'Overall projectile Speed continuously changes between -50% and +200% over 10 seconds.',
        },
        6: {
            name: 'VI - Sarabande of Healing',
            description: 'Healing is doubled. Recovering HP damages nearby enemies for the same amount.',
        },
        7: {
            name: 'VII - Iron Blue Will',
            description: 'Listed weapon projectiles gain up to 3 bounces and might pass through enemies and walls.',
        },
        8: {
            name: 'VIII - Mad Groove',
            description: 'Every 2 minutes attracts all standard stage items, pickups, and light sources towards the ' +
                'character.',
        },
        // 9: {name: '???', description: '???'},
        10: {
            name: 'X - Beginning',
            description: 'Listed weapons get +1 Amount. The character\'s main weapon and its evolution gain +3 ' +
                'Amount instead.',
        },
        11: {
            name: 'XI - Waltz of Pearls',
            description: 'Listed weapon projectiles gain up to 3 bounces.',
        },
        12: {
            name: 'XII - Out of Bounds',
            description: 'Freezing enemies generates explosions. Orologions are easier to find.',
        },
        // 13: {name: '???', description: '???'},
        14: {
            name: 'XIV - Jail of Crystal',
            description: 'Listed weapon projectiles have a chance to freeze enemies.',
        },
        15: {
            name: 'XV - Disco of Gold',
            description: 'Picking up coin bags from the floor triggers Gold Fever. Obtaining gold restores as many HP.',
        },
        16: {
            name: 'XVI - Slash',
            description: 'Enables critical hits for listed weapons. Doubles overall critical damage.',
        },
        17: {
            name: 'XVII - Lost & Found Painting',
            description: 'Overall Duration continuously changes between -50% and +200% over 10 seconds.',
        },
        18: {
            name: 'XVIII - Boogaloo of Illusions',
            description: 'Overall Area continuously changes between -25% and +50% over 10 seconds.',
        },
        19: {
            name: 'XIX - Heart of Fire',
            description: 'Listed weapon projectiles explode on impact. Light sources explode. Character explodes ' +
                'when damaged.',
        },
        // 20: {name: 'Sinking', description: '???'},
        // 21: {name: 'Bloody', description: '???'},
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<CharacterId, CharacterData>} A custom representation of the game's character data. This includes
     *  a lot of odd character data that is represented how I found it in the game data. For example, there are seven
     *  characters named "LATODISOTTO", which are not all identical. Some of the odd character data includes manual key
     *  strings that appear to contain what's intended to eventually be the name of a character in that slot, which I've
     *  carried over in the description fields. */
    const CHARACTERS = {
        1: {
            name: 'Antonio',
            surname: 'Belpaese',
            description: 'Gains 10% more damage every 10 levels (max +50%).',
            weaponIds: [WEAPON_ID_WHIP],
        },
        2: {
            name: 'Imelda',
            surname: 'Belpaese',
            description: 'Gains 10% more experience every 5 levels (max +30%).',
            weaponIds: [WEAPON_ID_MAGIC_WAND],
        },
        3: {
            name: 'Pasqualina',
            surname: 'Belpaese',
            description: 'Projectiles get 10% faster every 5 levels (max +30%).',
            weaponIds: [WEAPON_ID_RUNETRACER],
        },
        4: {
            name: 'Gennaro',
            surname: 'Belpaese',
            description: 'Permanent +1 projectile (all weapons).',
            weaponIds: [WEAPON_ID_KNIFE],
        },
        5: {
            name: 'Arca',
            surname: 'Ladonna',
            description: 'Weapon cooldown is reduced by 5% every 10 levels (max -15%).',
            weaponIds: [WEAPON_ID_FIRE_WAND],
        },
        6: {
            name: 'Porta',
            surname: 'Ladonna',
            description: 'Permanent +30% area. Starts with temporary cooldown bonus.',
            weaponIds: [WEAPON_ID_LIGHTNING_RING],
        },
        7: {
            name: 'Lama',
            surname: 'Ladonna',
            description: 'Gains +5% Might, MoveSpeed, and Curse every 10 levels (max +20%).',
            weaponIds: [WEAPON_ID_AXE],
        },
        8: {
            name: 'Poe',
            surname: 'Ratcho',
            description: 'Permanent +25% pickup radius and -30 max health.',
            weaponIds: [WEAPON_ID_GARLIC],
        },
        9: {
            name: 'Clerici',
            description: 'Permanent +0.5 HP/s and +50 Max Health. Starts with temporary area bonus.',
            prefix: 'Suor',
            weaponIds: [WEAPON_ID_SANTA_WATER],
        },
        10: {
            name: 'Dommario',
            description: 'Permanent +40% duration and speed, -40% move speed.',
            weaponIds: [WEAPON_ID_KING_BIBLE],
        },
        11: {
            name: 'Krochi',
            surname: 'Freetto',
            description: 'Starts with 1 Revival. Gains 1 more Revival at level 33.',
            weaponIds: [PASSIVE_ID_CLOVER],
        },
        12: {
            name: 'Christine',
            surname: 'Davain',
            description: 'Starts with 1 extra level.',
            weaponIds: [WEAPON_ID_PENTAGRAM],
        },
        13: {
            name: 'Pugnala',
            surname: 'Provola',
            description: 'Gains +1% Might every level.',
            weaponIds: [WEAPON_ID_PHIERA_DER_TUPHELLO, WEAPON_ID_EIGHT_THE_SPARROW],
        },
        14: {
            name: 'Giovanna',
            surname: 'Grana',
            description: 'Gains +1% Projectile Speed every level.',
            weaponIds: [WEAPON_ID_GATTI_AMARI],
        },
        15: {
            name: 'Poppea',
            surname: 'Pecorina',
            description: 'Gains +1% Duration every level.',
            weaponIds: [WEAPON_ID_SONG_OF_MANA],
        },
        16: {
            name: 'Concetta',
            surname: 'Caciotta',
            description: 'Gains +1% Area every level.',
            weaponIds: [WEAPON_ID_SHADOW_PINION],
        },
        17: {
            name: 'Mortaccio',
            description: 'Gets more projectiles every 20 levels (max+3).',
            weaponIds: [WEAPON_ID_BONE],
        },
        18: {
            name: 'Cavallo',
            description: 'Gets more projectiles every 20 levels (max+3).',
            prefix: 'Yatta',
            weaponIds: [WEAPON_ID_CHERRY_BOMB],
        },
        19: {
            name: 'Ramba',
            description: 'Gets more projectiles every 20 levels (max+3).',
            prefix: 'Bianca',
            weaponIds: [WEAPON_ID_CARRELLO],
        },
        20: {
            name: 'O\'Sole',
            surname: 'Meeo',
            description: 'Gets more projectiles every 20 levels (max+3).',
            weaponIds: [WEAPON_ID_CELESTIAL_DUSTING],
        },
        21: {
            name: 'Gallo',
            surname: 'Valletto',
            description: 'Starts with 1 extra level. Gains +10% Growth every 5 levels (max +50%).',
            prefix: 'Iguana',
            weaponIds: [WEAPON_ID_CLOCK_LANCET],
        },
        // 22: {name: 'LATODISOTTO', description: 'LATOEVEST', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 23: {name: 'LATOEVEST  ', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 24: {name: 'LATODILATO ', description: 'MARIANNA', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 25: {name: 'LATOEVEST  ', description: 'SIGMA', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        26: {
            name: 'Divano',
            surname: 'Thelma',
            description: 'Starts with 1 extra level. Gains +1 Armor every 5 levels (max +5).',
            weaponIds: [WEAPON_ID_LAUREL],
        },
        27: {
            name: 'Zi\'Assunta',
            surname: 'Belpaese',
            description: 'Gains +0.5% Might, projectile Speed, Duration, and Area every level.',
            weaponIds: [WEAPON_ID_VENTO_SACRO],
        },
        // 28: {name: 'LATODISOPRO', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 29: {name: 'LATODISOTTO', description: 'ODDEEO', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 30: {name: 'LATODISOTTO', description: 'VOID', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 31: {name: 'LATODILATO ', description: 'RED', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 32: {name: '', description: 'IOLO', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        33: {
            name: 'Exdash',
            surname: 'Exiviiq',
            description: 'At least they\'re lucky.',
            weaponIds: [WEAPON_ID_EBONY_WINGS],
        },
        34: {
            name: 'Toastie',
            description: 'So much potential.',
            weaponIds: [WEAPON_ID_PEACHONE],
        },
        35: {
            name: 'Smith',
            surname: 'IV',
            description: 'The quirky white bear.',
            weaponIds: [WEAPON_ID_VANDALIER],
        },
        36: {
            name: 'Marrabbio',
            description: '',
            prefix: 'Boon',
            weaponIds: [WEAPON_ID_THOUSAND_EDGE],
        },
        // 37: {name: 'LATODILATO ', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 38: {name: 'LATODISOTTO', description: 'FINO', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 39: {name: 'LATODILATO ', description: 'LATODILATO', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        40: {
            name: 'Minnah',
            surname: 'Mannarah',
            description: 'Might, projectile Speed, Duration, Area, and Cooldown change every minute.',
            weaponIds: [WEAPON_ID_BLOODY_TEAR],
        },
        41: {
            name: 'Leda',
            description: '',
            weaponIds: [WEAPON_ID_HOLY_WAND],
        },
        42: {
            name: 'Red Death',
            description: 'A blasphemous mockery.',
            prefix: 'Mask of the',
            weaponIds: [WEAPON_ID_DEATH_SPIRAL],
        },
        // 43: {name: 'LATODISOTTO', description: 'DEATH', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 44: {name: 'LATODILATO ', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 45: {name: 'LATODISOTTO', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 46: {name: 'LATOEVEST  ', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 47: {name: 'LATODISOTTO', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 48: {name: 'LATOEVEST  ', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 49: {name: 'LATODILATO ', description: 'PENTA', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 50: {name: 'LATODILATO ', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 51: {name: 'LATODILATO ', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
        // 52: {name: 'LATODISOPRO', description: '', weaponIds: [PASSIVE_ID_DUPLICATOR]},
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<PassiveId, PassiveData>} A custom representation of the game's passive item data. */
    const PASSIVES = {
        [PASSIVE_ID_SPINACH]: {
            name: 'Spinach',
            description: 'Raises inflicted damage by 10%.',
            order: 1,
        },
        [PASSIVE_ID_ARMOR]: {
            name: 'Armor',
            description: 'Reduces incoming damage by 1. Increases retaliatory damage by 10%.',
            order: 2,
        },
        [PASSIVE_ID_HOLLOW_HEART]: {
            name: 'Hollow Heart',
            description: 'Augments max health by 20%.',
            order: 3,
        },
        [PASSIVE_ID_PUMMAROLA]: {
            name: 'Pummarola',
            description: 'Character recovers 0.2 HP per second.',
            order: 4,
        },
        [PASSIVE_ID_EMPTY_TOME]: {
            name: 'Empty Tome',
            description: 'Reduces weapons cooldown by 8%.',
            order: 5,
        },
        [PASSIVE_ID_CANDELABRADOR]: {
            name: 'Candelabrador',
            description: 'Augments area of attacks by 10%.',
            order: 6,
        },
        [PASSIVE_ID_BRACER]: {
            name: 'Bracer',
            description: 'Increases projectiles speed by 10%.',
            order: 7,
        },
        [PASSIVE_ID_SPELLBINDER]: {
            name: 'Spellbinder',
            description: 'Increases duration of weapon effects by 10%.',
            order: 8,
        },
        [PASSIVE_ID_DUPLICATOR]: {
            name: 'Duplicator',
            description: 'Weapons fire more projectiles.',
            order: 9,
        },
        [PASSIVE_ID_WINGS]: {
            name: 'Wings',
            description: 'Character moves 10% faster.',
            order: 10,
        },
        [PASSIVE_ID_ATTRACTORB]: {
            name: 'Attractorb',
            description: 'Character pickups items from further away.',
            order: 11,
        },
        [PASSIVE_ID_CLOVER]: {
            name: 'Clover',
            description: 'Character gets 10% luckier.',
            order: 12,
        },
        [PASSIVE_ID_CROWN]: {
            name: 'Crown',
            description: 'Character gains 8% more experience.',
            order: 13,
        },
        [PASSIVE_ID_STONE_MASK]: {
            name: 'Stone Mask',
            description: 'Character earns 10% more coins.',
            order: 14,
        },
        [PASSIVE_ID_SKULL_O_MANIAC]: {
            name: 'Skull O\'Maniac',
            description: 'Increases enemy speed, health, quantity, and frequency by 10%.',
            order: 15,
        },
        [PASSIVE_ID_TIRAGISU]: {
            name: 'Tiragisú',
            description: 'Revives once with 50% health.',
            order: 16,
        },
        [PASSIVE_ID_SILVER_RING]: {
            name: 'Silver Ring',
            description: 'Wear ... Clock ...',
            order: 17,
        },
        [PASSIVE_ID_GOLD_RING]: {
            name: 'Gold Ring',
            description: '... With ... Lancet',
            order: 18,
        },
        [PASSIVE_ID_METAGLIO_LEFT]: {
            name: 'Metaglio Left',
            description: 'Channels dark powers to protect the bearer.',
            order: 19,
        },
        [PASSIVE_ID_METAGLIO_RIGHT]: {
            name: 'Metaglio Right',
            description: 'Channels dark powers to curse the bearer.',
            order: 20,
        },
        [PASSIVE_ID_TORRONAS_BOX]: {
            name: 'Torrona\'s Box',
            description: 'Cursed item, but increases Might, Projectile Speed, Duration, and Area by 4%.',
            order: 21,
        },
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<StageId, StageData>} A custom representation of the game's stage data. */
    const STAGES = {
        1: {
            name: 'Il Molise',
            description: 'There exists places that don\'t exist. Come to relax and enjoy life. See you in the country.',
            order: 6,
            passives: [
                PASSIVE_ID_SILVER_RING,
                PASSIVE_ID_GOLD_RING,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        2: {
            name: 'Green Acres',
            description: 'A place not made for mortals. Fate changes every minute.',
            order: 8,
            passives: [
                PASSIVE_ID_SILVER_RING,
                PASSIVE_ID_GOLD_RING,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        3: {
            name: 'The Bone Zone',
            description: 'Come over here and say your unholy vespers.',
            order: 9,
            passives: [
                PASSIVE_ID_SILVER_RING,
                PASSIVE_ID_GOLD_RING,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        4: {
            name: 'Mad Forest',
            description: 'The Castle is a lie, but there\'s still free roast chicken here, so it\'s all good.',
            order: 1,
            passives: [
                PASSIVE_ID_SPINACH,
                PASSIVE_ID_CLOVER,
                PASSIVE_ID_HOLLOW_HEART,
                PASSIVE_ID_PUMMAROLA,
                PASSIVE_ID_SKULL_O_MANIAC,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
                PASSIVE_ID_GOLD_RING,
                PASSIVE_ID_SILVER_RING,
            ],
        },
        5: {
            name: 'Inlaid Library',
            description: 'This quiet, long library is the ideal place where to rest, meditate, and forage for roast chicken. But what\'s a stone mask doing here?',
            order: 2,
            passives: [
                PASSIVE_ID_STONE_MASK,
                PASSIVE_ID_EMPTY_TOME,
                PASSIVE_ID_METAGLIO_RIGHT,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_SILVER_RING,
                PASSIVE_ID_GOLD_RING,
            ],
        },
        6: {
            name: 'Dairy Plant',
            description: 'The magic map hidden in here might finally lead us to a vampire, or at least to more roast chicken.',
            order: 3,
            passives: [
                PASSIVE_ID_ATTRACTORB,
                PASSIVE_ID_CANDELABRADOR,
                PASSIVE_ID_ARMOR,
                PASSIVE_ID_WINGS,
                PASSIVE_ID_GOLD_RING,
                PASSIVE_ID_SILVER_RING,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        7: {
            name: 'Gallo Tower',
            description: 'This tower hides great magical artifacts and historically accurate monsters.',
            order: 4,
            passives: [
                PASSIVE_ID_BRACER,
                PASSIVE_ID_SPELLBINDER,
                PASSIVE_ID_GOLD_RING,
                PASSIVE_ID_SILVER_RING,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        8: {
            name: 'Cappella Magna',
            description: 'Have we gone too far? Could have just camped in the forest with all that chicken, but noooo, we had to go chase some random vampire instead.',
            order: 5,
            passives: [
                PASSIVE_ID_CROWN,
                PASSIVE_ID_TIRAGISU,
                PASSIVE_ID_DUPLICATOR,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
                PASSIVE_ID_SILVER_RING,
                PASSIVE_ID_GOLD_RING,
            ],
        },
        9: {
            name: 'Holy Forbidden',
            description: 'Wait, you can see this too? This isn\'t right...',
            order: 1000,
            passives: [],
            hideFromTool: true, // No need to create builds for this level, since it can only be visited once.
        },
        10: {
            name: 'Moongolow',
            description: 'When the moon is red and bright, the remnants of a town swallowed by the sea come back to the surface, bringing mysteries and riches.',
            order: 7,
            passives: [
                PASSIVE_ID_CROWN,
                PASSIVE_ID_STONE_MASK,
                PASSIVE_ID_CLOVER,
                PASSIVE_ID_SKULL_O_MANIAC,
                PASSIVE_ID_ARMOR,
                PASSIVE_ID_HOLLOW_HEART,
                PASSIVE_ID_PUMMAROLA,
                PASSIVE_ID_WINGS,
                PASSIVE_ID_SPINACH,
                PASSIVE_ID_CANDELABRADOR,
                PASSIVE_ID_BRACER,
                PASSIVE_ID_SPELLBINDER,
                PASSIVE_ID_DUPLICATOR,
                PASSIVE_ID_EMPTY_TOME,
                PASSIVE_ID_ATTRACTORB,
                PASSIVE_ID_TIRAGISU,
                PASSIVE_ID_METAGLIO_LEFT,
                PASSIVE_ID_METAGLIO_RIGHT,
                PASSIVE_ID_GOLD_RING,
                PASSIVE_ID_SILVER_RING,
            ],
        },
    };

    // noinspection JSValidateTypes IDs are filled below in init(), so ignore warnings here.
    /** @type {Object<WeaponId, WeaponData>} A custom representation of the game's weapon data. */
    const WEAPONS = {
        [WEAPON_ID_WHIP]: {
            name: 'Whip',
            description: 'Attacks horizontally, passes through enemies.',
            order: 1,
        },
        [WEAPON_ID_BLOODY_TEAR]: {
            name: 'Bloody Tear',
            description: 'Evolved Whip. Can deal critical damage and absorb HP.',
            order: 2,
            reqPassives: [PASSIVE_ID_HOLLOW_HEART],
            reqWeapons: [WEAPON_ID_WHIP],
        },
        [WEAPON_ID_MAGIC_WAND]: {
            name: 'Magic Wand',
            description: 'Fires at the nearest enemy.',
            order: 3,
        },
        [WEAPON_ID_HOLY_WAND]: {
            name: 'Holy Wand',
            description: 'Evolved Magic Wand. Fires with no delay.',
            order: 4,
            reqPassives: [PASSIVE_ID_EMPTY_TOME],
            reqWeapons: [WEAPON_ID_MAGIC_WAND],
        },
        [WEAPON_ID_KNIFE]: {
            name: 'Knife',
            description: 'Fires quickly in the faced direction.',
            order: 5,
        },
        [WEAPON_ID_THOUSAND_EDGE]: {
            name: 'Thousand Edge',
            description: 'Evolved Knife. Fires with no delay.',
            order: 6,
            reqPassives: [PASSIVE_ID_BRACER],
            reqWeapons: [WEAPON_ID_KNIFE],
        },
        [WEAPON_ID_AXE]: {
            name: 'Axe',
            description: 'High damage, high Area scaling.',
            order: 7,
        },
        [WEAPON_ID_DEATH_SPIRAL]: {
            name: 'Death Spiral',
            description: 'Evolved Axe. Passes through enemies.',
            order: 8,
            reqPassives: [PASSIVE_ID_CANDELABRADOR],
            reqWeapons: [WEAPON_ID_AXE],
        },
        [WEAPON_ID_CROSS]: {
            name: 'Cross',
            description: 'Aims at nearest enemy, has boomerang effect.',
            order: 9,
        },
        [WEAPON_ID_HEAVEN_SWORD]: {
            name: 'Heaven Sword',
            description: 'Evolved Cross. Can deal critical damage.',
            order: 10,
            reqPassives: [PASSIVE_ID_CLOVER],
            reqWeapons: [WEAPON_ID_CROSS],
        },
        [WEAPON_ID_KING_BIBLE]: {
            name: 'King Bible',
            description: 'Orbits around the character.',
            order: 11,
        },
        [WEAPON_ID_UNHOLY_VESPERS]: {
            name: 'Unholy Vespers',
            description: 'Evolved King Bible. Never ends.',
            order: 12,
            reqPassives: [PASSIVE_ID_SPELLBINDER],
            reqWeapons: [WEAPON_ID_KING_BIBLE],
        },
        [WEAPON_ID_FIRE_WAND]: {
            name: 'Fire Wand',
            description: 'Fires at a random enemy, deals heavy damage.',
            order: 13,
        },
        [WEAPON_ID_HELLFIRE]: {
            name: 'Hellfire',
            description: 'Evolved Fire Wand. Passes through enemies.',
            order: 14,
            reqPassives: [PASSIVE_ID_SPINACH],
            reqWeapons: [WEAPON_ID_FIRE_WAND],
        },
        [WEAPON_ID_GARLIC]: {
            name: 'Garlic',
            description: 'Damages nearby enemies. Reduces resistance to knockback and freeze.',
            order: 15,
        },
        [WEAPON_ID_SOUL_EATER]: {
            name: 'Soul Eater',
            description: 'Evolved Garlic. Steals hearts. Power increases when recovering HP.',
            order: 16,
            reqPassives: [PASSIVE_ID_PUMMAROLA],
            reqWeapons: [WEAPON_ID_GARLIC],
        },
        [WEAPON_ID_SANTA_WATER]: {
            name: 'Santa Water',
            description: 'Generates damaging zones.',
            order: 17,
        },
        [WEAPON_ID_LA_BORRA]: {
            name: 'La Borra',
            description: 'Evolved Santa Water. Damaging zones follow you and grow when they move.',
            order: 18,
            reqPassives: [PASSIVE_ID_ATTRACTORB],
            reqWeapons: [WEAPON_ID_SANTA_WATER],
        },
        [WEAPON_ID_RUNETRACER]: {
            name: 'Runetracer',
            description: 'Passes through enemies, bounces around.',
            order: 19,
        },
        [WEAPON_ID_NO_FUTURE]: {
            name: 'NO FUTURE',
            description: 'Evolved Runetracer. Explodes when bouncing and in retaliation.',
            order: 20,
            reqPassives: [PASSIVE_ID_ARMOR],
            reqWeapons: [WEAPON_ID_RUNETRACER],
        },
        [WEAPON_ID_LIGHTNING_RING]: {
            name: 'Lightning Ring',
            description: 'Strikes at random enemies.',
            order: 21,
        },
        [WEAPON_ID_THUNDER_LOOP]: {
            name: 'Thunder Loop',
            description: 'Evolved Lightning Ring. Projectiles strike twice.',
            order: 22,
            reqPassives: [PASSIVE_ID_DUPLICATOR],
            reqWeapons: [WEAPON_ID_LIGHTNING_RING],
        },
        [WEAPON_ID_PENTAGRAM]: {
            name: 'Pentagram',
            description: 'Erases everything in sight.',
            order: 23,
        },
        [WEAPON_ID_GORGEOUS_MOON]: {
            name: 'Gorgeous Moon',
            description: 'Evolved Pentagram. Generates extra gems and gathers all of them.',
            order: 24,
            reqPassives: [PASSIVE_ID_CROWN],
            reqWeapons: [WEAPON_ID_PENTAGRAM],
        },
        [WEAPON_ID_PEACHONE]: {
            name: 'Peachone',
            description: 'Bombards in a circling zone.',
            order: 25,
        },
        [WEAPON_ID_EBONY_WINGS]: {
            name: 'Ebony Wings',
            description: 'Bombards in a circling zone.',
            order: 26,
        },
        [WEAPON_ID_VANDALIER]: {
            name: 'Vandalier',
            description: 'Union of Ebony Wings and Peachone.',
            order: 27,
            reqWeapons: [WEAPON_ID_PEACHONE, WEAPON_ID_EBONY_WINGS],
        },
        [WEAPON_ID_PHIERA_DER_TUPHELLO]: {
            name: 'Phiera Der Tuphello',
            description: 'Fires quickly in four fixed directions.',
            order: 28,
        },
        [WEAPON_ID_EIGHT_THE_SPARROW]: {
            name: 'Eight The Sparrow',
            description: 'Fires quickly in four fixed directions.',
            order: 29,
        },
        [WEAPON_ID_PHIERAGGI]: {
            name: 'Phieraggi',
            description: 'Union of Phiera Der Tuphello and Eight The Sparrow. Scales with Revivals.',
            order: 30,
            reqPassives: [PASSIVE_ID_TIRAGISU],
            reqWeapons: [WEAPON_ID_PHIERA_DER_TUPHELLO, WEAPON_ID_EIGHT_THE_SPARROW],
        },
        [WEAPON_ID_GATTI_AMARI]: {
            name: 'Gatti Amari',
            description: 'Summons capricious projectiles. Might interact with pickups.',
            order: 31,
        },
        [WEAPON_ID_VICIOUS_HUNGER]: {
            name: 'Vicious Hunger',
            description: 'Evolved Gatti Amari. Might turn anything into gold.',
            order: 32,
            reqPassives: [PASSIVE_ID_STONE_MASK],
            reqWeapons: [WEAPON_ID_GATTI_AMARI],
        },
        [WEAPON_ID_SONG_OF_MANA]: {
            name: 'Song Of Mana',
            description: 'Attacks vertically, passes through enemies.',
            order: 33,
        },
        [WEAPON_ID_MANNAJJA]: {
            name: 'Mannajja',
            description: 'Evolved Song of Mana. Might slow enemies down.',
            order: 34,
            reqPassives: [PASSIVE_ID_SKULL_O_MANIAC],
            reqWeapons: [WEAPON_ID_SONG_OF_MANA],
        },
        [WEAPON_ID_SHADOW_PINION]: {
            name: 'Shadow Pinion',
            description: 'Generates damaging zones when moving, strikes when stopping.',
            order: 35,
        },
        [WEAPON_ID_VALKYRIE_TURNER]: {
            name: 'Valkyrie Turner',
            description: 'Evolved Shadow Pinion. Bigger, longer, faster, stronger.',
            order: 36,
            reqPassives: [PASSIVE_ID_WINGS],
            reqWeapons: [WEAPON_ID_SHADOW_PINION],
        },
        [WEAPON_ID_CLOCK_LANCET]: {
            name: 'Clock Lancet',
            description: 'Chance to freeze enemies in time.',
            order: 37,
        },
        [WEAPON_ID_INFINITE_CORRIDOR]: {
            name: 'Infinite Corridor',
            description: 'Evolved Clock Lancet. Halves enemies health.',
            order: 38,
            reqPassives: [PASSIVE_ID_SILVER_RING, PASSIVE_ID_GOLD_RING],
            reqWeapons: [WEAPON_ID_CLOCK_LANCET],
        },
        [WEAPON_ID_LAUREL]: {
            name: 'Laurel',
            description: 'Shields from damage when active.',
            order: 39,
        },
        [WEAPON_ID_CRIMSON_SHROUD]: {
            name: 'Crimson Shroud',
            description: 'Evolved Laurel. Caps incoming damage at 10. Retaliates when losing charges.',
            order: 40,
            reqPassives: [PASSIVE_ID_METAGLIO_LEFT, PASSIVE_ID_METAGLIO_RIGHT],
            reqWeapons: [WEAPON_ID_LAUREL],
        },
        [WEAPON_ID_VENTO_SACRO]: {
            name: 'Vento Sacro',
            description: 'Stronger with continuous movement. Can deal critical damage.',
            order: 41,
        },
        [WEAPON_ID_FUWALAFUWALOO]: {
            name: 'Fuwalafuwaloo',
            description: 'Union of Vento Sacro and Bloody Tear. Critical hits might generate explosions.',
            order: 42,
            reqWeapons: [WEAPON_ID_VENTO_SACRO, WEAPON_ID_BLOODY_TEAR],
        },
        [WEAPON_ID_BONE]: {
            name: 'Bone',
            description: 'Throws a bouncing projectile.',
            order: 43,
        },
        [WEAPON_ID_CHERRY_BOMB]: {
            name: 'Cherry Bomb',
            description: 'Throws a bouncing projectile. Explodes, sometimes.',
            order: 44,
        },
        [WEAPON_ID_CARRELLO]: {
            name: 'Carréllo',
            description: 'Throws a bouncing projectile. Number of bounces affected by Amount.',
            order: 45,
        },
        [WEAPON_ID_CELESTIAL_DUSTING]: {
            name: 'Celestial Dusting',
            description: 'Throws a bouncing projectile. Cooldown reduces when moving.',
            order: 46,
        },
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Returns the arcana with the given ID.
     *
     * @param {ArcanaId} id
     * @return {ArcanaData|undefined}
     */
    this.getArcana = id => getData(ARCANAS, id);

    /**
     * Returns a list of all arcana IDs.
     *
     * @return {ArcanaId[]}
     */
    this.getArcanaIds = () => getIds(ARCANAS);

    /**
     * Returns the character with the given ID.
     *
     * @param {CharacterId} id
     * @return {CharacterData|undefined}
     */
    this.getCharacter = id => getData(CHARACTERS, id);

    /**
     * Returns a list of all character IDs.
     *
     * @return {CharacterId[]}
     */
    this.getCharacterIds = () => getIds(CHARACTERS);

    /**
     * Returns the passive item with the given ID.
     *
     * @param {PassiveId} id
     * @return {PassiveData|undefined}
     */
    this.getPassive = id => getData(PASSIVES, id);

    /**
     * Returns a list of all passive item IDs.
     *
     * @return {PassiveId[]}
     */
    this.getPassiveIds = () => getIds(PASSIVES);

    /**
     * Returns the stage with the given ID.
     *
     * @param {StageId} id
     * @return {StageData|undefined}
     */
    this.getStage = id => getData(STAGES, id);

    /**
     * Returns a list of all stage IDs.
     *
     * @return {StageId[]}
     */
    this.getStageIds = () => getIds(STAGES);

    /**
     * Returns the weapon with the given ID.
     *
     * @param {WeaponId} id
     * @return {WeaponData|undefined}
     */
    this.getWeapon = id => getData(WEAPONS, id);

    /**
     * Returns a list of all weapon IDs.
     *
     * @return {WeaponId[]}
     */
    this.getWeaponIds = () => getIds(WEAPONS);

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Returns data by ID from the given entity lookup.
     *
     * @param {Object<number, Object>} entities
     * @param {number}                 id
     * @return {Object|undefined}
     */
    function getData(entities, id) {
        if (entities[id]) {
            return Util.copyProperties({}, entities[id]);
        }
    }

    /**
     * Returns a list of IDs from the given entity lookup.
     *
     * @param {Object<number, Object>} entities
     * @return {number[]}
     */
    function getIds(entities) {
        return entities.sortedIds || Object.keys(entities).map(id => parseInt(id));
    }

    /**
     * Sets IDs in all entity lookups.
     */
    function init() {
        [ARCANAS, CHARACTERS, PASSIVES, STAGES, WEAPONS].forEach(entities => {
            let ids = [];

            Object.keys(entities).forEach(idString => {
                let id = parseInt(idString);

                // Rewrite this object with the ID added, and put it first for development convenience.
                entities[idString] = Util.copyProperties({}, {id: id}, entities[idString]);

                // Add this ID to the list of IDs to be sorted.
                ids.push(id);
            });

            // Create an ID list that's sorted by the entity order.
            ids.sort((a, b) => {
                let aSort = entities[a].order || entities[a].id || 0;
                let bSort = entities[b].order || entities[b].id || 0;

                return aSort > bSort ? 1 : -1;
            });
            entities.sortedIds = ids;
        });
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    VST.registerInitCallback(init);
};
