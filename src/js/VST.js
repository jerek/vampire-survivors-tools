/**
 * This is the base class-like, which serves these porpoises 🐬:
 * - The base class to which all the others attach, for namespacing and a clean global state.
 * - Handles low level tool initialization registration for some classes.
 * - Contains logging functions, so that logging uses consistent formats, and logging commands intended for production
 *   are distinguishable from temporary console calls.
 */
window.VST = new function () {
    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    /** @type {string} Text shown before all console messages on production. */
    const CONSOLE_MESSAGE_PREFIX = '[VST]';

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

    // ======= //
    // LOGGING //  Using these functions indicates that the calling code is MEANT to log to the console on production.
    // ======= //

    /**
     * Log a console debug message.
     *
     * @param {*} message
     */
    this.debug = function (message) {
        log('debug', arguments);
    };

    /**
     * Log a console error message.
     *
     * @param {*} message
     */
    this.error = function (message) {
        log('error', arguments);
    };

    /**
     * Log a console info message.
     *
     * @param {*} message
     */
    this.info = function (message) {
        log('info', arguments);
    };

    /**
     * Log a console log message.
     *
     * @param {*} message
     */
    this.log = function (message) {
        log('log', arguments);
    };

    /**
     * Log a console warn message.
     *
     * @param {*} message
     */
    this.warn = function (message) {
        log('warn', arguments);
    };

    // ======= //
    // GENERAL //
    // ======= //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Registers a callback to be executed when all JS files have been loaded on the page, just before the core init.
     *
     * @param {function} callback
     */
    this.registerInitCallback = callback => my.initCallbacks.push(callback);

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Sets up the core library code.
     */
    function init() {
        // Call any registered callbacks, now that everything on the page is available.
        my.initCallbacks.forEach(callback => callback());

        // Set up the page.
        VST.Page.init();
    }

    /**
     * Logs a message to the console with the given function and arguments.
     *
     * @param {string}     func
     * @param {IArguments} args
     */
    function log(func, args) {
        console[func].apply(
            console[func],
            [CONSOLE_MESSAGE_PREFIX].concat(Array.prototype.slice.call(args)),
        );
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    window.addEventListener('DOMContentLoaded', init);
};
