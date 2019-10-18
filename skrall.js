function skrall(
  scroller,
  options = {
    direction: "vertical",
    snap: true
  }
) {
  this.options = options;

  if (!this.options.direction) {
    this.options.direction = "vertical";
  }
  if (!this.options.snap) {
    this.options.snap = true;
  }



  this.scroller = scroller;
  this.scroller.onmousewheel = (e) => {this.scroll(e);};
  this.scroller.onscroll = (e) => {this.scroll(e);};

  this.didSnap = false;

  this.finalScroll = 0;

  this.timeSinceScroll = 0;

  this.snapInterval = setInterval(() => {
    if (this.options.snap) {
      this.timeSinceScroll += 100;
      if (this.timeSinceScroll > 500) {
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
  };
}

window.skrall = skrall;
