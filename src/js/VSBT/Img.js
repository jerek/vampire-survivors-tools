/**
 * Displays images using the game's JSON & PNG files.
 */
VSBT.Img = new function () {
    const self = this;
    const DOM = VSBT.DOM;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} TexturePacker3Data A complete Vampire Survivors JSON file, as generated by TexturePacker 3.0.
     * @property {Tp3Sprite[]} textures The sprite texture data.
     * @property {Object}      meta     Some information about the TexturePacker version that was used.
     */

    /**
     * @typedef {Object} Tp3Frame Texture Packer 3 data describing an individual image.
     * @property {string}     filename         The pre-sprite filename.
     * @property {false}      rotated          This appears to always be false, maybe because of poncle's TP3 settings.
     * @property {false}      trimmed          This appears to always be false, maybe because of poncle's TP3 settings.
     * @property {Tp3Size}    sourceSize       The dimensions of the original image.
     * @property {Tp3SizePos} spriteSourceSize The dimensions and position of the image within the original file.
     * @property {Tp3SizePos} frame            The dimensions and position of the image within the sprite.
     */

    /**
     * @typedef {Object} Tp3Sprite Texture Packer 3 data describing a sprite.
     * @property {string}     image  The sprite's filename.
     * @property {string}     format The color format of the file.
     * @property {Tp3Size}    size   The total sprite dimensions.
     * @property {number}     scale  The scale sprite scale. Appears to always be 1, as would be expected for pixel art.
     * @property {Tp3Frame[]} frames Data describing the individual images packed within the sprite.
     */

    /**
     * @typedef {Object} Tp3Size Texture Packer 3 data describing an image's dimensions.
     * @property {number} w The image's width.
     * @property {number} h The image's height.
     */

    /**
     * @typedef {Object} Tp3SizePos Texture Packer 3 data describing an image's dimensions and position in the sprite.
     * @property {number} x The image's horizontal offset from the top-left point.
     * @property {number} y The image's vertical offset from the top-left point.
     * @property {number} w The image's width.
     * @property {number} h The image's height.
     */

    /** @typedef {string} VsImgFilename A Vampire Survivors image name, which is packed within a sprite. */

    /** @typedef {string} VsSprite A Vampire Survivors sprite name. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /** @type {VsSprite} */ this.ARCANA     = 'randomazzo';
    /** @type {VsSprite} */ this.CHARACTERS = 'characters';
    /** @type {VsSprite} */ this.ITEMS      = 'items';
    /** @type {VsSprite} */ this.UI         = 'UI';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {number} The default 1-base scale at which images should be displayed. */
    const DEFAULT_DISPLAY_SCALE = 2;

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {Object.<VsSprite, TexturePacker3Data|null>} A map of sprite filenames to data; null when loading. */
        cache: {},

        /** @type {Object.<VsSprite, function[]>} A map of sprite filenames to callbacks to trigger when loaded. */
        callbacks: {},

        /** @type {Object.<VsSprite, number>} A map of sprite filenames to animation frame request IDs. */
        callbackExecutionRequests: {},
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Creates and returns an element to display a Vampire Survivors image via a sprite.
     *
     * @param {VsSprite}      sprite
     * @param {VsImgFilename} filename
     * @param {Node}          [parent]   When specified, the image element is appended to this.
     * @param {number}        [scale]    The 1-base scale at which images should be displayed. Defaults to 2.
     * @param {function}      [callback] When specified, a callback that is called with the image element.
     * @return {HTMLSpanElement}
     */
    this.createImage = function (sprite, filename, parent, scale, callback) {
        let image = DOM.ce('span', {className: 'vs-sprite-image'});
        displayImage(sprite, filename, image, scale, callback);

        if (parent) {
            parent.appendChild(image);
        }

        return image;
    };

    /**
     * Fills the main wrapper with all images, with a heading for each type.
     *
     * @param {number} [scale] The 1-base scale at which images should be displayed. Defaults to 2.
     */
    this.displayAllImages = function (scale) {
        document.querySelector('h1').innerText = 'Vampire Survivors Images';

        let container = VSBT.Tool.getContainer();
        container.innerHTML = '';

        if (typeof scale !== 'number') {
            scale = 3;
        } else if (scale > 4) {
            alert('Warning: At scales higher than 4 images will start to be too large to fit in the main container.');
        }

        ['Characters', 'Items', 'Arcana', 'UI'].forEach(spriteName => {
            let sprite = self[spriteName.toUpperCase()];

            let imagesContainer = DOM.ce('div', undefined, container);
            DOM.ce('h2', undefined, imagesContainer, DOM.ct(spriteName));

            self.getFilenames(sprite, filenames => {
                filenames.sort((a, b) => a.localeCompare(b));
                filenames.forEach(filename => {
                    let imageContainer = DOM.ce('span', {style: {
                        display: 'inline-block',
                        margin: `${scale}px`,
                        textAlign: 'center',
                    }}, imagesContainer);

                    /** @type {HTMLDivElement} */
                    let title = DOM.ce('div', {style: {
                        boxSizing: 'border-box',
                        fontSize: '10px',
                        overflow: 'hidden',
                        padding: '0 2px',
                        textOverflow: 'ellipsis',
                    }}, imageContainer, DOM.ct(filename));

                    self.createImage(sprite, filename, imageContainer, scale, image => {
                        if (parseInt(image.style.width) < 35) {
                            title.style.width = '35px';
                        } else {
                            title.style.width = image.style.width;
                        }
                        if (title.scrollWidth > title.clientWidth) {
                            imageContainer.title = filename;
                        }
                    });

                    imageContainer.appendChild(title);
                });
            });
        });
    };

    /**
     * Delivers a list of filenames found in the given sprite to the given callback.
     *
     * @param {VsSprite} sprite
     * @param {function} callback
     */
    this.getFilenames = function (sprite, callback) {
        loadData(sprite, data => {
            let filenames = [];

            data.textures.forEach(tp3Sprite => {
                tp3Sprite.frames.forEach(frame => filenames.push(frame.filename));
            });

            callback(filenames);
        });
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Displays the requested image in the given <img> tag.
     *
     * @param {VsSprite}        sprite
     * @param {VsImgFilename}   filename
     * @param {HTMLSpanElement} target
     * @param {number}          [scale]    The 1-base scale at which images should be displayed. Defaults to 2.
     * @param {function}        [callback] When specified, a callback that is called with the image element.
     */
    function displayImage(sprite, filename, target, scale, callback) {
        if (typeof scale !== 'number') {
            scale = DEFAULT_DISPLAY_SCALE;
        }

        loadData(sprite, /** @param {TexturePacker3Data} data */ data => {
            data.textures.some(tp3Sprite => {
                scale *= tp3Sprite.scale;

                tp3Sprite.frames.some(frame => {
                    if (frame.filename === filename) {
                        let sizePos = frame.frame;
                        let bgSizeScale = (tp3Sprite.size.w / sizePos.w) * 100;
                        VSBT.Util.copyProperties(target.style, {
                            backgroundImage: `url(${getSpritePath(sprite, 'png')})`,
                            backgroundPosition: `-${scale * sizePos.x}px -${scale * sizePos.y}px`,
                            backgroundSize: `${bgSizeScale}% auto`,
                            height: `${scale * sizePos.h}px`,
                            width: `${scale * sizePos.w}px`,
                        });

                        if (callback) {
                            callback(target);
                        }

                        return true;
                    }
                });
            });
        });
    }

    /**
     * Executes all callbacks waiting for the given sprite.
     *
     * @param {VsSprite} sprite
     */
    function executeCallbacks(sprite) {
        delete my.callbackExecutionRequests[sprite];
        while (my.callbacks[sprite].length) {
            my.callbacks[sprite].shift()(my.cache[sprite]);
        }
    }

    /**
     * Returns the path to a sprite with the given extension.
     *
     * @param {VsSprite} sprite
     * @param {string}   extension
     * @return {string} A path to the given sprite, relative to the tool's root.
     */
    function getSpritePath(sprite, extension) {
        return '/game-assets/img/' + sprite + '.' + extension;
    }

    /**
     * Loads the image data as needed, and then calls the callback.
     *
     * Even if the data is immediately available, the callback is always called asynchronously, so that bugs are not
     * introduced by an inconsistent result.
     *
     * @param {VsSprite} sprite
     * @param {function} callback
     */
    function loadData(sprite, callback) {
        if (!my.callbacks[sprite]) {
            my.callbacks[sprite] = [];
        }
        my.callbacks[sprite].push(callback);

        if (my.cache[sprite] === undefined) {
            // Load the data, then execute callbacks for this sprite.
            fetch(getSpritePath(sprite, 'json')).then(response => {
                response.json().then(data => {
                    my.cache[sprite] = data;
                    executeCallbacks(sprite);
                });
            });
        } else if (my.cache[sprite]) {
            // Register a request to execute callbacks for this sprite.
            if (!my.callbackExecutionRequests[sprite]) {
                my.callbackExecutionRequests[sprite] = requestAnimationFrame(() => executeCallbacks(sprite));
            }
        }
    }
};
