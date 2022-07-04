/**
 * Manages rendering the page and different page layouts.
 */
VST.Page = new function () {
    const self = this;
    const Img = VST.VS.Img;
    const DOM = VST.DOM;
    const Util = VST.Util;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} HomepageNavigation Data to display a button link to a page in the general navigation area.
     * @property {string}      buttonText    The text to display in its button.
     * @property {ButtonColor} [buttonColor] The color of the button.
     * @property {ButtonStyle} [buttonStyle] The style of the button. E.g. small or lowercase.
     * @property {PageId}      [page]        The page that the button links to.
     * @property {string}      [url]         An external URL to link to.
     */

    /**
     * @typedef {Object} PageBundle Data describing a page to display and any additional URL segments.
     * @property {PageId}   page    The page to display.
     * @property {PageSubPath} subPath Any URL segments after the end of the page URL.
     */

    /**
     * @typedef {Object} PageConfig The basic data needed to display a page.
     * @property {function} display Renders the page for the user.
     * @property {PageId}   id      The page ID.
     * @property {string}   title   The page title, shown in the main heading and <title> tag.
     * @property {string}   url     The URL where the page is seen.
     */

    /** @typedef {*} PageSubPath Any URL segments after the end of the page URL. */

    /** @typedef {string} PageId A string ID of a page with an associated layout. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    // Constants to identify the different page layouts.
    /** @type {PageId} */ this.PAGE_GAME_IMAGES = 'game-images';
    /** @type {PageId} */ this.PAGE_GAME_IMAGES_ANIMATED = 'game-images-animated';
    /** @type {PageId} */ this.PAGE_BUILD_TOOL = 'build';
    /** @type {PageId} */ this.PAGE_ERROR = 'error';
    /** @type {PageId} */ this.PAGE_INDEX = 'index';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {HomepageNavigation[]} The page links displayed on the homepage. */
    const HOMEPAGE_NAVIGATION = [
        {page: this.PAGE_BUILD_TOOL, buttonText: 'Create a Build', buttonColor: DOM.BUTTON_COLOR_GREEN},
        {page: this.PAGE_GAME_IMAGES, buttonText: 'Game Images'},
        {page: this.PAGE_GAME_IMAGES_ANIMATED, buttonText: 'Animated Images'},
        {
            buttonStyle: DOM.BUTTON_STYLE_SMALL,
            buttonText: 'GitHub',
            url: 'https://github.com/jerek/vampire-survivors-tools',
        },
        {
            buttonStyle: DOM.BUTTON_STYLE_SMALL,
            buttonText: 'Credits',
            url: 'https://twitter.com/jerekdain',
        },
    ];

    /** @type {string} Because one does not simply push "" to the history state, we need to use this value instead. */
    const INTERNAL_HOMEPAGE_URL = './';

    /** @type {Object<PageId, PageConfig>} A map of page IDs to their configurations. */
    const PAGES = {
        [this.PAGE_BUILD_TOOL]: {
            id: this.PAGE_BUILD_TOOL,
            title: 'Vampire Survivors Build Tool',
            url: 'build',
            display: () => VST.Build.init(),
        },
        [this.PAGE_ERROR]: {
            id: this.PAGE_ERROR,
            title: 'Error',
            url: 'error',
            display:
                /**
                 * @param {PageId}          page
                 * @param {{error: string}} [subPath]
                 */
                (page, subPath) => {
                    DOM.ce('h2', undefined, my.elements.container, DOM.ct(subPath || 'Unknown Error'));
                },
        },
        [this.PAGE_GAME_IMAGES]: {
            id: this.PAGE_GAME_IMAGES,
            title: 'Vampire Survivors Images',
            url: 'game-images',
            display:
                /**
                 * @param {PageId}       page
                 * @param {VsSpriteName} [subPath]
                 */
                (page, subPath) => {
                    if (subPath) {
                        self.setUrl('game-images/' + Util.slug(subPath), true);
                        Img.displayAllImages(subPath);
                    } else {
                        let buttons = DOM.ce('div', {className: 'vs-button-list'}, my.elements.container);
                        let spriteNames = Img.getSpriteNames().concat([Img.ALL_SPRITES]);
                        spriteNames.forEach(spriteName => {
                            DOM.createButton(spriteName, () => self.set(self.PAGE_GAME_IMAGES, spriteName), buttons);
                        });
                    }
                },
        },
        [this.PAGE_GAME_IMAGES_ANIMATED]: {
            id: this.PAGE_GAME_IMAGES_ANIMATED,
            title: 'Vampire Survivors Images Animated',
            url: 'game-images/animated',
            display:
                /**
                 * @param {PageId}       page
                 * @param {VsSpriteName} [subPath]
                 */
                (page, subPath) => {
                    if (subPath) {
                        self.setUrl('game-images/animated/' + Util.slug(subPath), true);
                        Img.displayAllImagesAnimated(subPath);
                    } else {
                        let buttons = DOM.ce('div', {className: 'vs-button-list'}, my.elements.container);
                        let spriteNames = Img.getSpriteNames().concat([Img.ALL_SPRITES]);
                        spriteNames.forEach(spriteName => {
                            DOM.createButton(spriteName, () => self.set(self.PAGE_GAME_IMAGES_ANIMATED, spriteName), buttons);
                        });
                    }
                },
        },
        [this.PAGE_INDEX]: {
            id: this.PAGE_INDEX,
            title: 'Vampire Survivors Tools',
            url: INTERNAL_HOMEPAGE_URL,
            display: () => {
                let navRow = addNavigationRow();

                HOMEPAGE_NAVIGATION.forEach(navItem => {
                    // Don't print the link to the build tool on production until it's ready.
                    if (navItem.page === this.PAGE_BUILD_TOOL && !VST.IS_DEV) {
                        return;
                    }

                    let button = DOM.createButton(
                        navItem.buttonText,
                        navItem.page && (() => self.set(navItem.page)),
                        navRow,
                        navItem.buttonColor,
                        navItem.buttonStyle,
                    );

                    if (navItem.url) {
                        button.href = navItem.url;
                        button.target = '_blank';
                    }
                });
            },
        },
    };

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {boolean} Whether URL updates from setting the page should happen. Disabled when examining the URL. */
        allowUrlUpdates: true,

        /** @type {PageBundle|undefined} The currently loaded page. */
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

        /** @type {PageBundle[]} The previous pages that the user can go back to. */
        previousPages: [],
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Returns the current page's ID.
     *
     * @return {PageId}
     */
    this.get = () => my.currentPage.page;

    /**
     * Returns the main element containing the tool's interactive elements.
     *
     * @return {HTMLDivElement}
     */
    this.getContainer = () => {
        return my.elements.container;
    };

    /**
     * Sets up the tool's elements.
     */
    this.init = () => {
        my.elements.pageHeading = DOM.ce('h1', undefined, document.body);

        let wrapper = DOM.ce('div', {className: 'vst'}, document.body);
        my.elements.container = DOM.ce('div', {className: 'vst-container'}, wrapper);

        let footer = DOM.ce('footer', undefined, document.body, DOM.ct('Created for the Survivors by '));
        DOM.ce('a', {href: 'https://twitter.com/jerekdain', target: '_blank'}, footer, DOM.ct('Jerek Dain'));

        /**
         * Temporarily disables URL updates when setting the page, and checks whether to set the page based on the URL.
         */
        let updateFromUrl = () => {
            my.allowUrlUpdates = false;

            // If we found a different page than the current one, or need to show an error page, do so.
            let pageBundle = getByPath(location.pathname);
            if (!pageBundle || pageBundle.page !== (my.currentPage || {}).page) {
                self.set(pageBundle.page, pageBundle.subPath);
            }

            my.allowUrlUpdates = true;
        };

        window.addEventListener('popstate', updateFromUrl);
        updateFromUrl();
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
     * @param {PageId}      page            The page to display.
     * @param {PageSubPath} [subPath]       Any URL segments after the end of the page URL.
     * @param {boolean}     [viaBackButton] Whether this page is being loaded because the user used the back button.
     */
    this.set = function (page, subPath, viaBackButton) {
        // Do any garbage collection and clear any previous page content.
        while (my.onLeavePage.length) {
            my.onLeavePage.shift()();
        }
        my.elements.container.innerHTML = '';

        // Validate the requested page.
        let pageConfig = PAGES[page];
        if (!pageConfig) {
            self.set(self.PAGE_ERROR, 'Page Not Found');

            return;
        }

        // Set the page.
        if (my.currentPage) {
            self.setUrl(pageConfig.url);
        }
        if (viaBackButton) {
            // The user is going back, remove the previous page (which is now being loaded).
            my.previousPages.pop();
        } else if (my.currentPage) {
            // The user is loading a new page, remember the current one.
            my.previousPages.push(my.currentPage);
        } else if (page !== self.PAGE_INDEX) {
            // There's no previous page, and the current page isn't the index, so add the index to the previous page, so
            // that they can go "back" to the homepage.
            my.previousPages.push({page: self.PAGE_INDEX});
        }
        my.currentPage = {page: page, subPath: subPath};
        document.body.dataset.page = page;

        // Update the main heading and title.
        document.title = pageConfig.title;
        my.elements.pageHeading.innerText = pageConfig.title;

        // Add a red "Back" button to go back to the previous page.
        if (my.previousPages.length) {
            let navRow = addNavigationRow();
            navRow.dataset.context = 'nav';

            DOM.createButton(
                'Back',
                () => {
                    let lastPage = my.previousPages[my.previousPages.length - 1];
                    self.set(lastPage.page, lastPage.subPath, true);
                },
                navRow,
                DOM.BUTTON_COLOR_RED,
            );
        }

        // Display the page content.
        pageConfig.display(page, subPath);
    };

    /**
     * Updates the URL in a way that doesn't trigger URL change detection to load a page.
     *
     * @param {string}  url
     * @param {boolean} [replace]
     */
    this.setUrl = function (url, replace) {
        // Don't change the URL while we're examining it.
        if (!my.allowUrlUpdates) {
            return;
        }

        // Don't change the URL to itself, or the browser's back button will appear to do nothing.
        if (url === location.pathname) {
            return;
        }

        // The URL must start with a slash in order to set the full URL from the root.
        if (!url.startsWith('/')) {
            url = '/' + url;
        }

        if (replace) {
            history.replaceState({}, '', url);
        } else {
            history.pushState({}, '', url);
        }
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Creates and returns a navigation row in the main container.
     *
     * @return {HTMLDivElement}
     */
    function addNavigationRow() {
        return DOM.ce('div', {className: 'vs-button-list'}, my.elements.container);
    }

    /**
     * Returns the page ID that matches the given path, or undefined if none match.
     *
     * @param {string} path
     * @return {PageBundle|undefined}
     */
    function getByPath(path) {
        path = path.replace(/^\//, '');

        // If we're on the homepage, pretend it's the internal homepage workaround URL.
        if (path === '') {
            path = INTERNAL_HOMEPAGE_URL;
        }

        let page;
        Object.values(PAGES).forEach(pageConfig => {
            // If the path starts with this page's URL, and this is the longest matching URL found so far, use it.
            if (path.startsWith(pageConfig.url) && (
                !page ||
                PAGES[page].url.length < pageConfig.url.length
            )) {
                page = pageConfig.id;
            }
        });

        /** @type {PageBundle|undefined} */
        let pageBundle;
        if (page) {
            pageBundle = {
                page: page,
                subPath: path.substring(page.length),
            };
        }

        return pageBundle;
    }
};
