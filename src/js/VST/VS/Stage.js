/**
 * Functions related to Vampire Survivors stages.
 */
VST.VS.Stage = new function () {
    const VS = VST.VS;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // noinspection JSValidateTypes Types and IDs are filled during initialization, so ignore warnings here.
    /**
     * @type {Object<StageId, StageData>} A custom representation of the game's stage data.
     * @property {StageId[]} sortedIds
     */
    const DATA = {
        1: {
            name: 'Il Molise',
            description: 'There exists places that don\'t exist. Come to relax and enjoy life. See you in the country.',
            order: 6,
            passives: [
                VS.PASSIVE_ID_SILVER_RING,
                VS.PASSIVE_ID_GOLD_RING,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        2: {
            name: 'Green Acres',
            description: 'A place not made for mortals. Fate changes every minute.',
            order: 8,
            passives: [
                VS.PASSIVE_ID_SILVER_RING,
                VS.PASSIVE_ID_GOLD_RING,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        3: {
            name: 'The Bone Zone',
            description: 'Come over here and say your unholy vespers.',
            order: 9,
            passives: [
                VS.PASSIVE_ID_SILVER_RING,
                VS.PASSIVE_ID_GOLD_RING,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        4: {
            name: 'Mad Forest',
            description: 'The Castle is a lie, but there\'s still free roast chicken here, so it\'s all good.',
            order: 1,
            passives: [
                VS.PASSIVE_ID_SPINACH,
                VS.PASSIVE_ID_CLOVER,
                VS.PASSIVE_ID_HOLLOW_HEART,
                VS.PASSIVE_ID_PUMMAROLA,
                VS.PASSIVE_ID_SKULL_O_MANIAC,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
                VS.PASSIVE_ID_GOLD_RING,
                VS.PASSIVE_ID_SILVER_RING,
            ],
        },
        5: {
            name: 'Inlaid Library',
            description: 'This quiet, long library is the ideal place where to rest, meditate, and forage for roast chicken. But what\'s a stone mask doing here?',
            order: 2,
            passives: [
                VS.PASSIVE_ID_STONE_MASK,
                VS.PASSIVE_ID_EMPTY_TOME,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_SILVER_RING,
                VS.PASSIVE_ID_GOLD_RING,
            ],
        },
        6: {
            name: 'Dairy Plant',
            description: 'The magic map hidden in here might finally lead us to a vampire, or at least to more roast chicken.',
            order: 3,
            passives: [
                VS.PASSIVE_ID_ATTRACTORB,
                VS.PASSIVE_ID_CANDELABRADOR,
                VS.PASSIVE_ID_ARMOR,
                VS.PASSIVE_ID_WINGS,
                VS.PASSIVE_ID_GOLD_RING,
                VS.PASSIVE_ID_SILVER_RING,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        7: {
            name: 'Gallo Tower',
            description: 'This tower hides great magical artifacts and historically accurate monsters.',
            order: 4,
            passives: [
                VS.PASSIVE_ID_BRACER,
                VS.PASSIVE_ID_SPELLBINDER,
                VS.PASSIVE_ID_GOLD_RING,
                VS.PASSIVE_ID_SILVER_RING,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
            ],
        },
        8: {
            name: 'Cappella Magna',
            description: 'Have we gone too far? Could have just camped in the forest with all that chicken, but noooo, we had to go chase some random vampire instead.',
            order: 5,
            passives: [
                VS.PASSIVE_ID_CROWN,
                VS.PASSIVE_ID_TIRAGISU,
                VS.PASSIVE_ID_DUPLICATOR,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
                VS.PASSIVE_ID_SILVER_RING,
                VS.PASSIVE_ID_GOLD_RING,
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
                VS.PASSIVE_ID_CROWN,
                VS.PASSIVE_ID_STONE_MASK,
                VS.PASSIVE_ID_CLOVER,
                VS.PASSIVE_ID_SKULL_O_MANIAC,
                VS.PASSIVE_ID_ARMOR,
                VS.PASSIVE_ID_HOLLOW_HEART,
                VS.PASSIVE_ID_PUMMAROLA,
                VS.PASSIVE_ID_WINGS,
                VS.PASSIVE_ID_SPINACH,
                VS.PASSIVE_ID_CANDELABRADOR,
                VS.PASSIVE_ID_BRACER,
                VS.PASSIVE_ID_SPELLBINDER,
                VS.PASSIVE_ID_DUPLICATOR,
                VS.PASSIVE_ID_EMPTY_TOME,
                VS.PASSIVE_ID_ATTRACTORB,
                VS.PASSIVE_ID_TIRAGISU,
                VS.PASSIVE_ID_METAGLIO_LEFT,
                VS.PASSIVE_ID_METAGLIO_RIGHT,
                VS.PASSIVE_ID_GOLD_RING,
                VS.PASSIVE_ID_SILVER_RING,
            ],
        },
    };

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_STAGE;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the stage with the given ID.
     *
     * @param {StageId} id
     * @return {StageData|undefined}
     */
    this.get = id => DATA[id];

    /**
     * Returns a list of all stage IDs.
     *
     * @return {StageId[]}
     */
    this.getIds = () => DATA.sortedIds;

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    // Finalizes entity objects.
    VST.registerInitCallback(() => VS.finalizeData(TYPE, DATA));
};
