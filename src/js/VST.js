/**
 * This is the base class-like, which serves these porpoises 🐬:
 * - The base class to which all the others attach, for namespacing and a clean global state.
 * - Handles low level tool initialization registration for some classes.
 * - Contains logging functions, so that logging uses consistent formats, and logging commands intended for production
 *   are distinguishable from temporary console calls.
 */
window.VST = new function () {
    const self = this;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {boolean} Whether this is being run in a development environment. */
    this.IS_DEV = /\d|^dev\./.test(location.hostname);

    // ------- //
    // PRIVATE //
    // ------- //

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

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Log a console debug message.
     *
     * @param {*} message
     */
    this.debug = function (message) {
        log('debug', arguments);
    };

    /**
     * Log a console error message, and track it in Google Analytics.
     *
     * @param {*} message
     */
    this.error = function (message) {
        log('error', arguments);

        if (VST.Analytics) {
            if (!message) {
                console.error('The error message was empty, and thus will not be logged.');

                return;
            }

            // Log errors in Google Analytics, so they can be reviewed.
            let args = Array.prototype.slice.call(arguments);
            let params = {
                message: args.shift(),
            };
            for (let i = 0, len = args.length; i < len; i++) {
                // TODO: To test what GA4 accepts, these params are using spaces, special chars, and mixed casing.
                params['Error Param #' + (i + 1)] = args[i];
            }
            VST.Analytics.trackEvent('Error', params);
        }
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

    // ------- //
    // PRIVATE //
    // ------- //

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
        // Load DLC data.
        self.VS.loadDlcData(() => {
            // Call any registered callbacks, now that everything on the page is available.
            my.initCallbacks.forEach(callback => callback());

            // Set up the page.
            VST.Page.init();
        });
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    window.addEventListener('DOMContentLoaded', init);
};
