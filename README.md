# Fandemonium - Parliament #

## Javascript ##

This app makes use of:

- [Backbone.js](http://backbonejs.org) - Helps give our JS a "backbone"/structure.
- [Underscore.js](http://underscorejs.org) - Backbone is dependent on this library.
- [Handlerbars.js](http://handlebarsjs.com/) - Minimal JS templating on steroids.
- [jquery.colorbox.js](http://www.jacklmoore.com/colorbox) - A lightweight customizable lightbox plugin for jQuery.
- [modernizr.custom.js](http://modernizr.com/download/#-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-teststyles-prefixes-load) - Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.
- [json2.js](https://github.com/douglascrockford/JSON-js)


There is a section of "Properties" that can be adjusted in `app.js`.

	//-------------------------------------------------
	// Properties
	//-------------------------------------------------
	App.Properties.fmItemLimit = 50; // FeedMagnet limit for each of the feeds. Adjust accordingly.
	App.Properties.stanfordFeedName = 'vizio-stanford-test'; // The FeedMagnet feed name for the Stanford feed.
	App.Properties.wisconsinFeedName = 'vizio-wisconsin-test'; // The FeedMagnet feed name for the Wisconsin feed.
	App.Properties.feedRefreshInterval = 20000; // The feed refresh interval in milliseconds
	App.Properties.randomChoiceArr = [3,4,5,7]; // Used as possible selections for random number to use when using modulus against current index.
	App.Properties.enableAutoRefresh = true; // A toggle to enable/disable auto-refresh of content.

Feel free to adjust these as needed.

## FeedMagnet ##

[FeedMagnet Documentation](http://vizio-console.feedmagnet.com/embed/documentation/)

## Random Stuff ##

The loader graphics were found and downloaded form [this site](http://www.ajaxload.info/).