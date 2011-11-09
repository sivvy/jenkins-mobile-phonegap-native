/**
 * Config function
 */
var jenkins = {};
(function() {
	//Default config
	var Configuration = {
		"Jenkins-Cot" : {
			"title": "Jenkins-Cot",
			"url" : "http://lcalink.dyndns.org/jenkins-cot/job/COT/rssAll",
			"visible":true
		},
		"Jenkins-Dashboards" : {
			"title": "Jenkins Dashboards",
			"url" : "http://lcalink.dyndns.org/jenkins-cot/job/LUCIA_BI_dashboards/rssAll",
			"visible":true
		},
		"Melinda" : {
			"title": "Melinda",
			"url" : "http://melinda.lcalink.com:8080/rssLatest",
			"visible":true
		},
		"Lobster" : {
			"title": "Lobster",
			"url" : "http://lobster.lcalink.com:8080/rssLatest",
			"visible":true
		},/*
		"error" : {
			"title": "error",
			"url" : "http://lcalink.dyndns.org/jenkins-cot/job/LUCIA_BI_dashboards/rssAll1111111111111111111111111111111",
			"visible":true
		},
		"Emiko" : {
			"title": "Emiko",
			"url" : "http://emiko.lcalink.com:8080/rssLatest",
			"visible":true
		},
		"Kaoru" : {
			"title": "Kaoru",
			"url" : "http://kaoru.lcalink.com:8080/rssLatest",
			"visible":true
		}*/
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