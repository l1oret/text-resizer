(function (global) {
  'use strict';

  /**
   * Resizer
   */
  const Resizer = {
    /**
     * Initializes the Resizer tool
     * @constructs Resizer
     * @param {object} heading
     * @param {number} containerWidth
     * @param {number} min
     * @param {number} max
     * @returns {Resizer}
     */
    init: function (heading, containerWidth, min, max) {
      this.containerWidth = containerWidth;
      this.heading = heading;
      this.max = max;
      this.min = min;
      this.fontSize = this.getHeadingFontSize();

      return this;
    },

    /**
     * Get heading font-size
     * @returns {number}
     */
    getHeadingFontSize() {
      var style = global.getComputedStyle(this.heading, null);
      return Math.round(parseFloat(style.getPropertyValue('font-size')));
    },

    /**
     * Set heading font-size
     */
    setHeadingFontSize() {
      this.heading.style.fontSize = `${this.fontSize}px`;
    },

    /**
     * Resize heading until fit into its container
     * @returns {void}
     */
    resize: function () {
      this.updateFont();

      if (this.isResizable()) {
        this.resize();
      }
    },
  };

  /**
   * Increases heading's font-size
   * @extends Resizer
   */
  const Increase = Object.create(Resizer);

  /**
   * Set heading font-size style
   * @returns {void}
   */
  Increase.updateFont = function () {
    this.fontSize++;
    this.setHeadingFontSize();
  };

  /**
   * Checks whether or not the heading font-size is increasable based on its
   * container and the max font-size
   * @returns {void}
   */
  Increase.isResizable = function () {
    return (
      this.heading.clientWidth < this.containerWidth &&
      this.fontSize + 1 < this.max
    );
  };

  /**
   * Decreaes heading's font-size
   * @extends Resizer
   */
  const Decrease = Object.create(Resizer);

  /**
   * Set heading font-size style
   * @returns {void}
   */
  Decrease.updateFont = function () {
    this.fontSize--;
    this.setHeadingFontSize();
  };

  /**
   * Checks whether or not the heading font-size is decreasable based on its
   * container and the min font-size
   * @returns {void}
   */
  Decrease.isResizable = function () {
    return (
      this.heading.clientWidth > this.containerWidth &&
      this.fontSize - 1 > this.min
    );
  };

  /**
   * Resizer actions
   */
  const actions = [Decrease, Increase];

  /**
   * Default optinos
   */
  const defaults = {
    containerClass: '.tr-container',
    headingClass: '.tr-heading',
    max: 300,
    min: 20,
  };

  /**
   * Timeout timer
   */
  let timer = 0;

  /**
   * Iterates over each heading and resize it
   *
   * @param {object} options Custom options
   * @returns {void}
   */
  function resizeText(options) {
    if (timer) {
      global.clearTimeout(timer);
    }

    // Resize only when resize event "has finished"
    timer = global.setTimeout(function () {
      let headings = document.querySelectorAll(options.headingClass);

      for (let i = 0, { length } = headings; i < length; i++) {
        const heading = headings[i];
        let container = heading.closest(options.containerClass);

        if (container) {
          actions[+(heading.clientWidth < container.clientWidth)]
            .init(heading, container.clientWidth, options.min, options.max)
            .resize();
        }
      }
    }, 100);
  }

  /**
   * @constructor
   *
   * Define the constructor to instantiate the TextResizer
   *
   * @param {object} options Custom options
   * @param {string} options.containerClass Container class selector
   * @param {string} options.headingClass Heading class selector
   * @param {string} options.max Maximun font-size
   * @param {string} options.min Minimun font-size
   * @returns {void}
   */
  function TextResizer({
    containerClass = defaults.containerClass,
    headingClass = defaults.headingClass,
    max = defaults.max,
    min = defaults.min,
  } = {}) {
    global.addEventListener('resize', resizeText, false);
    global.addEventListener('orientationchange', resizeText, false);
    resizeText({ containerClass, headingClass, min, max });
  }

  // Expose TextResizer
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TextResizer;
  } else if (typeof define === 'function' && define.amd) {
    define('TextResizer', [], function () {
      return TextResizer;
    });
  } else if (typeof global === 'object') {
    global.TextResizer = TextResizer;
  }
})(typeof global !== 'undefined' ? global : window);
