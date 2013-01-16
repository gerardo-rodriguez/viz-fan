/**
 * FeedMagnet JS code
 */
(function() {
    // define a custom ready function that will patiently wait until feedmagnet is available
    window.fm_ready = function(fx) {
        if (typeof $FM !== 'undefined' && typeof $FM.ready === 'function') { $FM.ready(fx); }
        else { window.setTimeout(function() { window.fm_ready.call(null, fx); }, 50); }
    };
 
    // load in feedmagnet
    var domain = 'vizio.feedmagnet.com';
    var fmjs = document.createElement('script');
    fmjs.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + domain + '/embed.js';
    fmjs.setAttribute('async', 'true'); document.documentElement.getElementsByTagName('head')[0].appendChild(fmjs);
})();


/**
 * Handlebars Helpers
 */
(function() {
	'use strict';

	/**
	 * showHandle() - Will return only twitter handle tokens to view.
	 * @param {String} authorToken - The author token (twitter handle, fb id, instagram handle)
	 * @param {String} channel - The channel the feed element came from.
	 */
	// Handlebars.registerHelper('showUserHandle', function(authorObj, channel){
	// 	return new Handlebars.SafeString((channel === 'twitter' || channel === 'instagram') ? '<span>' + authorObj.token + '</span>' : '');
	// });
	/**
	 * ifTwitter() - A custom if statement checking for Twitter channel.
	 * @param {String} channel - The social channel.
	 */
	Handlebars.registerHelper('ifTwitter', function(channel, options) {
		if(channel === 'twitter') {
			return options.fn(this);
		}
	});
	/**
	 * showUserName() - Will return only twitter handle tokens to view.
	 * @param {String} authorToken - The author token (twitter handle, fb id, instagram handle)
	 * @param {String} channel - The channel the feed element came from.
	 * @param {String} permalink - The permalink for the feed item.
	 */
	Handlebars.registerHelper('showUserName', function(authorObj, channel, permalink){
		var html;
		
		if (channel === 'instagram') {
			html = "<a href='" + permalink + "' target='_blank'>" + authorObj.token + "</a>";
		} else {
			html = "<a href='" + authorObj.profile + "' target='_blank'>" + authorObj.token + "</a>";
		}
		
		return new Handlebars.SafeString(html);
	});
	/**
	 * formatText() - Formats the channel message, taking urls & adding anchor tags. Borrowed from FeedMagnet underscore utility functions (http://oakley-console.feedmagnet.com/embed.js).
	 * @param {String} originalText - The original text to format.
	 * @param {String} channel - The social channel.
	 */
	Handlebars.registerHelper('formatText', function(originalText, channel){
	        
	    // Regex for URLs
	    var urlRegex = /\b([a-zA-Z]{3,5}:\/\/)?(([\w\d-]+\.)+[a-zA-Z]{2,4})(?!\w)(\/[\w\d?%\/_=&#.-]*)?(?![\B\/])/g;
	    var usernameRegex = /@([\w]+)/g;
	    var hashtagRegex = /#([\w]+)/g;

	    var finalText = originalText;
	    var textCopy = finalText;
	    var replacedUrlArr = [];

	    var match = urlRegex.exec(textCopy);

	    // Setup any in message urls
	    while (match !== null) {
	        
	        // Grab the url
	        var url = match[0]
	        
	        // Make sure duplicate URLs only get replaced once per entry
	        if (_.indexOf(replacedUrlArr,url) === -1) {
	            finalText = finalText.replace(url, '<a href="' + url + '" target="_blank">' + url + '</a>')
	            replacedUrlArr.push(url)
	        }
	        
	        // Get next URL, if there is one
	        match = urlRegex.exec(textCopy);
	    }

	    // Setup Twitter hashtag links
	    if (channel === 'twitter') {
			// Look for @username to make it an actual link.
			finalText = finalText.replace(usernameRegex, '@<a href="http://twitter.com/$1/" target="_blank">$1</a>')
			// Look for hashtags to make them links as well.
			finalText = finalText.replace(hashtagRegex, '<a href="http://twitter.com/search?q=%23$1" target="_blank">#$1</a>')

			// Borrowed from FeedMagnet underscore utility functions (http://oakley-console.feedmagnet.com/embed.js)
			// change back any instances of #[\d]{1,3}; those aren't hash tags
			// it's substantially easier to convert them and then backconvert them rather
			// than catch them above and not convert them in the first place
			// this catches a slight logical superset, but the extraneous cases should never occur
			finalText = finalText.replace(/<a href="http:\/\/twitter\.com\/search\?q=(%23[\d]{1,3})" target="_blank">(#[\d]{1,3})<\/a>/g, '$2');
		}   

		return finalText;
	});

})();