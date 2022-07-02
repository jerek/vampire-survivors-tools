/**
 * Manages the tool's hash.
 */
VST.Hash = new function () {
    const self = this;
    const Data = VST.Data;
    const Page = VST.Page;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    /** @type {string} The base path where the build tool is found. */
    const BUILD_PATH = '/build';

    /** @type {string} The string used to encode & decode information in the hash to save and load builds. */
    const ENCODE_STRING = '0zxcvbnmasdfghjklqwertyuipZXCVBNMASDFGHJKLQWERTYUIOP123456789';

    /** @type {string} The character separating different parts of the hash. */
    const DELIMITER = '-';

    /** @type {string} The character indicating that the following hash character is an order of magnitude higher. */
    const DELIMITER_ORDER_OF_MAGNITUDE = 'o';

    /** @type {string} All characters can be used in a hash. Used for validation. The delimiter MUST be last. */
    const VALID_CHARACTERS = ENCODE_STRING + DELIMITER_ORDER_OF_MAGNITUDE + DELIMITER;

    /** @type {RegExp} Finds a valid hash in the URL. */
    const VALID_REGEX = new RegExp('^\\/build\\/([' + VALID_CHARACTERS + ']+)$');

    /** @type {number} The numeric value representing a hash delimiter. */
    const VALUE_DELIMITER = -1;

    /** @type {number} The numeric value representing that stages should NOT be included in the hash. */
    const VALUE_STAGES_EXCLUDED = 1;

    /** @type {number} The numeric value representing that stages should be included in the hash. */
    const VALUE_STAGES_INCLUDED = 0;

    const VALUES_TRIMMABLE_TRAILING_CHARACTERS = [0, VALUE_DELIMITER];

    /** @type {number} The current version of the hash that we construct, so that hashes that are not automatically
     *  reverse compatible can be loaded, by reading the hash differently based on the version. */
    const VERSION = 1;

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {boolean} Whether it's currently okay to update the hash with the build. */
        allowWrites: true,

        /** @type {boolean} Whether the "popstate" event listener was set up, so that we only have one at a time. */
        attachedHistoryEventListener: false,
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Sets up the listener for hash changes.
     */
    this.init = () => {
        // Writes are not disabled during the initial read, so that old hashes are updated.
        self.read();

        if (!my.attachedHistoryEventListener) {
            my.attachedHistoryEventListener = true;

            // When the browser's back or forward buttons are used, check the modified hash.
            window.addEventListener('popstate', () => {
                if (Page.get() !== Page.PAGE_BUILD_TOOL) {
                    // Although the user must have been here at some point, they've navigated away from the build tool.
                    return;
                }

                my.allowWrites = false;
                self.read();
                my.allowWrites = true;
            });
        }
    };

    /**
     * Returns the build that's defined in the hash, if it was parsable as a valid build.
     */
    this.read = () => {
        // Get the hash from the URL.
        let matches = location.pathname.match(VALID_REGEX);
        if (!matches) {
            return;
        }
        let hash = matches[1];

        // Load the build from the hash.
        let build = generateBuildFromHash(hash);
        if (build) {
            VST.Build.set(build);
        } else {
            VST.warn('Could not generate build from hash.', hash);
        }
    }

    /**
     * Update the hash in the URL with the current build.
     */
    this.write = () => {
        if (!my.allowWrites) {
            return;
        }

        // Construct the hash for the current build.
        let newUrl = BUILD_PATH;
        let hash = generateHashFromBuild(VST.Build.getBuild());
        if (hash) {
            newUrl += '/' + hash;
        }

        // If it matches the current path, there's nothing to do.
        if (newUrl === location.pathname) {
            return;
        }

        // Update the URL with the new hash. By using history.pushState(), the user will be able to use their browser's
        // back or forward buttons to undo or redo, which is monitored via a popstate event handler.
        history.pushState({}, '', newUrl);
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Returns the build represented by the given hash.
     *
     * @param {string}  hash
     * @return {Build|undefined}
     */
    function generateBuildFromHash(hash) {
        const Build = VST.Build;

        VST.debug('Parsing hash:', hash);

        /**
         * Log a warning to the console about the invalid value that could not be parsed.
         *
         * @param {string} type
         * @param {number} value
         */
        let invalid = (type, value) => VST.warn(
            'Hash contains an invalid ' + type + '. ' + typeof value + ': ' + value,
        );

        let values = deserializeHash(hash);

        //         //
        // Version //
        //         //

        VST.debug('Checking the hash for the Version.');
        let version = values.shift();
        if (!version || version > VERSION) {
            invalid('version', version);

            return;
        }

        //           //
        // Character //
        //           //

        VST.debug('Checking the hash for a character.');
        let characterId = values.shift();
        if (!Data.getCharacter(characterId)) {
            invalid('character', characterId);

            return;
        }

        //         //
        // Weapons //
        //         //

        VST.debug('Checking the hash for weapon IDs.');
        let weaponIds = [];
        for (let i = 0; i < Build.WEAPONS_MAX; i++) {
            let weaponId = values.shift();
            if (weaponId) {
                if (!Data.getWeapon(weaponId)) {
                    invalid('weapon', weaponId);

                    return;
                }

                weaponIds.push(weaponId);
            } else {
                weaponIds.push(0);
            }
        }

        //               //
        // Passive Items //
        //               //

        VST.debug('Checking the hash for passive item IDs.');
        let passiveItemIds = [];
        for (let i = 0; i < Build.PASSIVE_ITEMS_MAX; i++) {
            let passiveId = values.shift();
            if (passiveId) {
                if (!Data.getPassive(passiveId)) {
                    invalid('passive item', passiveId);

                    return;
                }

                passiveItemIds.push(passiveId);
            } else {
                passiveItemIds.push(0);
            }
        }

        //                      //
        // Backup Passive Items //
        //                      //

        VST.debug('Checking the hash for backup passive items IDs.');
        let passiveItemBackupIds = [];
        while (values.length && values[0] !== VALUE_DELIMITER) {
            let passiveId = values.shift();
            if (passiveId) {
                if (!Data.getPassive(passiveId)) {
                    invalid('backup passive item', passiveId);

                    return;
                }

                passiveItemBackupIds.push(passiveId);
            } else {
                passiveItemBackupIds.push(0);
            }
        }

        if (values[0] === VALUE_DELIMITER) {
            // There's a delimiter here, since there are a variable amount of backup passive items. Now we drop it.
            VST.debug('Removing the delimiter from the hash.');
            values.shift();
        }

        //         //
        // Arcanas //
        //         //

        VST.debug('Checking the hash for arcana IDs.');
        let arcanaIds = [];
        for (let i = 0; i < Build.ARCANAS_MAX; i++) {
            let arcanaId = values.shift();
            if (arcanaId) {
                if (!Data.getArcana(arcanaId)) {
                    invalid('arcana', arcanaId);

                    return;
                }

                arcanaIds.push(arcanaId);
            } else {
                arcanaIds.push(0);
            }
        }

        //       //
        // Stage //
        //       //

        VST.debug('Checking the hash for a stage ID.');
        let stageId = values.shift() || undefined;

        //                        //
        // Stage Included in Hash //
        //                        //

        VST.debug('Checking the hash for whether to include stages in the hash.');
        let stageIncludedInHash = values.shift() !== VALUE_STAGES_EXCLUDED;

        return {
            arcanas: arcanaIds,
            character: characterId,
            passiveItems: passiveItemIds,
            passiveItemsBackup: passiveItemBackupIds,
            stage: stageId,
            stageIncludedInHash: stageIncludedInHash,
            weapons: weaponIds,
        };
    }

    /**
     * Returns a hash representing the given build.
     *
     * @param {Build}  build
     * @return {string}
     */
    function generateHashFromBuild(build) {
        const Build = VST.Build;

        // If there's not even a character, there's no build.
        if (!build.character) {
            return '';
        }

        let values = [];

        //         //
        // Version //
        //         //

        values.push(VERSION);

        //           //
        // Character //
        //           //

        values.push(build.character);

        //         //
        // Weapons //
        //         //

        for (let i = 0; i < Build.WEAPONS_MAX; i++) {
            values.push(build.weapons[i] || 0);
        }

        //               //
        // Passive Items //
        //               //

        for (let i = 0; i < Build.PASSIVE_ITEMS_MAX; i++) {
            values.push(build.passiveItems[i] || 0);
        }

        //                      //
        // Backup Passive Items //
        //                      //

        build.passiveItemsBackup.forEach(passiveId => values.push(passiveId || 0));
        // Add a delimiter, since there are a variable amount of backup passive items.
        values.push(VALUE_DELIMITER);

        //         //
        // Arcanas //
        //         //

        for (let i = 0; i < Build.ARCANAS_MAX; i++) {
            values.push(build.arcanas[i] || 0);
        }

        //       //
        // Stage //
        //       //

        values.push(build.stageIncludedInHash && build.stage || 0);

        //                        //
        // Stage Included in Hash //
        //                        //

        values.push(build.stageIncludedInHash ? VALUE_STAGES_INCLUDED : VALUE_STAGES_EXCLUDED);

        // Trim any trailing empty values.
        while (VALUES_TRIMMABLE_TRAILING_CHARACTERS.includes(values[values.length - 1])) {
            values.pop();
        }

        // Encode the numeric values.
        return serializeHash(values);
    }

    /**
     * Returns the string form of the hash from the given numeric values.
     *
     * @param {number[]}  values
     * @return {string}
     * @throws {Error} Throws when passed unsupported values.
     */
    function serializeHash(values) {
        let hash = '';
        let maxValue = ENCODE_STRING.length - 1;

        values.forEach(value => {
            // If this value is representing a hash delimiter, add that.
            if (value === VALUE_DELIMITER) {
                hash += DELIMITER;

                return;
            }

            // If this value is negative, it can't be added to the hash.
            if (value < 0) {
                throw new Error('VST: Cannot generate a hash with negative values.');
            }

            // Add the value to the hash.
            while (value >= maxValue) {
                hash += DELIMITER_ORDER_OF_MAGNITUDE;
                value = value - maxValue;
            }
            hash += ENCODE_STRING.charAt(value);
        });

        return hash;
    }

    /**
     * Returns the numeric values from the given hash string.
     *
     * @param {string}  hash
     * @return {number[]}
     * @throws {Error} Throws when the hash includes invalid characters.
     */
    function deserializeHash(hash) {
        VST.debug('Deserializing hash:', hash);

        let values = [];
        let hashParts = hash.split('');
        let maxValue = ENCODE_STRING.length - 1;

        while (hashParts.length) {
            let hashPart = hashParts.shift();

            // If this character is the hash delimiter, add the value representing a hash delimiter.
            if (hashPart === DELIMITER) {
                values.push(VALUE_DELIMITER);

                continue;
            }

            // If this value is increased by orders of magnitude, take them into account.
            let increaseValue = 0;
            while (hashPart === DELIMITER_ORDER_OF_MAGNITUDE) {
                increaseValue += maxValue;
                hashPart = hashParts.shift();
            }

            let value = ENCODE_STRING.indexOf(hashPart);

            // If .indexOf() fails, we have an invalid hash, so throw an error.
            if (value === -1) {
                throw new Error('VST: Hash character not found in hash encode string.');
            }

            // Add the value to the list of values.
            values.push(value + increaseValue);
        }

        VST.debug('Deserialized hash:', values);

        return values;
    }
};
