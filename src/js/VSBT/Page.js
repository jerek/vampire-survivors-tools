/**
 * Manages rendering the page and different page layouts.
 */
VSBT.Page = new function () {
    const self = this;
    const DOM = VSBT.DOM;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} PageBundle Data describing a page to display and any associated contextual data.
     * @property {PageId}   page The page to display.
     * @property {PageData} data Page-specific contextual data.
     */

    /** @typedef {*} PageData Page-specific contextual data. */

    /** @typedef {string} PageId A string ID of a page with an associated layout. */

    /**
     * @typedef {Object} PageNavigation Data to display a link to a page in the general navigation area.
     * @property {string}      linkText
     * @property {PageId}      page
     * @property {ButtonColor} [buttonColor]
     * @property {PageData}    [data]
     */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    // Constants to identify the different page layouts.
    /** @type {PageId} */ this.PAGE_ALL_IMAGES = 'all-images';
    /** @type {PageId} */ this.PAGE_ALL_IMAGES_ANIMATED = 'all-images-animated';
    /** @type {PageId} */ this.PAGE_ERROR = 'error';
    /** @type {PageId} */ this.PAGE_INDEX = 'index';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {PageNavigation[]} */
    const NAVIGATION = [
        {page: this.PAGE_ALL_IMAGES, linkText: 'Game Images'},
        {page: this.PAGE_ALL_IMAGES_ANIMATED, linkText: 'Animated Images'},
    ];

    /** @type {Object<PageId, string>} A map of page IDs to their titles. */
    const PAGE_TITLES = {
        [this.PAGE_ALL_IMAGES]: 'Vampire Survivors Images',
        [this.PAGE_ALL_IMAGES_ANIMATED]: 'Vampire Survivors Images Animated',
        [this.PAGE_INDEX]: 'Vampire Survivors Build Tool',
    };

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {PageBundle} The currently loaded page. */
        currentPage: undefined,

        /** @type {Object} References to various DOM elements. */
        elements: {
            /** @type {HTMLDivElement} The main element containing the tool's interactive elements. */
            container: undefined,

            /** @type {HTMLHeadingElement} The main page heading. */
            pageHeading: undefined,
        },

        /** @type {function[]} A list of functions to call before changing to another page. */
        onLeavePage: [],
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Returns the main element containing the tool's interactive elements.
     *
     * @return {HTMLDivElement}
     */
    this.getContainer = function () {
        return my.elements.container;
    };

    /**
     * Sets up the tool's elements.
     */
    this.init = function () {
        my.elements.pageHeading = DOM.ce('h1', undefined, document.body);

        let wrapper = DOM.ce('div', {className: 'vsbt'}, document.body);
        my.elements.container = DOM.ce('div', {className: 'vsbt-container'}, wrapper);

        self.set(self.PAGE_INDEX);

        let footer = DOM.ce('footer', undefined, document.body, DOM.ct('Created for the Survivors by '));
        DOM.ce('a', {href: 'https://twitter.com/jerekdain', target: '_blank'}, footer, DOM.ct('Jerek Dain'));
    };

    /**
     * Registers the given callback to be called when the user visits a different page. This is so that pages can do any
     * needed manual garbage collection to prevent memory leaks, such as clearing animation intervals.
     *
     * @param {function} callback
     */
    this.onLeavePage = function (callback) {
        my.onLeavePage.push(callback);
    };

    /**
     * Sets and displays a page.
     *
     * @param {PageId}   page   The page to display.
     * @param {PageData} [data] Page-specific contextual data.
     */
    this.set = function (page, data) {
        // Do any garbage collection and clear any previous page content.
        while (my.onLeavePage.length) {
            my.onLeavePage.shift()();
        }
        my.elements.container.innerHTML = '';

        // Set the new page.
        let lastPage = my.currentPage;
        my.currentPage = {page: page, data: data};
        document.body.dataset.page = page;

        // Add the homepage navigation, or a red "Back" button.
        addNavigationButtons(
            page === self.PAGE_INDEX ?
                NAVIGATION :
                [{page: lastPage.page, data: lastPage.data, linkText: 'Back', buttonColor: DOM.BUTTON_RED}],
        );

        // Update the main heading, if this page has one specified.
        my.elements.pageHeading.innerText = PAGE_TITLES[page] || PAGE_TITLES[self.PAGE_INDEX];

        // Display the page content.
        switch (page) {
            case this.PAGE_ALL_IMAGES:
                VSBT.Img.displayAllImages();
                break;
            case this.PAGE_ALL_IMAGES_ANIMATED:
                VSBT.Img.displayAllImagesAnimated();
                break;
            case this.PAGE_ERROR:
                my.elements.pageHeading.innerText = 'Error';
                DOM.ce('h2', undefined, my.elements.container, DOM.ct(data && data.error || 'Unknown Error'));
                break;
            case this.PAGE_INDEX:
                // Only navigation buttons are needed.
                break;
            default:
                self.set(self.PAGE_ERROR, {error: 'Invalid Page'});
        }
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Add navigation buttons to the main container.
     *
     * @param {PageNavigation[]} navItems
     */
    function addNavigationButtons(navItems) {
        let navRow = DOM.ce('div', {className: 'vsbt-nav'}, my.elements.container);

        navItems.forEach(navItem => {
            DOM.createButton(
                navItem.linkText,
                () => self.set(navItem.page, navItem.data),
                navRow,
                navItem.buttonColor,
            );
        });
    }
};
