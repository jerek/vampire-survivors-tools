/**
 * Manages rendering the page and different page layouts.
 */
VSBT.Page = new function () {
    const self = this;
    const DOM = VSBT.DOM;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /** @typedef {string} Page A page with an associated layout. */

    /**
     * @typedef {Object} PageNavigation Data to display a link to a page in the general navigation area.
     * @property {Page}        page
     * @property {string}      linkText
     * @property {ButtonColor} [buttonColor]
     */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    // Constants to identify the different page layouts.
    /** @type {Page} */ this.PAGE_ALL_IMAGES = 'all-images';
    /** @type {Page} */ this.PAGE_ALL_IMAGES_ANIMATED = 'all-images-animated';
    /** @type {Page} */ this.PAGE_INDEX = 'index';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {PageNavigation[]} */
    const NAVIGATION = [
        {page: this.PAGE_ALL_IMAGES, linkText: 'Images'},
        {page: this.PAGE_ALL_IMAGES_ANIMATED, linkText: 'Animated Images'},
    ];

    /** @type {Object<Page, string>} A map of pages to their titles. */
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
        /** @type {Page} The currently loaded page. */
        currentPage: undefined,

        /** @type {Object} References to various DOM elements. */
        elements: {
            /** @type {HTMLDivElement} The main element containing the tool's interactive elements. */
            container: undefined,

            /** @type {HTMLHeadingElement} The main page heading. */
            pageHeading: undefined,
        },
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

        self.setPage(self.PAGE_INDEX);

        let footer = DOM.ce('footer', undefined, document.body, DOM.ct('Created for the Survivors by '));
        DOM.ce('a', {href: 'https://twitter.com/jerekdain', target: '_blank'}, footer, DOM.ct('Jerek Dain'));
    };

    /**
     * Sets and displays a page.
     *
     * @param {Page} page
     */
    this.setPage = function (page) {
        // Clear any previous page content.
        my.elements.container.innerHTML = '';

        // Set the new page.
        my.currentPage = page;
        document.body.dataset.page = page;

        // Add the homepage navigation, or a red "Back" button.
        addNavigationButtons(
            page === self.PAGE_INDEX ?
                NAVIGATION :
                [{page: this.PAGE_INDEX, linkText: 'Back', buttonColor: DOM.BUTTON_RED}],
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
            case this.PAGE_INDEX:
                // Only navigation buttons are needed.
                break;
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
            DOM.createButton(navItem.linkText, () => self.setPage(navItem.page), navRow, navItem.buttonColor);
        });
    }
};
