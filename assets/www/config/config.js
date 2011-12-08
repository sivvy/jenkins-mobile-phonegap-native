/**
 * Config function
 */
var jenkins = {};
(function() {
	//Default config
	var Configuration = {
		"Offical Jenkins All" : {
			"title": "jenkins-all",
			"url" : "http://ci.jenkins-ci.org/rssAll",
			"visible":true
		},
		"Offical Jenkins Unstable" : {
			"title": "jenkins-unstable",
			"url" : "http://ci.jenkins-ci.org/view/All%20Unstable/rssAll",
			"visible":true
		},
		"Offical Jenkins Site" : {
			"title": "jenkins-site",
			"url" : "http://ci.jenkins-ci.org/view/All%20Site/rssAll",
			"visible":true
		},
		"Offical Jenkins Core" : {
			"title": "jenkins-core",
			"url" : "http://ci.jenkins-ci.org/view/Jenkins%20core/rssAll",
			"visible":true
		},
		"Offical Jenkins Library" : {
			"title": "jenkins-library",
			"url" : "http://ci.jenkins-ci.org/view/Libraries/rssAll",
			"visible":true
		}
    };
        
        Config = function(){
        	this.config = {};
        	this.configArray = [];
        	$.extend( this.config, Configuration );
        	this.configArray = this.generateArray();
        	console.log('this config:', this.config);
        };
        Config.prototype.generateArray = function() {
        	var local = $.parseJSON( window.localStorage.getItem( "config" ) ),
        	   config = this.config;
        	config = $.extend( config, local );
            var i, array = [];
            for( i in config ) {
                config[i].id = i;
                array.push( config[i] );
            }
            return array;
        };
        Config.prototype.set = function( key, value ) {
        	var config = this.config;
        	
        	if ( !config[key] ) {
               key = value.title;
            } 
            config[key] = value;
            return key;
        };
        Config.prototype.setActive = function( key, active ) {
            this.config[key].visible = active;
        };
        Config.prototype.remove = function ( key ) {
        	delete this.config[key];
        };
        Config.prototype.save = function() {
            window.localStorage.setItem( "config", $.toJSON( this.config ) );
            this.configArray = this.generateArray();
        }
        
    c = new Config();
	jenkins.Config = c;
})();