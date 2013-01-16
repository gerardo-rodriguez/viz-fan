/**
 * Fandemonium Backbone App
 *
 * @author Gerardo Rodriguez - gerardo@gerardo-rodriguez.com
 * @created 12/10/2012
 */
fm_ready(function($, _) {
	'use strict';

	//-------------------------------------------------
	// App Namespacing
	//-------------------------------------------------
  var App = window.Vizio = {};
	App.Models = {};
	App.Collections = {};
	App.Controllers = {};
	App.Properties = {};


	//-------------------------------------------------
	// Properties
	//-------------------------------------------------
	App.Properties.fmItemLimit = 50; // FeedMagnet limit for each of the feeds. Adjust accordingly.
	App.Properties.stanfordFeedName = 'vizio-stanford-test'; // The FeedMagnet feed name for the Stanford feed.
	App.Properties.wisconsinFeedName = 'vizio-wisconsin-test'; // The FeedMagnet feed name for the Wisconsin feed.
	App.Properties.feedRefreshInterval = 20000; // The feed refresh interval in milliseconds
	App.Properties.randomChoiceArr = [3,4,5,7]; // Used as possible selections for random number to use when using modulus against current index.
	App.Properties.enableAutoRefresh = true; // A toggle to enable/disable auto-refresh of content.


	//-------------------------------------------------
	// Model/Collection Classes
	//-------------------------------------------------
	/**
	* @class App.Models.FeedItemModel - Our FeedMagnet Item Model class.
	*/
	App.Models.FeedItemModel = Backbone.Model.extend();


	/**
	* @class App.Collections.FeedItemCollection - Our FeedMagnet Item Collection class.
	*/
	App.Collections.FeedItemCollection = Backbone.Collection.extend({

		// reference to the collection's model
		model: App.Models.FeedItemModel,

		/**
		* @method initialize() - Our intializer/constructor.
		*/
		initialize: function(fmFeedName) {
			// code to run on initialization

			this.feedName = fmFeedName;
		},

		/**
		* @method sync() - Override the default sync method to use FeedMagnet. Gets fired off by default when we "fetch()".
		*/
		sync: function(method, model, options) {
			var self = this;

			switch(method) {
				case 'read':

				  // make a feed and retrieve its contents
					$FM.Feed(this.feedName).get({

					    limit: App.Properties.fmItemLimit,

					    success: function(FMObj, data) {
							
								var responseArr = [];

				        $.each(data.response.updates, function(i, update){
				        	responseArr.push(update.data);
				        });

				        if (responseArr.length) {
				        	options.success(responseArr);
				        } else {
				        	options.error("Something went wrong trying to connect to FeedMagnet.");
				        }

					    }
					});


				break;
			}
		}
	});


	//-------------------------------------------------
	// View Controller Classes
	//-------------------------------------------------
	/**
	* @class App.Controllers.FeedItemViewController - Our view controller for a single feed item view.
	*/
	App.Controllers.FeedItemViewController = Backbone.View.extend({

		tagName: 'li',
		className: 'feed-item-container',

		// cache our template
		template: Handlebars.compile($('#feed-item-template').html()),

		// DOM events specific to a feed item
		events: {
			'click .feed-item-inner-container' : 'openModal'
		},

		/**
		* @method initialize() - Bind to it's model for changes.
		*/
		initialize: function() {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		/**
		 * @method render() - Override the default render method to use the template.
		 */
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		/**
		 * @method openModal() - Creates and opens a new modal view.
		 */
		openModal: function() {

			// Create an instance of our ModalViewController passing it the current model.
			var modalViewController = new App.Controllers.ModalViewController({model:this.model});
			// Render the modal view into the placeholder div on the page.
			var $modal = $('#details-modal').html(modalViewController.render().el);
			// Launch colorbox with our new modal content
			$.colorbox({
				inline: true, 
				href: $modal,
				maxWidth: '100%'
			});

		}

	});


	/**
	* @class App.Controllers.FeedItemViewController - Our view controller for a single feed item view.
	*/
	App.Controllers.ModalViewController = Backbone.View.extend({

		className: 'modal-view-container',

		// cache our template
		template: Handlebars.compile($('#modal-template').html()),

		/**
		* @method initialize() - Bind to it's model for changes.
		*/
		initialize: function() {
			this.model.on('change', this.render, this);
		},

		/**
		 * @method render() - Override the default render method to use the template.
		 */
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}

	});


	/**
	 * @class App.Controllers.FeedViewController - The view controller for the Feed View.
	 */
	App.Controllers.FeedViewController = Backbone.View.extend({

		events: {
			//
		},

		/**
		 * @method initialize() - Initialize any settings/bindings
	 	 * @param {String} options.elementID - The DOM element ID that this view controller controls.
	 	 * @param {App.Collections.FeedItemCollection} options.feedCollection - The feed item collection for this feed view.
	 	 * @param {String} options.name - A name we'll use for the Feed View.
		 */
		initialize: function(options) {

			this.prevIdArr = [];
			this.alternateBool = false; // allows us to alternate rendering from column to column, this will be updated on each render.

			// set our DOM element for this view controller
			this.setElement( $(options.elementID) );

			this.name = options.name;

			// store our feedCollection
			this.feedCollection = options.feedCollection;

			// bind to the model changes of this view
			this.feedCollection.on('add', this.addOne, this);
			this.feedCollection.on('reset', this.addAll, this);
			this.feedCollection.on('all', this.render, this);

			if (App.Properties.enableAutoRefresh) {
				var self = this;
				// Setup an interval to refresh the feed automatically.
				this.refreshInterval = setInterval(function(){
					self.refreshFeed.call(self);
				}, App.Properties.feedRefreshInterval);
			};


			// grab me some data!!
			this.feedCollection.fetch();
		},

		render: function() {

		},

		/**
		 * @method refreshFeed() - Refreshes the feed via the feed collection.
		 */
		refreshFeed: function() {
			this.feedCollection.fetch();
		},

		/**
		 * @method addOne() - Add a single feed item to the view.
	 	 * @param {String} dataModel - The data model we'll pass to the single feed item view.
		 */
		addOne: function(dataModel) {

			var view = new App.Controllers.FeedItemViewController({model: dataModel});

			var $col1 = this.$('.socialcol:nth-of-type(1)');
			var $col2 = this.$('.socialcol:nth-of-type(2)');

			// Let's alternate the column we place the feed item into based on which one has less height (less content).
			// if ($col1.height() <= $col2.height()) {

			if (this.alternateBool) {
	
				$col1.append(view.render().el);

			} else {

				$col2.append(view.render().el);

			}

			this.alternateBool = !this.alternateBool;

		},

		/**
		 * @method addAll() - Add all feed items to view
		 */
		addAll: function() {

			// empty out the feed columns
			this.$('.socialcol').empty();

			// remove the loader graphic
			this.$('.main-loader-graphic').slideUp();

			// var currIdArr = [];

			// this.feedCollection.each(function(currModel, index){
			// 	currIdArr.push(currModel.get('id'));
			// });

			// console.log('VIEW: ' + this.cid, this.prevIdArr);
			// console.log('VIEW: ' + this.cid, currIdArr);

			// var different = _.difference(this.prevIdArr, currIdArr);

			// console.log( 'different: ', different.length);

			// var self = this;
			// _.each(different, function(el,i){

			// 	var num = parseInt(el);
			// 	console.log('num', num);
			// 	console.log( self.feedCollection.get(num));
			// });

			// console.log( this.feedCollection.get(59257));


			this.feedCollection.each(this.addOne, this);

			// this.prevIdArr = currIdArr;

			this.randomlyMakeImagesSmaller();
		},

		randomlyMakeImagesSmaller: function() {

			var everyNthArr = App.Properties.randomChoiceArr;

			var self = this;
			var alternate = false;
			this.$('.socialcol li').each(function(i,el){

				var currNthNum = everyNthArr[Math.floor(Math.random()*everyNthArr.length)];
				var switchClass = (alternate) ? '': ' switch';

				if (i%currNthNum===0 && i > 0 && $(el).find('img').length) {
					$(el).addClass('special-case ' + self.name + switchClass);
					alternate = !alternate;
				}
			});

		}

	});


	//-------------------------------------------------
	// Initializers
	//-------------------------------------------------

	// Create an instance of the feed collections
	var stanfordFeedCollection = new App.Collections.FeedItemCollection(App.Properties.stanfordFeedName);
	var wisconsinFeedCollection = new App.Collections.FeedItemCollection(App.Properties.wisconsinFeedName);

	// Kick the app off!!
	var stanfordFeedViewController = new App.Controllers.FeedViewController({
		elementID: '#stanford-social', 
		feedCollection: stanfordFeedCollection,
		name: 'stanford'
	});

	var wisconsinFeedViewController = new App.Controllers.FeedViewController({
		elementID: '#wisconsin-social', 
		feedCollection: wisconsinFeedCollection,
		name: 'wisconsin'
	});

});