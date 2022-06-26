/**
 * This is the base class-like, to which all the others attach, for namespacing and a clean global state. It also
 * handles low level tool initialization functionality.
 */
window.VSBT = new function () {
    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {function[]} A list of callbacks to execute immediately before initializing the tool. */
        initCallbacks: [],
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Sets up the core library code.
     */
    this.init = () => {
        // Call any registered callbacks, now that everything on the page is available.
        my.initCallbacks.forEach(callback => callback());
    };

    /**
     * Registers a callback to be executed when all JS files have been loaded on the page, just before the core init.
     *
     * @param {function} callback
     */
    this.registerInitCallback = callback => my.initCallbacks.push(callback);
};
