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
     * @property {string}       description
     * @property {ArcanaId}     id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}       name
     * @property {ArcanaItem[]} related     A list of items related to an arcana. Shown in the tooltip.
     * @property {VsType}       type        The Arcana type ID.
     */

    /**
     * @typedef {{weapon: WeaponId}|{passive: PassiveId}|{item: VsImgFilename}} ArcanaItem An item related to an arcana.
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
            related: [
                {item: 'GemBlue.png'},
                {item: 'BoxOpen.png'},
            ],
        },
        2: {
            name: 'I - Gemini',
            description: 'Listed weapons come with a counterpart.',
            related: [
                {weapon: VS.WEAPON_ID_PEACHONE},
                {weapon: VS.WEAPON_ID_EBONY_WINGS},
                {weapon: VS.WEAPON_ID_VANDALIER},
                {weapon: VS.WEAPON_ID_PHIERA_DER_TUPHELLO},
                {weapon: VS.WEAPON_ID_EIGHT_THE_SPARROW},
                {weapon: VS.WEAPON_ID_PHIERAGGI},
                {weapon: VS.WEAPON_ID_GATTI_AMARI},
                {weapon: VS.WEAPON_ID_VICIOUS_HUNGER},
                {weapon: VS.WEAPON_ID_SHADOW_SERVANT},
                {weapon: VS.WEAPON_ID_OPHION},
                {weapon: VS.WEAPON_ID_PARTY_POPPER},
                {item: 'Nft1.png'},
            ],
        },
        3: {
            name: 'II - Twilight Requiem',
            description: 'Listed weapon projectiles generate explosions when they expire.',
            related: [
                {weapon: VS.WEAPON_ID_KING_BIBLE},
                {weapon: VS.WEAPON_ID_UNHOLY_VESPERS},
                {weapon: VS.WEAPON_ID_LIGHTNING_RING},
                {weapon: VS.WEAPON_ID_THUNDER_LOOP},
                {weapon: VS.WEAPON_ID_PEACHONE},
                {weapon: VS.WEAPON_ID_EBONY_WINGS},
                {weapon: VS.WEAPON_ID_RUNETRACER},
                {weapon: VS.WEAPON_ID_SHADOW_PINION},
                {weapon: VS.WEAPON_ID_BONE},
                {weapon: VS.WEAPON_ID_CELESTIAL_DUSTING},
                {weapon: VS.WEAPON_ID_BI_BRACELET},
                {weapon: VS.WEAPON_ID_SILVER_WIND},
                {weapon: VS.WEAPON_ID_FESTIVE_WINDS},
                {weapon: VS.WEAPON_ID_PRISMATIC_MISSILE},
                {weapon: VS.WEAPON_ID_LUMINAIRE},
            ],
        },
        4: {
            name: 'III - Tragic Princess',
            description: 'The cooldown of the listed weapons reduces when moving.',
            related: [
                {weapon: VS.WEAPON_ID_GARLIC},
                {weapon: VS.WEAPON_ID_SOUL_EATER},
                {weapon: VS.WEAPON_ID_SANTA_WATER},
                {weapon: VS.WEAPON_ID_LA_BORRA},
                {weapon: VS.WEAPON_ID_LIGHTNING_RING},
                {weapon: VS.WEAPON_ID_THUNDER_LOOP},
                {weapon: VS.WEAPON_ID_CARRELLO},
            ],
        },
        5: {
            name: 'IV - Awake',
            description: 'Gives +3 Revivals. Consuming a Revival gives +10% MaxHealth, +1 Armor, and +5% Might, ' +
                'Area, Duration, and Speed.',
            related: [
                {passive: VS.PASSIVE_ID_TIRAGISU},
            ],
        },
        6: {
            name: 'V - Chaos in the Dark Night',
            description: 'Overall projectile Speed continuously changes between -50% and +200% over 10 seconds.',
            related: [
                {passive: VS.PASSIVE_ID_BRACER},
            ],
        },
        7: {
            name: 'VI - Sarabande of Healing',
            description: 'Healing is doubled. Recovering HP damages nearby enemies for the same amount.',
            related: [
                {weapon: VS.WEAPON_ID_BLOODY_TEAR},
                {weapon: VS.WEAPON_ID_FUWALAFUWALOO},
                {weapon: VS.WEAPON_ID_SOUL_EATER},
                {weapon: VS.WEAPON_ID_CELESTIAL_DUSTING},
                {passive: VS.PASSIVE_ID_PUMMAROLA},
                {weapon: VS.WEAPON_ID_SILVER_WIND},
                {weapon: VS.WEAPON_ID_FESTIVE_WINDS},
                {item: 'Roast.png'},
            ],
        },
        8: {
            name: 'VII - Iron Blue Will',
            description: 'Listed weapon projectiles gain up to 3 bounces and might pass through enemies and walls.',
            related: [
                {weapon: VS.WEAPON_ID_KNIFE},
                {weapon: VS.WEAPON_ID_THOUSAND_EDGE},
                {weapon: VS.WEAPON_ID_AXE},
                {weapon: VS.WEAPON_ID_DEATH_SPIRAL},
                {weapon: VS.WEAPON_ID_PHIERA_DER_TUPHELLO},
                {weapon: VS.WEAPON_ID_EIGHT_THE_SPARROW},
                {weapon: VS.WEAPON_ID_CARRELLO},
                {weapon: VS.WEAPON_ID_FLASH_ARROW},
                {weapon: VS.WEAPON_ID_MILLIONAIRE},
            ],
        },
        9: {
            name: 'VIII - Mad Groove',
            description: 'Every 2 minutes attracts all standard stage items, pickups, and light sources towards the ' +
                'character.',
            // TODO: Automatically add items from the selected stage.
        },
        10: {
            name: 'IX - Divine Bloodline',
            description: 'Armor also affects listed weapons\' damage and reflects enemy damage. Character gains bonus' +
                ' damage depending on missing Health. Defeating enemies with retaliatory damage gives +0.5 Max Health.',
            related: [
                {weapon: VS.WEAPON_ID_CROSS},
                {weapon: VS.WEAPON_ID_KING_BIBLE},
                {weapon: VS.WEAPON_ID_GARLIC},
                {weapon: VS.WEAPON_ID_SANTA_WATER},
                {weapon: VS.WEAPON_ID_LIGHTNING_RING},
                {weapon: VS.WEAPON_ID_SONG_OF_MANA},
                {weapon: VS.WEAPON_ID_VENTO_SACRO},
                {weapon: VS.WEAPON_ID_VICTORY_SWORD},
                {passive: VS.PASSIVE_ID_ARMOR},
                {passive: VS.PASSIVE_ID_HOLLOW_HEART},
                {weapon: VS.WEAPON_ID_SILVER_WIND},
            ],
        },
        11: {
            name: 'X - Beginning',
            description: 'Listed weapons get +1 Amount. The character\'s main weapon and its evolution gain +3 ' +
                'Amount instead.',
            related: [
                // TODO: Automatically add the selected character's main weapon and its evolution.
                {weapon: VS.WEAPON_ID_BONE},
                {weapon: VS.WEAPON_ID_CHERRY_BOMB},
                {weapon: VS.WEAPON_ID_CARRELLO},
                {weapon: VS.WEAPON_ID_CELESTIAL_DUSTING},
                {weapon: VS.WEAPON_ID_LA_ROBBA},
            ],
        },
        12: {
            name: 'XI - Waltz of Pearls',
            description: 'Listed weapon projectiles gain up to 3 bounces.',
            related: [
                {weapon: VS.WEAPON_ID_MAGIC_WAND},
                {weapon: VS.WEAPON_ID_HOLY_WAND},
                {weapon: VS.WEAPON_ID_FIRE_WAND},
                {weapon: VS.WEAPON_ID_HELLFIRE},
                {weapon: VS.WEAPON_ID_CROSS},
                {weapon: VS.WEAPON_ID_HEAVEN_SWORD},
                {weapon: VS.WEAPON_ID_CARRELLO},
            ],
        },
        13: {
            name: 'XII - Out of Bounds',
            description: 'Freezing enemies generates explosions. Orologions are easier to find.',
            related: [
                {weapon: VS.WEAPON_ID_CLOCK_LANCET},
                {weapon: VS.WEAPON_ID_MIRAGE_ROBE},
                {weapon: VS.WEAPON_ID_JODORE},
                {item: 'PocketWatch.png'},
            ],
        },
        14: {
            name: 'XIII - Wicked Season',
            description: 'Overall Growth, Luck, Greed, and Curse are doubled at fixed intervals. The characters ' +
                'starts gaining +1% Growth, Luck, Greed, and Curse every 2 levels.',
            related: [
                {passive: VS.PASSIVE_ID_CROWN},
                {passive: VS.PASSIVE_ID_CLOVER},
                {passive: VS.PASSIVE_ID_STONE_MASK},
                {passive: VS.PASSIVE_ID_SKULL_O_MANIAC},
            ],
        },
        15: {
            name: 'XIV - Jail of Crystal',
            description: 'Listed weapon projectiles have a chance to freeze enemies.',
            related: [
                {weapon: VS.WEAPON_ID_MAGIC_WAND},
                {weapon: VS.WEAPON_ID_HOLY_WAND},
                {weapon: VS.WEAPON_ID_RUNETRACER},
                {weapon: VS.WEAPON_ID_NO_FUTURE},
                {weapon: VS.WEAPON_ID_EIGHT_THE_SPARROW},
                {item: 'Guns2_counter.png'},
                {item: 'Silf1_counter.png'},
                {weapon: VS.WEAPON_ID_BRACELET},
                {weapon: VS.WEAPON_ID_PRISMATIC_MISSILE},
                {weapon: VS.WEAPON_ID_LUMINAIRE},
            ],
        },
        16: {
            name: 'XV - Disco of Gold',
            description: 'Picking up coin bags from the floor triggers Gold Fever. Obtaining gold restores as many HP.',
            related: [
                {weapon: VS.WEAPON_ID_VICIOUS_HUNGER},
                {passive: VS.PASSIVE_ID_STONE_MASK},
                {item: 'MoneyBagRed.png'},
                {item: 'MoneyBagGreen.png'},
                {item: 'MoneyBagColor.png'},
                {item: 'BoxOpen.png'},
            ],
        },
        17: {
            name: 'XVI - Slash',
            description: 'Enables critical hits for listed weapons. Doubles overall critical damage.',
            related: [
                {weapon: VS.WEAPON_ID_KNIFE},
                {weapon: VS.WEAPON_ID_THOUSAND_EDGE},
                {weapon: VS.WEAPON_ID_WHIP},
                {weapon: VS.WEAPON_ID_BLOODY_TEAR},
                {weapon: VS.WEAPON_ID_AXE},
                {weapon: VS.WEAPON_ID_DEATH_SPIRAL},
                {weapon: VS.WEAPON_ID_HEAVEN_SWORD},
                {weapon: VS.WEAPON_ID_VENTO_SACRO},
                {weapon: VS.WEAPON_ID_FUWALAFUWALOO},
                {weapon: VS.WEAPON_ID_VICTORY_SWORD},
                {weapon: VS.WEAPON_ID_MURAMASA},
                {weapon: VS.WEAPON_ID_ESKIZZIBUR},
                {weapon: VS.WEAPON_ID_LEGIONNAIRE},
                {weapon: VS.WEAPON_ID_FLASH_ARROW},
                {weapon: VS.WEAPON_ID_MILLIONAIRE},
            ],
        },
        18: {
            name: 'XVII - Lost & Found Painting',
            description: 'Overall Duration continuously changes between -50% and +200% over 10 seconds.',
            related: [
                {passive: VS.PASSIVE_ID_SPELLBINDER},
            ],
        },
        19: {
            name: 'XVIII - Boogaloo of Illusions',
            description: 'Overall Area continuously changes between -25% and +50% over 10 seconds.',
            related: [
                {passive: VS.PASSIVE_ID_CANDELABRADOR},
            ],
        },
        20: {
            name: 'XIX - Heart of Fire',
            description: 'Listed weapon projectiles explode on impact. Light sources explode. Character explodes ' +
                'when damaged.',
            related: [
                {weapon: VS.WEAPON_ID_FIRE_WAND},
                {weapon: VS.WEAPON_ID_HELLFIRE},
                {weapon: VS.WEAPON_ID_VALKYRIE_TURNER},
                {weapon: VS.WEAPON_ID_PHIERA_DER_TUPHELLO},
                {item: 'Guns_counter.png'},
                {item: 'Silf2_counter.png'},
                {weapon: VS.WEAPON_ID_TRI_BRACELET},
                {weapon: VS.WEAPON_ID_PRISMATIC_MISSILE},
                {weapon: VS.WEAPON_ID_LUMINAIRE},
                {item: 'Brazier1.png'},
            ],
        },
        21: {
            name: 'XX - Silent Old Sanctuary',
            description: 'Gives +3 Reroll, Skip, and Banish. Gives +20% Might and -8% Cooldown for each active ' +
                'weapon slot left empty.',
            related: [
                {item: 'Dice.png'},
                {item: 'Skip.png'},
                {item: 'Banish.png'},
            ],
        },
        22: {
            name: 'XXI - Blood Astronomia',
            description: 'Listed weapons also emit special damaging zones affected by Amount and Magnet. Enemies ' +
                'within Magnet range take damage based on Amount.',
            related: [
                {weapon: VS.WEAPON_ID_GARLIC},
                {weapon: VS.WEAPON_ID_SOUL_EATER},
                {weapon: VS.WEAPON_ID_PENTAGRAM},
                {weapon: VS.WEAPON_ID_GORGEOUS_MOON},
                {weapon: VS.WEAPON_ID_SONG_OF_MANA},
                {weapon: VS.WEAPON_ID_MANNAJJA},
                {weapon: VS.WEAPON_ID_CLOCK_LANCET},
                {weapon: VS.WEAPON_ID_LAUREL},
                {passive: VS.PASSIVE_ID_ATTRACTORB},
            ],
        },
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
        /** @type {ArcanaItem[]} */
        let related = arcana.related || [];

        let count = related.length;
        if (count > 0) {
            let evolutionSection = DOM.ce('div', {className: 'vst-tooltip-items'});
            let evolutionDiv = DOM.ce('div', {className: 'vst-tooltip-items-row'});

            let scale = Item.SCALE_TOOLTIP;
            if (count === 6) {
                // When there are 6 items it would show one item alone on a second line, so reduce the spacing a bit.
                evolutionDiv.dataset.spacing = 'reduced';
            } else if (count === 7) {
                // 7 items still looks a little awkward with two on a second line, so no spacing and reduce the scale.
                evolutionDiv.dataset.spacing = 'none';
                scale *= 0.925;
            }

            // Render the images.
            related.forEach(related => {
                if (related.weapon) {
                    evolutionDiv.appendChild(
                        Item.render(VS.TYPE_WEAPON, Weapon.get(related.weapon), {scale: scale}),
                    );
                } else if (related.passive) {
                    evolutionDiv.appendChild(
                        Item.render(VS.TYPE_PASSIVE, Passive.get(related.passive), {scale: scale}),
                    );
                } else if (related.item) {
                    evolutionDiv.appendChild(
                        Img.createImage(Img.ITEMS, related.item, scale),
                    );
                }
            });

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
     * When called during initialization, this may not be in the final order.
     *
     * @return {ArcanaId[]}
     */
    this.getIds = () => VS.getSortedIds(DATA);

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
