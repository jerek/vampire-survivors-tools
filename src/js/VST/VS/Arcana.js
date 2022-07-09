/**
 * Functions related to Vampire Survivors arcanas.
 */
VST.VS.Arcana = new function () {
    const Img = VST.VS.Img;
    const VS = VST.VS;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {EntityData} ArcanaData Data describing an arcana.
     * @property {string}   description
     * @property {ArcanaId} id          This MUST NOT change, because it's used in the URL for saved builds.
     * @property {string}   name
     * @property {VsType}   type        The Arcana type ID.
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
        },
        // 2: {name: 'Aquarius', description: '???'},
        // 3: {name: '???', description: '???'},
        4: {
            name: 'III - Tragic Princess',
            description: 'The cooldown of the listed weapons reduces when moving.',
        },
        5: {
            name: 'IV - Awake',
            description: 'Gives +3 Revivals. Consuming a Revival gives +10% MaxHealth, +1 Armor, and +5% Might, ' +
                'Area, Duration, and Speed.',
        },
        6: {
            name: 'V - Chaos in the Dark Night',
            description: 'Overall projectile Speed continuously changes between -50% and +200% over 10 seconds.',
        },
        7: {
            name: 'VI - Sarabande of Healing',
            description: 'Healing is doubled. Recovering HP damages nearby enemies for the same amount.',
        },
        8: {
            name: 'VII - Iron Blue Will',
            description: 'Listed weapon projectiles gain up to 3 bounces and might pass through enemies and walls.',
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
        },
        12: {
            name: 'XI - Waltz of Pearls',
            description: 'Listed weapon projectiles gain up to 3 bounces.',
        },
        13: {
            name: 'XII - Out of Bounds',
            description: 'Freezing enemies generates explosions. Orologions are easier to find.',
        },
        // 14: {name: '???', description: '???'},
        15: {
            name: 'XIV - Jail of Crystal',
            description: 'Listed weapon projectiles have a chance to freeze enemies.',
        },
        16: {
            name: 'XV - Disco of Gold',
            description: 'Picking up coin bags from the floor triggers Gold Fever. Obtaining gold restores as many HP.',
        },
        17: {
            name: 'XVI - Slash',
            description: 'Enables critical hits for listed weapons. Doubles overall critical damage.',
        },
        18: {
            name: 'XVII - Lost & Found Painting',
            description: 'Overall Duration continuously changes between -50% and +200% over 10 seconds.',
        },
        19: {
            name: 'XVIII - Boogaloo of Illusions',
            description: 'Overall Area continuously changes between -25% and +50% over 10 seconds.',
        },
        20: {
            name: 'XIX - Heart of Fire',
            description: 'Listed weapon projectiles explode on impact. Light sources explode. Character explodes ' +
                'when damaged.',
        },
        21: {
            name: 'XX - Silent Old Sanctuary',
            description: 'Gives +3 Reroll, Skip, and Banish. Gives +20% Might and -8% Cooldown for each active ' +
                'weapon slot left empty.',
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
