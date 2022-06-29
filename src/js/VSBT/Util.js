/**
 * General JavaScript utility functions.
 */
VSBT.Util = new function () {
    const self = this;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Copy individual properties onto the target object.
     *
     * @param {object} targetObject
     * @param {object} properties
     * @param {object} [properties2]
     * @param {object} [properties3]
     * @param {object} [properties4]
     * @param {object} [properties5] Actually supports infinite params. Add more params as needed for static analysis.
     * @return {object} The modified object, which was modified in place.
     */
    this.copyProperties = function (targetObject, properties, properties2, properties3, properties4, properties5) {
        Array.prototype.slice.call(arguments, 1).forEach(properties => {
            Object.entries(properties).forEach(([property, value]) => {
                if (typeof value === 'object' && value) {
                    if (!targetObject[property]) {
                        targetObject[property] = {};
                    }
                    self.copyProperties(targetObject[property], value);
                } else {
                    targetObject[property] = value;
                }
            });
        });

        return targetObject;
    };

    /**
     * Returns the given string converted to a URL slug.
     *
     * @param {string} string
     * @return {string}
     */
    this.slug = function (string) {
        // Make it lowercase in a locale-supported way.
        string = string.toLocaleLowerCase();

        // Replace any unsupported characters with hyphens.
        string = string.replace(/ \/ |_|[^\u00C0-\u1FFF\u2C00-\uD7FF\w]+/g, '-');

        // Trim any duplicate hyphens.
        string = string.replace(/-{2,}/g, '-');

        // Trim any beginning or ending hyphens.
        string = string.replace(/^-+|-+$/g, '');

        return string;
    };
};
