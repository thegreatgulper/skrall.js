<h1 align="center">skrall.js</h1>
<p align="center">
  <img src="https://img.shields.io/github/size/KyzaGitHub/skrall.js/skrall.js?label=Full%20Size&style=flat-square">
  <img src="https://img.shields.io/github/size/KyzaGitHub/skrall.js/skrall.min.js?label=Minified&style=flat-square">
  <img src="https://img.badgesize.io/KyzaGitHub/skrall.js/master/skrall.min.js.svg?compression=gzip&label=GZipped&color=007ec6&style=flat-square">
  <img src="https://img.badgesize.io/KyzaGitHub/skrall.js/master/skrall.min.js.svg?compression=brotli&label=Brotli%20Size&color=007ec6&style=flat-square">
</p>
<hr>
<p align="center">
  I milked, yes <i>milked</i>, a butterfly to give you the smoothest scrolljacking experience possible.
</p>
<hr>

## About

skrall.js is a simple, extremely lightweight scrolljacking library made for both vertical and horizontal fullpage/onepage websites.

It handles everything you need without handling too much.

## Features

- [x] **No jQuery.** Yeah, you read that right.
- [x] Easy to set up and use.
- [x] No bloat garbage.
- [x] Automatic full page element snapping (jank not included).

## Usage

### Adding it to your page.

Host skrall.js locally.

```html
<script type="text/javascript" src="./js/skrall.min.js"></script>
```

Or pull it directly from my repo.

```html
<script type="text/javascript" src="https://skrall.kyza.net/skrall.min.js"></script>
```

### Using it on your page.

Create a new skrall.js instance for each scroller.

```javascript
var main = new skrall(<scrollerElement>, {
  direction:      <string: "horizontal" or "vertical">,
  snap:           <boolean>,
  snapDelay:      <milliseconds>,
  jsSnapScroll:   <boolean>,
  scrollFullPage: <boolean>
});
```
