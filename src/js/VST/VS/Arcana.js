/**
 * Functions related to Vampire Survivors arcanas.
 */
VST.VS.Arcana = new function () {
    const DOM = VST.DOM;
    const Img = VST.VS.Img;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {EntityData} ArcanaData Data describing an arcana.
     * @property {string}      description
     * @property {ArcanaId}    id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}      name
     * @property {VsType}      type        The Arcana type ID.
     * @property {string[]}    [items]     Filenames of non-weapon non-passive items that are relevant to this arcana.
     * @property {PassiveId[]} [passives]  Passive items relevant to this arcana.
     * @property {WeaponId[]}  [weapons]   Weapons relevant to this arcana.
     */

    /** @typedef {EntityId} ArcanaId An arcana's ID. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // noinspection JSValidateTypes Types and IDs are filled during initialization, so ignore warnings here.
    /**
     * @type {Object<ArcanaId, ArcanaData>} A custom representation of the game's arcana data.
     * @property {ArcanaId[]} sortedIds
     */
    const DATA = {
        1: {
            name: 'Game Killer',
            description: 'Halts XP gain. XP gems turn into exploding projectiles. All Treasures contain at least 3 ' +
                'items.',
            items: ['GemBlue.png', 'BoxOpen.png'],
        },
        // 2: {name: 'Aquarius', description: '???'},
        // 3: {name: '???', description: '???'},
        4: {
            name: 'III - Tragic Princess',
            description: 'The cooldown of the listed weapons reduces when moving.',
            weapons: [
                VS.WEAPON_ID_GARLIC,
                VS.WEAPON_ID_SOUL_EATER,
                VS.WEAPON_ID_SANTA_WATER,
                VS.WEAPON_ID_LA_BORRA,
                VS.WEAPON_ID_LIGHTNING_RING,
                VS.WEAPON_ID_THUNDER_LOOP,
                VS.WEAPON_ID_CARRELLO,
            ],
        },
        5: {
            name: 'IV - Awake',
            description: 'Gives +3 Revivals. Consuming a Revival gives +10% MaxHealth, +1 Armor, and +5% Might, ' +
                'Area, Duration, and Speed.',
            passives: [VS.PASSIVE_ID_TIRAGISU],
        },
        6: {
            name: 'V - Chaos in the Dark Night',
            description: 'Overall projectile Speed continuously changes between -50% and +200% over 10 seconds.',
            passives: [VS.PASSIVE_ID_BRACER],
        },
        7: {
            name: 'VI - Sarabande of Healing',
            description: 'Healing is doubled. Recovering HP damages nearby enemies for the same amount.',
            items: ['Roast.png'],
            passives: [VS.PASSIVE_ID_PUMMAROLA],
            weapons: [
                VS.WEAPON_ID_BLOODY_TEAR,
                VS.WEAPON_ID_FUWALAFUWALOO,
                VS.WEAPON_ID_SOUL_EATER,
                VS.WEAPON_ID_CELESTIAL_DUSTING,
            ],
        },
        8: {
            name: 'VII - Iron Blue Will',
            description: 'Listed weapon projectiles gain up to 3 bounces and might pass through enemies and walls.',
            weapons: [
                VS.WEAPON_ID_KNIFE,
                VS.WEAPON_ID_THOUSAND_EDGE,
                VS.WEAPON_ID_AXE,
                VS.WEAPON_ID_DEATH_SPIRAL,
                VS.WEAPON_ID_PHIERA_DER_TUPHELLO,
                VS.WEAPON_ID_EIGHT_THE_SPARROW,
                VS.WEAPON_ID_CARRELLO,
            ],
        },
        9: {
            name: 'VIII - Mad Groove',
            description: 'Every 2 minutes attracts all standard stage items, pickups, and light sources towards the ' +
                'character.',
        },
        // 10: {name: '???', description: '???'},
        11: {
            name: 'X - Beginning',
            description: 'Listed weapons get +1 Amount. The character\'s main weapon and its evolution gain +3 ' +
                'Amount instead.',
            weapons: [
                VS.WEAPON_ID_DEATH_SPIRAL,
                VS.WEAPON_ID_BONE,
                VS.WEAPON_ID_CHERRY_BOMB,
                VS.WEAPON_ID_CARRELLO,
                VS.WEAPON_ID_CELESTIAL_DUSTING,
                VS.WEAPON_ID_LA_ROBBA,
            ],
        },
        12: {
            name: 'XI - Waltz of Pearls',
            description: 'Listed weapon projectiles gain up to 3 bounces.',
            weapons: [
                VS.WEAPON_ID_MAGIC_WAND,
                VS.WEAPON_ID_HOLY_WAND,
                VS.WEAPON_ID_FIRE_WAND,
                VS.WEAPON_ID_HELLFIRE,
                VS.WEAPON_ID_CROSS,
                VS.WEAPON_ID_HEAVEN_SWORD,
                VS.WEAPON_ID_CARRELLO,
            ],
        },
        13: {
            name: 'XII - Out of Bounds',
            description: 'Freezing enemies generates explosions. Orologions are easier to find.',
            items: ['PocketWatch.png'],
            weapons: [VS.WEAPON_ID_CLOCK_LANCET],
        },
        // 14: {name: '???', description: '???'},
        15: {
            name: 'XIV - Jail of Crystal',
            description: 'Listed weapon projectiles have a chance to freeze enemies.',
            weapons: [
                VS.WEAPON_ID_MAGIC_WAND,
                VS.WEAPON_ID_HOLY_WAND,
                VS.WEAPON_ID_RUNETRACER,
                VS.WEAPON_ID_NO_FUTURE,
                VS.WEAPON_ID_EIGHT_THE_SPARROW,
            ],
        },
        16: {
            name: 'XV - Disco of Gold',
            description: 'Picking up coin bags from the floor triggers Gold Fever. Obtaining gold restores as many HP.',
            items: ['MoneyBagRed.png', 'MoneyBagGreen.png', 'MoneyBagColor.png', 'BoxOpen.png'],
            passives: [VS.PASSIVE_ID_STONE_MASK],
            weapons: [VS.WEAPON_ID_VICIOUS_HUNGER],
        },
        17: {
            name: 'XVI - Slash',
            description: 'Enables critical hits for listed weapons. Doubles overall critical damage.',
            weapons: [
                VS.WEAPON_ID_KNIFE,
                VS.WEAPON_ID_THOUSAND_EDGE,
                VS.WEAPON_ID_WHIP,
                VS.WEAPON_ID_BLOODY_TEAR,
                VS.WEAPON_ID_AXE,
                VS.WEAPON_ID_DEATH_SPIRAL,
                VS.WEAPON_ID_HEAVEN_SWORD,
                VS.WEAPON_ID_VENTO_SACRO,
                VS.WEAPON_ID_FUWALAFUWALOO,
            ],
        },
        18: {
            name: 'XVII - Lost & Found Painting',
            description: 'Overall Duration continuously changes between -50% and +200% over 10 seconds.',
            passives: [VS.PASSIVE_ID_SPELLBINDER],
        },
        19: {
            name: 'XVIII - Boogaloo of Illusions',
            description: 'Overall Area continuously changes between -25% and +50% over 10 seconds.',
            passives: [VS.PASSIVE_ID_CANDELABRADOR],
        },
        20: {
            name: 'XIX - Heart of Fire',
            description: 'Listed weapon projectiles explode on impact. Light sources explode. Character explodes ' +
                'when damaged.',
            items: ['Brazier1.png'],
            weapons: [
                VS.WEAPON_ID_FIRE_WAND,
                VS.WEAPON_ID_HELLFIRE,
                VS.WEAPON_ID_PHIERA_DER_TUPHELLO,
                VS.WEAPON_ID_VALKYRIE_TURNER
            ],
        },
        21: {
            name: 'XX - Silent Old Sanctuary',
            description: 'Gives +3 Reroll, Skip, and Banish. Gives +20% Might and -8% Cooldown for each active ' +
                'weapon slot left empty.',
            items: ['Dice.png', 'Skip.png', 'Banish.png'],
        },
        // 22: {name: 'Bloody', description: '???'},
    };

    /** @type {number} The standard scaling size of arcana card images. */
    const IMAGE_SCALE_CARDS = 1.5;

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_ARCANA;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Add any relevant arcana-specific tooltip content to the given arcana tooltip.
     *
     * @param {HTMLDivElement} tooltip
     * @param {ArcanaData}     arcana
     */
    this.addTooltipContent = function (tooltip, arcana) {
        const Item = VS.Item;
        const Passive = VS.Passive;
        const Weapon = VS.Weapon;

        //               //
        // RELATED ITEMS //
        //               //

        // TODO: Dynamically display the current stage's items for Mad Groove.
        let items = arcana.items || [];
        let passives = arcana.passives || [];
        let weapons = arcana.weapons || [];

        let totalCount = items.length + passives.length + weapons.length;
        if (totalCount > 0) {
            // When there are 6 items it would show one item alone on a second line, so shrink the images a bit.
            let scale = totalCount === 6 ? Item.SCALE_TOOLTIP * 0.85 : Item.SCALE_TOOLTIP;

            let evolutionSection = DOM.ce('div', {className: 'vst-tooltip-items'});
            let evolutionDiv = DOM.ce('div', {className: 'vst-tooltip-items-row'});

            // Render the images.
            weapons.forEach(weaponId => evolutionDiv.appendChild(
                Item.render(VS.TYPE_WEAPON, Weapon.get(weaponId), {scale: scale}),
            ));
            passives.forEach(passiveId => evolutionDiv.appendChild(
                Item.render(VS.TYPE_PASSIVE, Passive.get(passiveId), {scale: scale}),
            ));
            items.forEach(filename => evolutionDiv.appendChild(
                Img.createImage(Img.ITEMS, filename, scale),
            ));

            evolutionSection.appendChild(evolutionDiv);
            tooltip.appendChild(evolutionSection);
        }
    };

    /**
     * Returns the arcana with the given ID.
     *
     * @param {ArcanaId} id
     * @return {ArcanaData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns a list of all arcana IDs.
     *
     * @return {ArcanaId[]}
     */
    this.getIds = () => DATA.sortedIds;

    /**
     * Returns elements created to display an arcana card.
     *
     * @param {ArcanaData} arcana
     * @param {string}     [tagName="div"] The tag name to use for the element.
     * @param {number}     [scale]         The 1-base scale at which images should be displayed. Default: 2
     * @return {HTMLSpanElement|HTMLElement}
     */
    this.renderCard = function (arcana, tagName, scale) {
        if (!scale) {
            scale = IMAGE_SCALE_CARDS;
        }

        let entity = VS.createEntityElements(TYPE, arcana, tagName);

        entity.content.appendChild(Img.createImage(Img.ARCANA, getCardImageFilename(arcana.id), scale));

        entity.wrapper.appendChild(VS.createTooltip(arcana));

        return entity.wrapper;
    };

    /**
     * Returns the filename to display an arcana card image for the given arcana ID.
     *
     * @param {ArcanaId} id
     * @return {string}
     */
    function getCardImageFilename(id) {
        id--;
        let baseName = id < 10 ? `0${id}` : id;

        return `${baseName}.png`;
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
