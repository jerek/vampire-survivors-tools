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
};
