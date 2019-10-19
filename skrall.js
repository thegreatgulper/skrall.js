function skrall(
  scroller,
  options = {
    direction: "vertical",
    snap: true,
    snapDelay: 500,
    jsSnapScroll: true,
    scrollFullPage: false
  }
) {
  this.version = "1.0.0";

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
  if (!this.options.jsSnapScroll) {
    this.options.jsSnapScroll = true;
  }
  if (!this.options.scrollFullPage) {
    this.options.scrollFullPage = false;
  }s.options.environment = "production";
  }

  if (this.options.jsSnapScroll) {
    this.scroller = scroller;
    this.scroller.onmousewheel = (e) => {
      this.scroll(e, false);
    };
    this.scroller.onscroll = (e) => {
      this.scroll(e, true);
    };
  }

  if (this.options.snap && !this.options.jsSnapScroll) {
    if (!document.querySelector("#skrall-css")) {
      var css = document.createElement("style");
      css.id = "skrall-css";
      css.innerHTML = `
.skrall-css-snap {
  scroll-snap-type: both mandatory;
}
.skrall-css-snap > * {
  scroll-snap-align: start;
}
`.trim();
      document.head.appendChild(css);
    }
    this.scroller.className += " skrall-css-snap";
    this.scroller.className = this.scroller.className.trim();
    var observer = new MutationObserver(() => {
      if (this.scroller.className.indexOf("skrall-css-snap") < 0) {
        this.scroller.className += " skrall-css-snap";
        this.scroller.className = this.scroller.className.trim();
      }
    });
    observer.observe(this.scroller, { attributes: true });
  }

  this.didSnap = false;

  this.finalScroll = 0;

  this.timeSinceScroll = 0;

  this.currentSnappedElement = 0;

  this.snapInterval = setInterval(() => {
    if (this.options.snap && this.options.jsSnapScroll) {
      this.timeSinceScroll += 100;
      if (this.timeSinceScroll > this.options.snapDelay) {
        this.timeSinceScroll = 0;
        if (!this.didSnap) {
          this.didSnap = true;
          this.snapScroll();
        }
      }
    }
  }, 100);

  this.scroll = (e, mouseWheel) => {
    this.didSnap = false;

    // Scroll the scroller only if the user didn't scroll on a vanilla scroller.
    for (let i = 0; i < e.path.length; i++) {
      if (e.path[i] == this.scroller) {
        e.preventDefault();

        if (this.options.direction == "horizontal") {
          if (this.options.scrollFullPage && !mouseWheel) {
            this.timeSinceScroll = -1000;
            this.scroller.scrollBy({
              left:
                e.wheelDelta > 0
                  ? this.scrollToNumber(this.currentSnappedElement - 1)
                  : this.scrollToNumber(this.currentSnappedElement + 1)
            });
          } else {
            this.timeSinceScroll = 0;
            this.scroller.scrollBy({
              left: -e.wheelDelta
            });
          }
        }
        return;
      } else {
        // The element is not the scroller.
        // Check if the element can be scrolled on.
        if (e.path[i].scrollHeight > e.path[i].offsetHeight) {
          // If it can be scrolled on,
          // return now and don't let the main scroller
          // scroll or prevent the default event.
          return;
        }
      }
    }
  };

  this.snapScroll = () => {
    var scrollUnit =
      this.scroller.scrollWidth / this.scroller.childElementCount;
    var scrollNumber = Math.round(this.scroller.scrollLeft / scrollUnit);
    this.scroller.scrollBy({
      top: this.getOffset(this.scroller.children[scrollNumber]).top,
      left: this.getOffset(this.scroller.children[scrollNumber]).left,
      behavior: "smooth"
    });

    this.currentSnappedElement = scrollNumber;
  };

  this.scrollNext = () => {
    var scrollUnit =
      this.scroller.scrollWidth / this.scroller.childElementCount;
    var scrollNumber = Math.round(this.scroller.scrollLeft / scrollUnit) + 1;
    this.scroller.scrollBy({
      top: this.getOffset(this.scroller.children[scrollNumber]).top,
      left: this.getOffset(this.scroller.children[scrollNumber]).left,
      behavior: "smooth"
    });

    this.currentSnappedElement = scrollNumber;
  };

  this.scrollPrevious = () => {
    var scrollUnit =
      this.scroller.scrollWidth / this.scroller.childElementCount;
    var scrollNumber = Math.round(this.scroller.scrollLeft / scrollUnit) - 1;
    this.scroller.scrollBy({
      top: this.getOffset(this.scroller.children[scrollNumber]).top,
      left: this.getOffset(this.scroller.children[scrollNumber]).left,
      behavior: "smooth"
    });

    this.currentSnappedElement = scrollNumber;
  };

  this.scrollToNumber = (scrollNumber) => {
    try {
      this.scroller.scrollBy({
        top: this.getOffset(this.scroller.children[scrollNumber]).top,
        left: this.getOffset(this.scroller.children[scrollNumber]).left,
        behavior: "smooth"
      });

      this.currentSnappedElement = scrollNumber;
    } catch (e) {}
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
    try {
      scrollElement.scrollBy({
        top: this.getOffset(element).top,
        left: this.getOffset(element).left,
        behavior: "smooth"
      });
    } catch (e) {}
  };

  this.dispose = () => {
    clearInterval(this.snapInterval);
  };
}

window.skrall = skrall;
