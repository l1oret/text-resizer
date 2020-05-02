(function (global) {
  "use strict";

  let timer = 0;

  /**
   * Define the constructor to instantiate the resizer
   * @constructor
   * @param {Object} options
   */
  function TextResizer() {
    global.addEventListener("resize", resizer, false);
    global.addEventListener("orientationchange", resizer, false);

    resizer();
  }

  /**
   * Decrease heading font size
   * @param {Object} heading
   * @param {Number} containerWidth
   */
  function decreaseFontSize(heading, containerWidth) {
    const fontSize = getFontSize(heading);
    heading.style.fontSize = fontSize - 1 + "px";

    if (heading.clientWidth > containerWidth && fontSize - 1 > 21) {
      decreaseFontSize(heading, containerWidth);
    }
  }

  function getFontSize(heading) {
    var style = window.getComputedStyle(heading, null);
    return Math.round(parseFloat(style.getPropertyValue("font-size")));
  }

  /**
   * Increase heading font size
   * @param {Object} heading
   * @param {Number} containerWidth
   */
  function increaseFontSize(heading, containerWidth) {
    const fontSize = getFontSize(heading);
    heading.style.fontSize = fontSize + 1 + "px";

    if (heading.clientWidth < containerWidth && fontSize + 1 < 300) {
      increaseFontSize(heading, containerWidth);
    }
  }

  /**
   * Increase/Decrease heading font size
   * @param {Boolean} operation
   */
  function resize(operation) {
    return operation ? increaseFontSize : decreaseFontSize;
  }

  /**
   * Resize headings
   */
  function resizer() {
    if (timer) {
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(function () {
      let headings = document.querySelectorAll(".tr-heading");

      for (const heading of headings) {
        let container = heading.closest(".tr-container");

        if (container) {
          let containerWidth = container.clientWidth;
          let headingWidth = heading.clientWidth;

          resize(headingWidth < containerWidth)(heading, containerWidth);
        }
      }
    }, 100);
  }

  /** Expose headings */
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = TextResizer;
  } else if (typeof define === "function" && define.amd) {
    define("TextResizer", [], function () {
      return TextResizer;
    });
  } else if (typeof global === "object") {
    global.TextResizer = TextResizer;
  }
})(typeof global !== "undefined" ? global : window);
