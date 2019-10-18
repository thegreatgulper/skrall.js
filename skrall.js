function skrall(
  scroller,
  options = {
    direction: "vertical",
    snap: true,
    snapDelay: 500,
    environment: "production"
  }
) {
  this.version = "1.0.0";

  this.log = (text) => {
    if (this.options.environment == "development") {
      console.log("[skrall.js v" + this.version + "]: " + text);
    }
  };

  this.options = options;

  if (!this.options.direction) {
    this.options.direction = "vertical";
  }
  if (this.options.snap == null) {
    this.options.snap = true;
  }
  if (!this.options.snapDelay) {
    this.options.snapDelay = 500;
  }
  if (!this.options.environment) {
    this.options.environment = "production";
  }

  this.scroller = scroller;
  this.scroller.onmousewheel = (e) => {
    this.scroll(e);
  };
  this.scroller.onscroll = (e) => {
    this.scroll(e);
  };

  this.log(
    "Created scroller with options:\n" + JSON.stringify(this.options, null, 2)
  );

  this.didSnap = false;

  this.finalScroll = 0;

  this.timeSinceScroll = 0;

  this.snapInterval = setInterval(() => {
    if (this.options.snap) {
      this.timeSinceScroll += 100;
      if (this.timeSinceScroll > this.options.snapDelay) {
        this.timeSinceScroll = 0;
        this.snapScroll();
      }
    }
  }, 100);

  this.scroll = (e) => {
    this.didSnap = false;

    // Scroll the deepest scrollable element only.
    for (let i = 0; i < e.path.length; i++) {
      if (e.path[i] == this.scroller) {
        this.timeSinceScroll = 0;
        if (this.options.direction == "horizontal") {
          this.scroller.scrollBy({
            left: -e.wheelDelta
          });
        }
        return;
      }
    }
  };

  this.snapScroll = () => {
    if (!this.didSnap && this.options.snap) {
      this.didSnap = true;
      var scrollUnit =
        this.scroller.scrollWidth / this.scroller.childElementCount;
      var scrollNumber = Math.round(this.scroller.scrollLeft / scrollUnit);
      this.scroller.scrollBy({
        top: this.getOffset(this.scroller.children[scrollNumber]).top,
        left: this.getOffset(this.scroller.children[scrollNumber]).left,
        behavior: "smooth"
      });
    }
  };

  this.getOffset = (element) => {
    var bodyRect = this.scroller.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    return {
      top: elementRect.top - bodyRect.top,
      bottom: elementRect.bottom - bodyRect.bottom,
      left: elementRect.left - bodyRect.left,
      right: elementRect.right - bodyRect.right
    };
  };

  this.jump = (elementID) => {
    this.scrollToElement(this.scroller, document.getElementById(elementID));
  };

  this.scrollToElement = (scrollElement, element) => {
    scrollElement.scrollBy({
      top: this.getOffset(element).top,
      left: this.getOffset(element).left,
      behavior: "smooth"
    });
  };

  this.dispose = () => {
    clearInterval(this.snapInterval);
    this.log("Disposed scroller successfully.");
  };
}

window.skrall = skrall;
