/**
 * Helper functions for interfacing with Google Analytics.
 */
VST.Analytics = new function () {
    const DOM = VST.DOM;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    /** @type {boolean} Whether to initialize and use Google Analytics. Disabled in dev. */
    const ENABLED = !/\d|^dev\./.test(location.hostname);

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Track an event.
     *
     * @param {string}                        eventName
     * @param {Object<string, string|number>} [parameters]
     */
    this.trackEvent = function (eventName, parameters) {
        // We log this message regardless of whether tracking is actually enabled, for ease of development.
        VST.debug('Track Event:', eventName, parameters);

        // Don't actually attempt to log anything outside of production.
        if (!ENABLED) {
            return;
        }

        gtag('event', eventName, parameters);
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Sets up Google Analytics.
     */
    function init() {
        if (!ENABLED) {
            return;
        }

        document.head.append(
            DOM.ce('script', {async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-T3M7FG5JYV'}),
        );

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {dataLayer.push(arguments)};
        gtag('js', new Date());
        gtag('config', 'G-T3M7FG5JYV');
    }

    // ************************** //
    // ***** INITIALIZATION ***** //
    // ************************** //

    init();
};
