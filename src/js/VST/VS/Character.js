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
     * @typedef {EntityData} CharacterData Data describing a character.
     * @property {CharacterId}  id           This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}       name         The character's common name.
     * @property {string}       description  The character's in-game description.
     * @property {number}       order        The order that this character is shown in.
     * @property {VsSpriteFunc} spriteAlt    The sprite that the filename exists in, if different from "characters".
     * @property {string}       spriteName   The filename of the character's image within the "characters" sprite.
     * @property {VsType}       type         The Character type ID.
     * @property {string[]}     [items]      Filenames of non-weapon non-passive items shown in this char's portrait.
     * @property {PassiveId[]}  [passiveIds] The passive items the character starts with.
     * @property {string}       [prefix]     Text shown before the character's name when showing their full name.
     * @property {string}       [surname]    Text shown after the character's name when showing their full name.
     * @property {WeaponId[]}   [weaponIds]  The weapons the character starts with.
     */

    /** @typedef {EntityId} CharacterId A character's ID. */

    /** @typedef {string} CharDisplayMode What style of display a character box should be. */

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
     * @type {Object<CharacterId, CharacterData>} A custom representation of the game's character data. This includes a
     * lot of odd character data that is represented how I found it in the game data. For example, there are seven
     * characters named "LATODISOTTO", which are not all identical. Some of the odd character data includes manual key
     * strings that appear to contain what's intended to eventually be the name of a character in that slot, which I've
     * carried over in the description fields.
     * @property {CharacterId[]} sortedIds
     */
    const DATA = {
        1: {
            name: 'Antonio',
            surname: 'Belpaese',
            description: 'Gains 10% more damage every 10 levels (max +50%).',
            order: 1,
            spriteName: 'newAntonio_01.png',
            weaponIds: [VS.WEAPON_ID_WHIP],
        },
        2: {
            name: 'Imelda',
            surname: 'Belpaese',
            description: 'Gains 10% more experience every 5 levels (max +30%).',
            order: 2,
            spriteName: 'newImelda_01.png',
            weaponIds: [VS.WEAPON_ID_MAGIC_WAND],
        },
        3: {
            name: 'Pasqualina',
            surname: 'Belpaese',
            description: 'Projectiles get 10% faster every 5 levels (max +30%).',
            order: 3,
            spriteName: 'newPasqualina_01.png',
            weaponIds: [VS.WEAPON_ID_RUNETRACER],
        },
        4: {
            name: 'Gennaro',
            surname: 'Belpaese',
            description: 'Permanent +1 projectile (all weapons).',
            order: 4,
            spriteName: 'newGennaro_01.png',
            weaponIds: [VS.WEAPON_ID_KNIFE],
        },
        5: {
            name: 'Arca',
            surname: 'Ladonna',
            description: 'Weapon cooldown is reduced by 5% every 10 levels (max -15%).',
            order: 5,
            spriteName: 'newArca_01.png',
            weaponIds: [VS.WEAPON_ID_FIRE_WAND],
        },
        6: {
            name: 'Porta',
            surname: 'Ladonna',
            description: 'Permanent +30% area. Starts with temporary cooldown bonus.',
            order: 6,
            spriteName: 'newPorta_01.png',
            weaponIds: [VS.WEAPON_ID_LIGHTNING_RING],
        },
        7: {
            name: 'Lama',
            surname: 'Ladonna',
            description: 'Gains +5% Might, MoveSpeed, and Curse every 10 levels (max +20%).',
            order: 7,
            spriteName: 'newLama_01.png',
            weaponIds: [VS.WEAPON_ID_AXE],
        },
        8: {
            name: 'Poe',
            surname: 'Ratcho',
            description: 'Permanent +25% pickup radius and -30 max health.',
            order: 8,
            spriteName: 'newOld3_01.png',
            weaponIds: [VS.WEAPON_ID_GARLIC],
        },
        9: {
            name: 'Clerici',
            description: 'Permanent +0.5 HP/s and +50 Max Health. Starts with temporary area bonus.',
            spriteName: 'newSuora_01.png',
            order: 9,
            prefix: 'Suor',
            weaponIds: [VS.WEAPON_ID_SANTA_WATER],
        },
        10: {
            name: 'Dommario',
            description: 'Permanent +40% duration and speed, -40% move speed.',
            order: 10,
            spriteName: 'newDommario_01.png',
            weaponIds: [VS.WEAPON_ID_KING_BIBLE],
        },
        11: {
            name: 'Krochi',
            surname: 'Freetto',
            description: 'Starts with 1 Revival. Gains 1 more Revival at level 33.',
            order: 11,
            spriteName: 'newKrochi_01.png',
            weaponIds: [VS.WEAPON_ID_CROSS],
        },
        12: {
            name: 'Christine',
            surname: 'Davain',
            description: 'Starts with 1 extra level.',
            order: 12,
            spriteName: 'newChristine_01.png',
            weaponIds: [VS.WEAPON_ID_PENTAGRAM],
        },
        13: {
            name: 'Pugnala',
            surname: 'Provola',
            description: 'Gains +1% Might every level.',
            order: 13,
            spriteName: 'Pugnala_01.png',
            weaponIds: [VS.WEAPON_ID_PHIERA_DER_TUPHELLO, VS.WEAPON_ID_EIGHT_THE_SPARROW],
        },
        14: {
            name: 'Giovanna',
            surname: 'Grana',
            description: 'Gains +1% Projectile Speed every level.',
            order: 14,
            spriteName: 'newGiovanna_01.png',
            weaponIds: [VS.WEAPON_ID_GATTI_AMARI],
        },
        15: {
            name: 'Poppea',
            surname: 'Pecorina',
            description: 'Gains +1% Duration every level.',
            order: 15,
            spriteName: 'newPoppea_01.png',
            weaponIds: [VS.WEAPON_ID_SONG_OF_MANA],
        },
        16: {
            name: 'Concetta',
            surname: 'Caciotta',
            description: 'Gains +1% Area every level.',
            order: 16,
            spriteName: 'Concetta_i01.png',
            weaponIds: [VS.WEAPON_ID_SHADOW_PINION],
        },
        17: {
            name: 'Mortaccio',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 17,
            spriteName: 'Mortaccio_01.png',
            weaponIds: [VS.WEAPON_ID_BONE],
        },
        18: {
            name: 'Cavallo',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 18,
            spriteName: 'Cavallo_01.png',
            prefix: 'Yatta',
            weaponIds: [VS.WEAPON_ID_CHERRY_BOMB],
        },
        19: {
            name: 'Ramba',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 19,
            spriteName: 'Ramba_01.png',
            prefix: 'Bianca',
            weaponIds: [VS.WEAPON_ID_CARRELLO],
        },
        20: {
            name: 'O\'Sole',
            surname: 'Meeo',
            description: 'Gets more projectiles every 20 levels (max+3).',
            order: 20,
            spriteName: 'Dog_01.png',
            weaponIds: [VS.WEAPON_ID_CELESTIAL_DUSTING],
        },
        21: {
            name: 'Ambrojoe',
            description: 'Gets more projectiles every 20 levels (max+3). Starts with temporary Amount bonus.',
            order: 21,
            prefix: 'Sir',
            spriteName: 'Hat_01.png',
            weaponIds: [VS.WEAPON_ID_LA_ROBBA],
        },
        22: {
            name: 'Gallo',
            surname: 'Valletto',
            description: 'Starts with 1 extra level. Gains +10% Growth every 5 levels (max +50%).',
            order: 22,
            spriteName: 'Gallo_01.png',
            prefix: 'Iguana',
            weaponIds: [VS.WEAPON_ID_CLOCK_LANCET],
        },
        23: {
            name: 'Divano',
            surname: 'Thelma',
            description: 'Starts with 1 extra level. Gains +1 Armor every 5 levels (max +5).',
            order: 23,
            spriteName: 'Divano_01.png',
            weaponIds: [VS.WEAPON_ID_LAUREL],
        },
        24: {
            name: 'Zi\'Assunta',
            surname: 'Belpaese',
            description: 'Gains +0.5% Might, projectile Speed, Duration, and Area every level.',
            order: 24,
            spriteName: 'newAssunta_01.png',
            weaponIds: [VS.WEAPON_ID_VENTO_SACRO],
        },
        34: {
            name: 'Gyorunton',
            description: 'Gains +1% Curse every level. Can find evolutions in any Treasure.',
            order: 25,
            spriteName: 'Dragogion_01.png',
            weaponIds: [VS.WEAPON_ID_BRACELET],
        },
        25: {
            name: 'Exdash',
            surname: 'Exiviiq',
            description: 'At least they\'re lucky.',
            order: 26,
            spriteName: 'Exdash_01.png',
            weaponIds: [VS.WEAPON_ID_EBONY_WINGS],
        },
        26: {
            name: 'Toastie',
            description: 'So much potential.',
            order: 27,
            spriteName: 'uExdash_01.png',
            weaponIds: [VS.WEAPON_ID_PEACHONE],
        },
        27: {
            name: 'Smith',
            surname: 'IV',
            description: 'The quirky white bear.',
            order: 28,
            spriteName: 'nExdash_01.png',
            weaponIds: [VS.WEAPON_ID_VANDALIER],
        },
        38: {
            name: 'Random',
            description: 'Random.',
            order: 29,
            spriteName: 'random_01.png',
            weaponIds: [],
        },
        28: {
            name: 'Marrabbio',
            description: '',
            order: 30,
            spriteName: 'Marrabbio_01.png',
            prefix: 'Boon',
            weaponIds: [VS.WEAPON_ID_THOUSAND_EDGE],
        },
        40: {
            name: 'Avatar',
            surname: 'Infernas',
            description: 'Starts with extra Arcana XIX - Heart Of Fire. Grows stronger with every level, but also ' +
                'loses control.',
            order: 31,
            spriteName: 'v_01.png',
            weaponIds: [VS.WEAPON_ID_FLAMES_OF_MISSPELL],
        },
        29: {
            name: 'Minnah',
            surname: 'Mannarah',
            description: 'Might, projectile Speed, Duration, Area, and Cooldown change every minute.',
            order: 32,
            spriteName: 'Minnah_01.png',
            weaponIds: [VS.WEAPON_ID_BLOODY_TEAR],
        },
        30: {
            name: 'Leda',
            description: '',
            order: 33,
            spriteName: 'XLLeda_i01.png',
            weaponIds: [VS.WEAPON_ID_HOLY_WAND],
        },
        35: {
            name: 'Cosmo',
            surname: 'Pavone',
            description: 'Gains +1 Recovery and +1% Luck every level. Gains +1 Revival every 100 levels. Has hidden ' +
                'weapons.',
            order: 34,
            spriteName: 'Cosmic_01.png',
            weaponIds: [],
        },
        31: {
            name: 'Peppino',
            description: 'Starts with temporarily reduced area.',
            order: 35,
            spriteName: 'Peppino_01.png',
            weaponIds: [VS.WEAPON_ID_SOUL_EATER],
        },
        36: {
            prefix: 'Big',
            name: 'Trouser',
            description: 'Gains +1% Greed every level. Gold Fever lasts longer.',
            order: 36,
            spriteName: 'Pantalone_01.png',
            items: ['candybox.png'],
        },
        39: {
            name: 'missingN▯',
            description: '',
            order: 37,
            spriteName: '_0x00000000_i01.png',
            weaponIds: [VS.WEAPON_ID_DEATH_SPIRAL],
        },
        33: {
            name: 'Gains',
            description: 'Gains +2% Growth every level.',
            order: 38,
            spriteName: 'XLDragon1_i01.png',
            surname: 'Boros',
            weaponIds: [VS.WEAPON_ID_HEAVEN_SWORD],
        },
        32: {
            name: 'Red Death',
            description: 'A blasphemous mockery.',
            order: 39,
            spriteName: 'newXLReaper_i01.png',
            prefix: 'Mask of the',
            weaponIds: [VS.WEAPON_ID_DEATH_SPIRAL],
        },
        37: {
            prefix: 'Queen',
            name: 'Sigma',
            description: 'She owns everything.',
            order: 40,
            spriteName: 's_01.png',
            weaponIds: [VS.WEAPON_ID_VICTORY_SWORD],
        },
        // There's some weird extra character data in the game files. Initially I included it all (just commented out),
        // in the hopes that it would lead to something interesting. After the initial update of 0.7.2 => 0.7.360, it
        // doesn't look like that'll pay off. So I'm going to keep an eye on this data in future patches, but basically
        // just leave this data here to rot and remind me to watch for anything meaningful.
        // 22: {name: 'LATODISOTTO', description: 'LATOEVEST', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 23: {name: 'LATOEVEST  ', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 24: {name: 'LATODILATO ', description: 'MARIANNA', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 25: {name: 'LATOEVEST  ', description: 'SIGMA', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 28: {name: 'LATODISOPRO', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 29: {name: 'LATODISOTTO', description: 'ODDEEO', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 30: {name: 'LATODISOTTO', description: 'VOID', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 31: {name: 'LATODILATO ', description: 'RED', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 32: {name: '', description: 'IOLO', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 37: {name: 'LATODILATO ', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 38: {name: 'LATODISOTTO', description: 'FINO', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 39: {name: 'LATODILATO ', description: 'LATODILATO', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 43: {name: 'LATODISOTTO', description: 'DEATH', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 44: {name: 'LATODILATO ', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 45: {name: 'LATODISOTTO', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 46: {name: 'LATOEVEST  ', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 47: {name: 'LATODISOTTO', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 48: {name: 'LATOEVEST  ', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 49: {name: 'LATODILATO ', description: 'PENTA', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 50: {name: 'LATODILATO ', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 51: {name: 'LATODILATO ', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
        // 52: {name: 'LATODISOPRO', description: '', passiveIds: [VS.PASSIVE_ID_DUPLICATOR]},
    };

    /** @type {number} The scaling size of the character and weapon images in the standard character boxes. */
    const IMAGE_SCALE_CHAR_BOX = 1.72;

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_CHARACTER;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the character with the given ID.
     *
     * @param {CharacterId} id
     * @return {CharacterData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns a list of all character IDs.
     *
     * @return {CharacterId[]}
     */
    this.getIds = () => DATA.sortedIds;

    /**
     * Returns elements created to display a character box.
     *
     * If both the buttonText and buttonAction optional params are supplied, a blue button will be added to the
     * bottom-right of the character box. The button may still not be visible, depending on the mode.
     *
     * @param {CharacterData}   char
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

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
