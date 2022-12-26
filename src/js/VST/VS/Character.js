/**
 * Functions related to Vampire Survivors characters.
 */
VST.VS.Character = new function () {
    const self = this;
    const DOM = VST.DOM;
    const Img = VST.VS.Img;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {EntityData} CharData Data describing a character.
     * @property {CharId}       id               This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}       name             The character's common name.
     * @property {string}       description      The character's in-game description.
     * @property {CharLevels[]} levelUpStats     A list of the bonuses you get at particular levels.
     * @property {number}       order            The order that the character is shown in.
     * @property {VsSpriteFunc} spriteAlt        The sprite that the filename exists in, if different from "characters".
     * @property {string}       spriteName       The filename of the character's image within the "characters" sprite.
     * @property {CharStats}    stats            The character's stat bonuses at level 1.
     * @property {VsType}       type             The Character type ID.
     * @property {string[]}     [items]          Filenames of non-weapon non-passive items shown in the char's portrait.
     * @property {CharStats}    [onEveryLevelUp] The bonus stats that the character gets on each level increase.
     * @property {PassiveId[]}  [passiveIds]     The passive items the character starts with.
     * @property {string}       [prefix]         Text shown before the character's name when showing their full name.
     * @property {string}       [surname]        Text shown after the character's name when showing their full name.
     * @property {WeaponId[]}   [weaponIds]      The weapons the character starts with.
     */

    /** @typedef {EntityId} CharId A character's ID. */

    /**
     * @typedef {CharStats} CharLevels The bonuses that a character gets at particular levels.
     * @property {number} level The level at which they get these bonus stats.
     */

    /** @typedef {string} CharStat A unique string "key" to identify a stat. */

    /**
     * @typedef {Object<CharStat, number>} CharStats A map of stat keys to hex numbers.
     * @property {number} amount
     * @property {number} area
     * @property {number} armor
     * @property {number} banish
     * @property {number} cooldown
     * @property {number} curse
     * @property {number} duration
     * @property {number} exLevels
     * @property {number} greed
     * @property {number} growth
     * @property {number} luck
     * @property {number} magnet
     * @property {number} maxHp
     * @property {number} moveSpeed
     * @property {number} power
     * @property {number} regen
     * @property {number} rerolls
     * @property {number} revivals
     * @property {number} skips
     * @property {number} speed
     */

    /** @typedef {string} CharDisplayMode What style of display a character box should be. */

    /** @typedef {string} StatKey A unique string identifier for a stat. E.g. "moveSpeed". */

    /**
     * @typedef {Object} StatData Data describing a stat.
     * @property {string}        name           The name of the stat.
     * @property {string}        description    The description found in the "POWER UP" screen.
     * @property {VsImgFilename} image          The name of an "items" sprite frame for this stat, with no extension.
     * @property {boolean}       [hide]         Whether to not display this stat in the character's tooltips.
     * @property {boolean}       [isPercent]    True when this stat is displayed as a percentage.
     * @property {boolean}       [noPlusSymbol] Whether the base stat has no plus symbol for positive numbers.
     * @property {number}        [precision]    How many decimal places of precision should always be shown.
     */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {CharDisplayMode} The default. A square box with their short name, image, and starting weapons. */
    this.DISPLAY_MODE_DEFAULT = 'default';
    /** @type {CharDisplayMode} Like default, but wider. With full name, description, weapon frames, optional button. */
    this.DISPLAY_MODE_DETAILS = 'details';

    // ------- //
    // PRIVATE //
    // ------- //

    // noinspection JSValidateTypes Types and IDs are filled during initialization, so ignore warnings here.
    /**
     * @type {Object<CharId, CharData>} A map of character IDs to character data.
     * @property {CharId[]} sortedIds
     */
    const DATA = {
        1: {
            name: 'Antonio',
            surname: 'Belpaese',
            description: 'Gains 10% more damage every 10 levels (max +50%).',
            order: 1,
            spriteName: 'newAntonio_01.png',
            weaponIds: [VS.WEAPON_ID_WHIP],
            levelUpStats: [
                {power: 0.1, level: 0xa},
                {power: 0.1, level: 0x14, growth: 0x1},
                {power: 0.1, level: 0x1e},
                {power: 0.1, level: 0x28, growth: 0x1},
                {power: 0.1, level: 0x32},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x78,
                armor: 0x1,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        2: {
            name: 'Imelda',
            surname: 'Belpaese',
            description: 'Gains 10% more experience every 5 levels (max +30%).',
            order: 2,
            spriteName: 'newImelda_01.png',
            weaponIds: [VS.WEAPON_ID_MAGIC_WAND],
            levelUpStats: [
                {growth: 0.1, level: 0x5},
                {growth: 0.1, level: 0xa},
                {growth: 0.1, level: 0xf},
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        3: {
            name: 'Pasqualina',
            surname: 'Belpaese',
            description: 'Projectiles get 10% faster every 5 levels (max +30%).',
            order: 3,
            spriteName: 'newPasqualina_01.png',
            weaponIds: [VS.WEAPON_ID_RUNETRACER],
            levelUpStats: [
                {speed: 0.1, level: 0x5},
                {speed: 0.1, level: 0xa},
                {speed: 0.1, level: 0xf},
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 1.1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        4: {
            name: 'Gennaro',
            surname: 'Belpaese',
            description: 'Permanent +1 projectile (all weapons).',
            order: 4,
            spriteName: 'newGennaro_01.png',
            weaponIds: [VS.WEAPON_ID_KNIFE],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x78,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x1,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        5: {
            name: 'Arca',
            surname: 'Ladonna',
            description: 'Weapon cooldown is reduced by 5% every 10 levels (max -15%).',
            order: 5,
            spriteName: 'newArca_01.png',
            weaponIds: [VS.WEAPON_ID_FIRE_WAND],
            levelUpStats: [
                {cooldown: -0.05, level: 0xa},
                {cooldown: -0.05, level: 0x14, growth: 0x1},
                {cooldown: -0.05, level: 0x1e},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 1.1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        6: {
            name: 'Porta',
            surname: 'Ladonna',
            description: 'Permanent +30% area. Starts with temporary cooldown bonus.',
            order: 6,
            spriteName: 'newPorta_01.png',
            weaponIds: [VS.WEAPON_ID_LIGHTNING_RING],
            levelUpStats: [
                {level: 0x2, cooldown: 0.3},
                {level: 0x3, cooldown: 0.3},
                {level: 0x4, cooldown: 0.3},
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0.1,
                area: 1.3,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        7: {
            name: 'Lama',
            surname: 'Ladonna',
            description: 'Gains +5% Might, MoveSpeed, and Curse every 10 levels (max +20%).',
            order: 7,
            spriteName: 'newLama_01.png',
            weaponIds: [VS.WEAPON_ID_AXE],
            levelUpStats: [
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
                {level: 0xa, power: 0.05, curse: 0.05, moveSpeed: 0.05},
                {level: 0x14, power: 0.05, curse: 0.05, moveSpeed: 0.05, growth: 0x1},
                {level: 0x1e, power: 0.05, curse: 0.05, moveSpeed: 0.05},
                {level: 0x28, power: 0.05, curse: 0.05, moveSpeed: 0.05, growth: 0x1},
            ],
            stats: {
                maxHp: 0x6e,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.1,
                power: 1.1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 1.1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        8: {
            name: 'Poe',
            surname: 'Ratcho',
            description: 'Permanent +25% pickup radius and -30 max health.',
            order: 8,
            spriteName: 'newOld3_01.png',
            weaponIds: [VS.WEAPON_ID_GARLIC],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x46,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0.25,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        9: {
            name: 'Clerici',
            description: 'Permanent +0.5 HP/s and +50 Max Health. Starts with temporary area bonus.',
            spriteName: 'newSuora_01.png',
            order: 9,
            prefix: 'Suor',
            weaponIds: [VS.WEAPON_ID_SANTA_WATER],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
                {level: 0x2, area: -0x1},
                {level: 0x3, area: -0x1},
                {level: 0x4, area: -0x1},
                {level: 0x5, area: -0x1},
            ],
            stats: {
                maxHp: 0x96,
                armor: 0x0,
                regen: 0.5,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x5,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        10: {
            name: 'Dommario',
            description: 'Permanent +40% duration and speed, -40% move speed.',
            order: 10,
            spriteName: 'newDommario_01.png',
            weaponIds: [VS.WEAPON_ID_KING_BIBLE],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0.6,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 1.4,
                duration: 1.4,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        11: {
            name: 'Krochi',
            surname: 'Freetto',
            description: 'Starts with 1 Revival. Gains 1 more Revival at level 33.',
            order: 11,
            spriteName: 'newKrochi_01.png',
            weaponIds: [VS.WEAPON_ID_CROSS],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
                {level: 0x21, revivals: 0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.3,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x1,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        12: {
            name: 'Christine',
            surname: 'Davain',
            description: 'Starts with 1 extra level.',
            order: 12,
            spriteName: 'newChristine_01.png',
            weaponIds: [VS.WEAPON_ID_PENTAGRAM],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x32,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.3,
                power: 0.65,
                cooldown: 0.75,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                exLevels: 0x1,
                banish: 0x0,
            },
        },
        13: {
            name: 'Pugnala',
            surname: 'Provola',
            description: 'Gains +1% Might every level.',
            order: 13,
            spriteName: 'Pugnala_01.png',
            weaponIds: [VS.WEAPON_ID_PHIERA_DER_TUPHELLO, VS.WEAPON_ID_EIGHT_THE_SPARROW],
            onEveryLevelUp: {power: 0.01},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.2,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        14: {
            name: 'Giovanna',
            surname: 'Grana',
            description: 'Gains +1% Projectile Speed every level.',
            order: 14,
            spriteName: 'newGiovanna_01.png',
            weaponIds: [VS.WEAPON_ID_GATTI_AMARI],
            onEveryLevelUp: {speed: 0.01},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.2,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        15: {
            name: 'Poppea',
            surname: 'Pecorina',
            description: 'Gains +1% Duration every level.',
            order: 15,
            spriteName: 'newPoppea_01.png',
            weaponIds: [VS.WEAPON_ID_SONG_OF_MANA],
            onEveryLevelUp: {duration: 0.01},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.2,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        16: {
            name: 'Concetta',
            surname: 'Caciotta',
            description: 'Gains +1% Area every level.',
            order: 16,
            spriteName: 'Concetta_i01.png',
            weaponIds: [VS.WEAPON_ID_SHADOW_PINION],
            onEveryLevelUp: {area: 0.01},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.2,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 1.1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        17: {
            name: 'Mortaccio',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 17,
            spriteName: 'Mortaccio_01.png',
            weaponIds: [VS.WEAPON_ID_BONE],
            levelUpStats: [
                {amount: 0x1, level: 0x14, growth: 0x1},
                {amount: 0x1, level: 0x28, growth: 0x1},
                {amount: 0x1, level: 0x3c},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        18: {
            name: 'Cavallo',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 18,
            spriteName: 'Cavallo_01.png',
            prefix: 'Yatta',
            weaponIds: [VS.WEAPON_ID_CHERRY_BOMB],
            levelUpStats: [
                {amount: 0x1, level: 0x14, growth: 0x1},
                {amount: 0x1, level: 0x28, growth: 0x1},
                {amount: 0x1, level: 0x3c},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        19: {
            name: 'Ramba',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 19,
            spriteName: 'Ramba_01.png',
            prefix: 'Bianca',
            weaponIds: [VS.WEAPON_ID_CARRELLO],
            levelUpStats: [
                {amount: 0x1, level: 0x14, growth: 0x1},
                {amount: 0x1, level: 0x28, growth: 0x1},
                {amount: 0x1, level: 0x3c},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        20: {
            name: 'O\'Sole',
            surname: 'Meeo',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 20,
            spriteName: 'Dog_01.png',
            weaponIds: [VS.WEAPON_ID_CELESTIAL_DUSTING],
            levelUpStats: [
                {amount: 0x1, level: 0x14, growth: 0x1},
                {amount: 0x1, level: 0x28, growth: 0x1},
                {amount: 0x1, level: 0x3c},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        21: {
            name: 'Ambrojoe',
            description: 'Gets more projectiles every 20 levels (max+3). Starts with temporary Amount bonus.',
            order: 21,
            prefix: 'Sir',
            spriteName: 'Hat_01.png',
            weaponIds: [VS.WEAPON_ID_LA_ROBBA],
            levelUpStats: [
                {level: 0x2, amount: -0x2},
                {level: 0x3, amount: -0x2},
                {level: 0x4, amount: -0x2},
                {level: 0x5, amount: -0x2},
                {level: 0x6, amount: -0x2},
                {amount: 0x1, level: 0x14, growth: 0x1},
                {amount: 0x1, level: 0x28, growth: 0x1},
                {amount: 0x1, level: 0x3c},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0xa,
                luck: 1.2,
                growth: 0x1,
                greed: 1.2,
                curse: 0x1,
                magnet: 0.2,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        22: {
            name: 'Gallo',
            surname: 'Valletto',
            description: 'Starts with 1 extra level. Gains +10% Growth every 5 levels (max +50%).',
            order: 22,
            spriteName: 'Gallo_01.png',
            prefix: 'Iguana',
            weaponIds: [VS.WEAPON_ID_CLOCK_LANCET],
            levelUpStats: [
                {growth: 1.1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
                {growth: 0.1, level: 0x5},
                {growth: 0.1, level: 0xa},
                {growth: 0.1, level: 0xf},
                {growth: 0.1, level: 0x19},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0.85,
                area: 0x1,
                speed: 0x1,
                duration: 1.15,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0.5,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x5,
                skips: 0x5,
                banish: 0x0,
                exLevels: 0x1,
            },
        },
        23: {
            name: 'Divano',
            surname: 'Thelma',
            description: 'Starts with 1 extra level. Gains +1 Armor every 5 levels (max +5).',
            order: 23,
            spriteName: 'Divano_01.png',
            weaponIds: [VS.WEAPON_ID_LAUREL],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
                {armor: 0x1, level: 0x5},
                {armor: 0x1, level: 0xa},
                {armor: 0x1, level: 0xf},
                {armor: 0x1, level: 0x19},
                {armor: 0x1, level: 0x1e},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x1,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 1.3,
                growth: 0x1,
                greed: 0.5,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0xa,
                exLevels: 0x1,
            },
        },
        24: {
            name: 'Zi\'Assunta',
            surname: 'Belpaese',
            description: 'Gains +0.5% Might, projectile Speed, Duration, and Area every level.',
            order: 24,
            spriteName: 'newAssunta_01.png',
            weaponIds: [VS.WEAPON_ID_VENTO_SACRO],
            onEveryLevelUp: {power: 0.005, speed: 0.005, duration: 0.005, area: 0.005},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.2,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 1.1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        34: {
            name: 'Gyorunton',
            description: 'Gains +1% Curse every level. Can find evolutions in any Treasure.',
            order: 38,
            spriteName: 'Dragogion_01.png',
            weaponIds: [VS.WEAPON_ID_BRACELET],
            onEveryLevelUp: {curse: 0.01},
            levelUpStats: [
                {level: 0xa},
                {level: 0x14, growth: 0x1},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x12c,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 1.3,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x2,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        25: {
            name: 'Exdash',
            surname: 'Exiviiq',
            description: 'At least they\'re lucky.',
            order: 25,
            spriteName: 'Exdash_01.png',
            weaponIds: [VS.WEAPON_ID_EBONY_WINGS],
            levelUpStats: [
                {luck: 0.1, level: 0xa},
                {luck: 0.1, level: 0x14, growth: 0x1},
                {luck: 0.1, level: 0x1e},
                {luck: 0.1, level: 0x28, growth: 0x1},
                {luck: 0.1, level: 0x32},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x4d,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0.9,
                power: 0.9,
                cooldown: 1.1,
                area: 0.9,
                speed: 0.5,
                duration: 0.9,
                amount: 0x0,
                luck: 0x2,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        26: {
            name: 'Toastie',
            description: 'So much potential.',
            order: 26,
            spriteName: 'uExdash_01.png',
            weaponIds: [VS.WEAPON_ID_PEACHONE],
            levelUpStats: [
                {luck: 0.2, level: 0xa},
                {luck: 0.2, level: 0x14, growth: 0x1},
                {luck: 0.2, level: 0x1e},
                {luck: 0.2, level: 0x28, growth: 0x1},
                {luck: 0.2, level: 0x32},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
                {level: 0x64, maxHp: 0x270e},
                {level: 0xc8, armor: 0xfff0},
            ],
            stats: {
                maxHp: 0x1,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.2,
                power: 0.9,
                cooldown: 1.1,
                area: 0.9,
                speed: 0.5,
                duration: 0.9,
                amount: 0x0,
                luck: 0x2,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        27: {
            name: 'Smith IV',
            description: 'The quirky white bear.',
            order: 27,
            spriteName: 'nExdash_01.png',
            weaponIds: [VS.WEAPON_ID_VANDALIER],
            onEveryLevelUp: {
                regen: 0.01,
                power: 0.007,
                speed: 0.007,
                duration: 0.007,
                area: 0.007,
                cooldown: -0.0025,
                luck: 0.01,
            },
            levelUpStats: [
                {level: 0x14, growth: 0x1},
                {level: 0x28, growth: 0x1},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x7,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.2,
                power: 0.9,
                cooldown: 1.1,
                area: 0.9,
                speed: 0.5,
                duration: 0.9,
                amount: 0x0,
                luck: 0x2,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        38: {
            name: 'Random',
            description: 'Random.',
            order: 28,
            spriteName: 'random_01.png',
            weaponIds: [],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        28: {
            name: 'Marrabbio',
            description: '',
            order: 29,
            spriteName: 'Marrabbio_01.png',
            prefix: 'Boon',
            weaponIds: [VS.WEAPON_ID_THOUSAND_EDGE],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x78,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.3,
                power: 1.2,
                cooldown: 0x1,
                area: 0x1,
                speed: -0.1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0.2,
                curse: 1.1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        40: {
            name: 'Avatar',
            surname: 'Infernas',
            description: 'Starts with extra Arcana XIX - Heart Of Fire. Grows stronger with every level, but also ' +
                'loses control.',
            order: 30,
            spriteName: 'v_01.png',
            weaponIds: [VS.WEAPON_ID_FLAMES_OF_MISSPELL],
            onEveryLevelUp: {curse: 0.005, power: 0.005, moveSpeed: 0.02, cooldown: -0.0025},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0xa0,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 1.5,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 1.5,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x1,
                revivals: 0x1,
                rerolls: 0xa,
                skips: 0x0,
                banish: 0x0,
            },
        },
        29: {
            name: 'Minnah',
            surname: 'Mannarah',
            description: 'Might, projectile Speed, Duration, Area, and Cooldown change every minute.',
            order: 31,
            spriteName: 'Minnah_01.png',
            weaponIds: [VS.WEAPON_ID_BLOODY_TEAR],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
                {level: 0x3, power: 0.1},
                {level: 0x6, power: 0.1},
                {level: 0x9, power: 0.1},
                {level: 0xc, power: 0.1},
                {level: 0xf, power: 0.1},
                {level: 0x12, power: 0.1},
                {level: 0x15, power: 0.1},
            ],
            stats: {
                maxHp: 0x96,
                armor: 0x0,
                regen: 0.5,
                moveSpeed: 0x1,
                power: 0.3,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        30: {
            name: 'Leda',
            description: '',
            order: 32,
            spriteName: 'XLLeda_i01.png',
            weaponIds: [VS.WEAPON_ID_HOLY_WAND],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x5,
                regen: 0x0,
                moveSpeed: 0.8,
                power: 0x2,
                cooldown: 0.9,
                area: 1.1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0.2,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        35: {
            name: 'Cosmo',
            surname: 'Pavone',
            description: 'Gains +1 Recovery and +1% Luck every level. Gains +1 Revival every 100 levels. Has hidden ' +
                'weapons.',
            order: 33,
            spriteName: 'Cosmic_01.png',
            weaponIds: [],
            onEveryLevelUp: {regen: 0x1, luck: 0.01, revivals: 0.01},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x14,
                armor: 0x0,
                regen: 0x1,
                moveSpeed: 1.3,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 1.2,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x1,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        31: {
            name: 'Peppino',
            description: 'Starts with temporarily reduced area.',
            order: 34,
            spriteName: 'Peppino_01.png',
            weaponIds: [VS.WEAPON_ID_SOUL_EATER],
            levelUpStats: [
                {area: 0.1, level: 0x2},
                {area: 0.1, level: 0x3},
                {area: 0.1, level: 0x5},
                {area: 0.1, level: 0x8},
                {area: 0.1, level: 0xd},
                {area: 0.1, level: 0x15},
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x78,
                armor: 0x2,
                regen: 0x0,
                moveSpeed: 0x0,
                power: 0x1,
                cooldown: 0x1,
                area: 0.4,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x1,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        36: {
            prefix: 'Big',
            name: 'Trouser',
            description: 'Gains +1% Greed every level. Gold Fever lasts longer.',
            order: 35,
            spriteName: 'Pantalone_01.png',
            items: ['candybox.png'],
            onEveryLevelUp: {greed: 0.01},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 1.3,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 1.2,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        39: {
            name: 'missingN▯',
            description: '',
            order: 36,
            spriteName: '_0x00000000_i01.png',
            weaponIds: [VS.WEAPON_ID_DEATH_SPIRAL],
            levelUpStats: [], // No level-up stats, not even the weird VS experience mangling.
            stats: {
                maxHp: 0x1,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x0,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x1,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x1,
                revival: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        33: {
            name: 'Gains',
            description: 'Gains +2% Growth every level.',
            order: 37,
            spriteName: 'Gains_01.png',
            surname: 'Boros',
            weaponIds: [VS.WEAPON_ID_HEAVEN_SWORD],
            onEveryLevelUp: {growth: 0.02},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x64,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x1,
                power: 0x1,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        32: {
            name: 'Red Death',
            description: 'A blasphemous mockery.',
            order: 39,
            spriteName: 'newXLReaper_i01.png',
            prefix: 'Mask of the',
            weaponIds: [VS.WEAPON_ID_DEATH_SPIRAL],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0xff,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0x2,
                power: 1.2,
                cooldown: 0x1,
                area: 0x1,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
        37: {
            prefix: 'Queen',
            name: 'Sigma',
            description: 'She owns everything.',
            order: 40,
            spriteName: 's_01.png',
            weaponIds: [VS.WEAPON_ID_VICTORY_SWORD],
            onEveryLevelUp: {power: 0.01, growth: 0.01},
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x14d,
                armor: 0x3,
                regen: 0x3,
                moveSpeed: 1.5,
                power: 1.5,
                cooldown: 0.75,
                area: 0x1,
                speed: 0x1,
                duration: 1.5,
                amount: 0x1,
                luck: 1.5,
                growth: 0x1,
                greed: 0x1,
                curse: 1.1,
                magnet: 0x1,
                revivals: 0x1,
                rerolls: 0x6c,
                skips: 0x6c,
                banish: 0x6c,
            },
        },
        41: {
            name: 'Scorej-Oni',
            description: 'Gains a hidden Lightning Ring every 8 levels (max 6) that also fires when losing health.',
            order: 41,
            spriteName: 'Scorej_01.png',
            weaponIds: [],
            levelUpStats: [
                {growth: 0x1, level: 0x14},
                {growth: 0x1, level: 0x28},
                {level: 0x15, growth: -0x1},
                {level: 0x29, growth: -0x1},
            ],
            stats: {
                maxHp: 0x6c,
                armor: 0x0,
                regen: 0x0,
                moveSpeed: 0.8,
                power: 0x1,
                cooldown: 0x1,
                area: 1.2,
                speed: 0x1,
                duration: 0x1,
                amount: 0x0,
                luck: 0x1,
                growth: 0x1,
                greed: 0x1,
                curse: 0x1,
                magnet: 0x0,
                revivals: 0x0,
                rerolls: 0x0,
                skips: 0x0,
                banish: 0x0,
            },
        },
    };

    /** @type {string} What's displayed when a stat is increased each time the character levels up. */
    const EVERY_LEVEL_INDICATOR = '∞';

    /** @type {number} The scaling size of the character and weapon images in the standard character boxes. */
    const IMAGE_SCALE_CHAR_BOX = 1.72;

    /** @type {Object<StatKey, StatData>} A map of stat keys to their data. */
    const STAT_DATA = {
        amount: {
            name: 'Amount',
            description: 'Fires 1 more projectile (all weapons).',
            image: 'Ring',
        },
        area: {
            name: 'Area',
            description: 'Augments area of attacks by 5% per rank (max +10%).',
            image: 'Candelabra',
            isPercent: true,
        },
        armor: {
            name: 'Armor',
            description: 'Reduces incoming Damage by 1 per rank (max -3).',
            image: 'ArmorIron',
        },
        banish: {
            name: 'Banish',
            description: 'Twice per rank, allows you to remove an item from level up choices, for the rest of the run.',
            image: 'Banish',
        },
        cooldown: {
            name: 'Cooldown',
            description: 'Uses weapons 2.5% faster per rank (max 5%).',
            image: 'Book2',
            isPercent: true,
        },
        curse: {
            name: 'Curse',
            description: 'Increases enemy speed, health, quantity, and frequency by 10% per rank (max +50%).',
            image: 'Curse',
            isPercent: true,
        },
        duration: {
            name: 'Duration',
            description: 'Effects from weapons last 15% longer per rank (max +30%).',
            image: 'EmblemEye',
            isPercent: true,
        },
        exLevels: {
            name: 'Extra Levels',
            description: '',
            image: 'GemRed',
            hide: true,
        },
        greed: {
            name: 'Greed',
            description: 'Gains 10% more Gold per rank (max +50%).',
            image: 'Mask',
            isPercent: true,
        },
        growth: {
            name: 'Growth',
            description: 'Gains 3% more experience per rank (max 15%).',
            image: 'Crown',
            isPercent: true,
        },
        luck: {
            name: 'Luck',
            description: 'Chance to get lucky goes up by 10% per rank (max +30%).',
            image: 'Clover',
            isPercent: true,
        },
        magnet: {
            name: 'Magnet',
            description: 'Items Pickup range +25% per rank (max +50%).',
            image: 'OrbGlow',
            isPercent: true,
        },
        maxHp: {
            name: 'Max Health',
            description: 'Augments Max Health by 10% per rank (max +30%).',
            image: 'HeartBlack',
            noPlusSymbol: true,
        },
        moveSpeed: {
            name: 'Move Speed',
            description: 'Character moves 5% faster per rank (max 10%).',
            image: 'Wing',
            isPercent: true,
        },
        // pandora: {
        //     name: 'Omni',
        //     description: 'Increases Might, Projectile Speed, Duration, and Area by 2% per rank (max +10%).',
        //     image: 'torrone',
        // },
        power: {
            name: 'Might',
            description: 'Raises inflicted Damage by 5% per rank (max +25%).',
            image: 'Leaf',
            isPercent: true,
        },
        regen: {
            name: 'Recovery',
            description: 'Recovers 0.1 HP per rank (max 0.5) per second.',
            image: 'HeartRuby',
            noPlusSymbol: true,
            precision: 1,
        },
        rerolls: {
            name: 'Reroll',
            description: 'Twice per rank, allows you to get different choices when leveling up.',
            image: 'Dice',
        },
        revivals: {
            name: 'Revival',
            description: 'Revives once with 50% health.',
            image: 'Tiramisu',
        },
        // seal: {
        //     name: 'Seal',
        //     description: 'Allows to Banish an item from level up choices, or a pickup from light sources. Use in COLLECTION menu.',
        //     image: 'seal',
        // },
        // shield: {
        //     name: 'Shield',
        //     description: 'Prevents damage for one attack. Stacks with Laurel.',
        //     image: 'cheese', // Not really, but this doesn't actually appear in the game, so there's no image for it.
        // },
        skips: {
            name: 'Skip',
            description: 'Twice per rank, allows you to skip level up choices and get Experience instead.',
            image: 'Skip',
        },
        speed: {
            name: 'Speed',
            description: 'Projectiles move 10% faster per rank (max 20%).',
            image: 'Gauntlet',
            isPercent: true,
        },
    };

    /** @type {StatKey[]} The order to display stats in. */
    const STAT_DISPLAY_ORDER = [
        'maxHp',
        'regen',
        'armor',
        'moveSpeed',
        'power',
        'speed',
        'duration',
        'area',
        'cooldown',
        'amount',
        'revivals',
        'magnet',
        'luck',
        'growth',
        'greed',
        'curse',
        'rerolls',
        'skips',
        'banish',
        'exLevels',
    ];

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_CHARACTER;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Add any relevant character-specific tooltip content to the given character tooltip.
     *
     * @param {HTMLDivElement} tooltip
     * @param {CharData}       character
     */
    this.addTooltipContent = function (tooltip, character) {
        //            //
        // BASE STATS //
        //            //

        DOM.ce('div', {className: 'vst-tooltip-heading'}, tooltip, DOM.ct('Stats'));

        let table = getStatsTable();
        tooltip.appendChild(table);
        appendStatRowsToTable(table, character.stats, {isBaseStat: true});

        //                //
        // LEVEL-UP STATS //
        //                //

        let levelUpStats = [...character.levelUpStats];
        if (character.onEveryLevelUp) {
            levelUpStats.push(character.onEveryLevelUp);
        }

        // Filter out Vampire Survivor's weird experience management manipulations.
        levelUpStats = levelUpStats.filter(stats => {
            switch (stats.level) {
                case 20:
                case 40:
                    if (stats.growth >= 1) {
                        stats.growth -= 1;
                        if (stats.growth === 0) {
                            delete stats.growth;
                        }
                    }
                    break;
                case 21:
                case 41:
                    if (stats.growth <= -1) {
                        stats.growth += 1;
                        if (stats.growth === 0) {
                            delete stats.growth;
                        }
                    }
                    break;
            }

            // If only the level is left, there are no stats here to show.
            return !(stats.hasOwnProperty('level') && Object.keys(stats).length === 1);
        });

        // If there are any level-up stats left after filtering out the weird VS experience mangling, show them.
        if (levelUpStats.length) {
            DOM.ce('div', {className: 'vst-tooltip-heading'}, tooltip, DOM.ct('Level-Up Stats'));
            let table = getStatsTable();
            tooltip.appendChild(table);

            levelUpStats.forEach(stats => appendStatRowsToTable(table, stats, {isLevelUpBonus: true}));
        }
    };

    /**
     * Returns the character with the given ID.
     *
     * @param {CharId} id
     * @return {CharData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns a list of all character IDs.
     *
     * @return {CharId[]}
     */
    this.getIds = () => DATA.sortedIds;

    /**
     * Returns elements created to display a character box.
     *
     * If both the buttonText and buttonAction optional params are supplied, a blue button will be added to the
     * bottom-right of the character box. The button may still not be visible, depending on the mode.
     *
     * @param {CharData}        char
     * @param {CharDisplayMode} mode            What style of display this character box should be.
     * @param {string}          [tagName="div"] The tag name to use for the element.
     * @param {string}          [buttonText]    The text to display on the optional button.
     * @param {function}        [buttonAction]  The function to execute when clicking the optional button.
     * @return {HTMLDivElement|HTMLAnchorElement}
     */
    this.renderBox = function (char, mode, tagName, buttonText, buttonAction) {
        let baseClass = 'vs-char-box';

        let entity = VS.createEntityElements(TYPE, char, tagName, mode || self.DISPLAY_MODE_DEFAULT);
        entity.content.classList.add(baseClass);

        // The BG, which is automatically sized to the box.
        DOM.ce('div', {className: `${baseClass}-bg`}, entity.content);

        // The character's name. Some modes will only show the base name, without the prefix and surname.
        let nameClass = `${baseClass}-name`;
        let name = DOM.ce('div', {className: nameClass}, entity.content);
        if (char.prefix) {
            DOM.ce('span', {className: `${nameClass}-prefix`}, name, DOM.ct(char.prefix + ' '));
        }
        name.append(DOM.ct(char.name));
        if (char.surname) {
            DOM.ce('span', {className: `${nameClass}-surname`}, name, DOM.ct(' ' + char.surname));
        }

        // The default image of the character.
        let sprite = char.spriteAlt || Img.CHARACTERS;
        let image = Img.createImage(sprite, char.spriteName, IMAGE_SCALE_CHAR_BOX);
        image.classList.add(`${baseClass}-image`);
        entity.content.appendChild(image);

        // The items the character starts with.
        let items = DOM.ce('div', {
            className: `${baseClass}-weapons`,
            dataset: {
                count: (char.weaponIds || []).length,
            },
        }, entity.content);
        let itemDisplayMode = mode === self.DISPLAY_MODE_DEFAULT ?
            VS.Item.DISPLAY_MODE_DEFAULT :
            VS.Item.DISPLAY_MODE_FRAME;
        (char.weaponIds || []).forEach(weaponId => {
            // noinspection JSCheckFunctionSignatures Realistically, this can't actually return undefined.
            items.appendChild(
                VS.Item.render(VS.TYPE_WEAPON, VS.Weapon.get(weaponId), {
                    mode: itemDisplayMode,
                    scale: IMAGE_SCALE_CHAR_BOX,
                }),
            );
        });
        (char.passiveIds || []).forEach(passiveId => {
            // noinspection JSCheckFunctionSignatures Realistically, this can't actually return undefined.
            items.appendChild(
                VS.Item.render(VS.TYPE_PASSIVE, VS.Passive.get(passiveId), {
                    mode: itemDisplayMode,
                    scale: IMAGE_SCALE_CHAR_BOX,
                }),
            );
        });
        (char.items || []).forEach(filename =>
            items.appendChild(Img.createImage(Img.ITEMS, filename, IMAGE_SCALE_CHAR_BOX))
        );

        // The description, which is only visible in some modes.
        if (char.description) {
            DOM.ce('div', {className: `${baseClass}-description`}, entity.content, DOM.ct(char.description));
        }

        if (buttonText && buttonAction) {
            let button = DOM.createButton(
                buttonText,
                buttonAction,
                DOM.BUTTON_COLOR_BLUE,
                DOM.BUTTON_STYLE_DEFAULT_CASE,
            );
            button.classList.add('vs-char-box-button');
            entity.content.appendChild(button);
        }

        if (mode === self.DISPLAY_MODE_DEFAULT) {
            entity.wrapper.appendChild(VS.createTooltip(char));
        }

        return entity.wrapper;
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Append rows of character stats to the given table.
     *
     * @param {HTMLTableElement} table
     * @param {CharStats}        stats
     * @param {Object}           [options]
     * @param {boolean}          [options.isBaseStat]
     * @param {boolean}          [options.isLevelUpBonus]
     */
    function appendStatRowsToTable(table, stats, options) {
        options = options || {};

        let level;
        if (options.isLevelUpBonus) {
            level = stats.level || EVERY_LEVEL_INDICATOR;
            delete stats.level;
        }

        let statEntries = Object.entries(stats);
        statEntries.sort((a, b) => {
            let aPos = STAT_DISPLAY_ORDER.indexOf(a[0]);
            let bPos = STAT_DISPLAY_ORDER.indexOf(b[0]);

            if (bPos === -1) {
                if (aPos === -1) {
                    return a[0].localeCompare(b[0]);
                }

                return -1;
            } else if (aPos === -1) {
                return 1;
            }

            return aPos > bPos ? 1 : -1;
        });

        let statsAdded = 0;
        statEntries.forEach(([stat, value]) => {
            if (!value) {
                return;
            }

            let statData = STAT_DATA[stat];
            let error = !statData;
            if (error) {
                VST.error('Displaying an unknown stat.', JSON.stringify(stat), value);
                statData = {
                    name: `[${stat}]`,
                    description: 'Unknown stat.',
                };
            }

            if (statData.hide) {
                return;
            }

            let displayValue = getStatDisplayValue(statData, value, options.isBaseStat);
            if (displayValue === '') {
                return;
            }

            let row = DOM.ce('tr', undefined, table);

            if (level) {
                if (statsAdded) {
                    DOM.ce('td', undefined, row);
                } else {
                    DOM.ce('td', {style: {
                        fontWeight: 'bold',
                        paddingRight: '3px',
                        textAlign: 'right',
                        width: '1px',
                    }}, row, DOM.ct(level.toString()));
                }
            }

            let nameCol = DOM.ce('td', undefined, row);
            let statIconImage = Img.createImage(Img.ITEMS, `${statData.image}.png`, 0.8);
            DOM.ce('span', {className: 'vst-stat-icon'}, nameCol, statIconImage);
            nameCol.appendChild(DOM.ct(statData.name));

            DOM.ce('td', {style: {
                color: 'yellow',
                textAlign: 'right',
            }}, row, DOM.ct(displayValue));

            if (error) {
                row.style.color = 'orange';
            }

            statsAdded++;
        });

        if (!statsAdded) {
            let row = DOM.ce('tr', undefined, table);
            DOM.ce('td', {
                style: {
                    color: '#bbb',
                },
            }, row, DOM.ct('No stats data.'));
        }
    }

    /**
     * Returns the given number with JavaScript float precision problems rounded off.
     *
     * @param {number} number
     * @return {number}
     */
    function fixFloat(number) {
        return parseFloat(parseFloat(number.toString()).toPrecision(12));
    }

    /**
     * Returns the given stat value formatted for display.
     *
     * @param {StatData}      statData
     * @param {number|string} value
     * @param {boolean}       isBaseStat
     * @return {string}
     */
    function getStatDisplayValue(statData, value, isBaseStat) {
        let display = value;
        let prefix = '';
        let suffix = '';

        if (typeof display !== 'number') {
            return display;
        }

        let multiplier = statData.isPercent ? 100 : 1;

        display = fixFloat(display * multiplier);

        if (statData.isPercent) {
            if (isBaseStat && display !== 0) {
                display -= multiplier;
            }

            suffix = '%';
        }

        if (statData.precision) {
            display = display.toFixed(statData.precision);
        }

        if (display > 0 && (!isBaseStat || !statData.noPlusSymbol)) {
            prefix = '+';
        }

        // If we have no value, return an empty string.
        if (display === 0) {
            return '';
        }

        // Return the fully formatted value.
        return prefix + display + suffix;
    }

    /**
     * Creates and returns a table to display character stats in.
     *
     * @return {HTMLTableElement}
     */
    function getStatsTable() {
        return DOM.ce('table', {className: 'vst-stat-table'});
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
