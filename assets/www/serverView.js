$( document ).ready( function() {
    var serverTemplate = '<div class="row" url="%url%">' +
        '<div class="row-image"><img src="%status%"/></div>' +
        '<div class="row-name">%name%</div>' +
    '</div>';
    
    loadURL = function( i ) {
    	config = jenkins.Config.configArray;
    	if ( !config[i] ) {
    		return false;
    	}
    	if ( config[i].visible === false ) {
    		loadURL( ++i );
    		return false;
    	}
    	var ajax = new XMLHttpRequest();
            ajax.open( "GET", config[i].url );
            var tmpfunction = function( xhr ) {
                var statusIcon = "images/icon-server-error.png";
                if ( ajax.readyState == 4 && ajax.status == 200 ) {
                    statusIcon = "images/icon-server-stable.png";
                    $( $.parseXML( ajax.responseText ) ).find( "entry" ).each( function() {
                        var title = $( this ).find( "title" ).text(),
                        dateTime = $( this ).find( "updated" ).text(),
                        buildNumberEnd = title.indexOf( "(" );
                        var serverStatus = title.substr( buildNumberEnd );
                        if ( serverStatus.indexOf( "(stable)" ) < 0 && serverStatus.indexOf( "normal" ) < 0 && serverStatus.indexOf( "?" ) < 0 ) {
                            statusIcon = "images/icon-server-fail.png";
                        }
                    } );
                    var tmp = serverTemplate.replace( "%status%", statusIcon );
                    tmp = tmp.replace( "%url%", config[i].url );
                    tmp = tmp.replace( "%name%", config[i].title );
                    $( "#main" ).append( tmp );
                    loadURL( ++i );
                }  else if ( ajax.readyState == 4 && ajax.status != 200 ) {
                    var tmp = serverTemplate.replace( "%status%", statusIcon );
                    tmp = tmp.replace( "%url%", config[i].url );
                    tmp = tmp.replace( "%name%", config[i].title + "~" + ajax.status + "~"  + ajax.readyState );
                    $( "#main" ).append( tmp );
                    loadURL( ++i );
                }
            };
            ajax.onreadystatechange = tmpfunction;
            ajax.send();
    }
    loadURL( 0 );
    
    var detailsTemplate = '<div class="row">' +
        '<div class="row-image"><img src="%status%"/></div>' +
        '<div class="row-name">%name%</div>' +
        '<div class="row-number">%number%</div>' +
        '<div class="row-datetime"><img src="images/icon-time.png"/><span>%datetime%</span></div>' +
    '</div>';
    renderDetails = function( currentServer, url ) {
    	var ajax = new XMLHttpRequest();
            ajax.open( "GET", url );
            var tmpfunction = function( xhr ) {
                if ( ajax.readyState == 4 && ajax.status == 200 ) {
                	for ( var i=0; i<5; i++ )
                    $( $.parseXML( ajax.responseText ) ).find( "entry" ).each( function() {
                        var line = $( this ).find( "title" ).text(),
                            buildNameEnd = line.indexOf(" #"),
                            buildNumberEnd = line.indexOf( "(" ),
                            title = line.slice(0, buildNameEnd),
                            number = line.slice(buildNameEnd, buildNumberEnd),
                            datetime = $( this ).find( "updated" ).text().replace(/T|Z/g, " ");
                            
                        var statusIcon, serverStatus = title.substr( buildNumberEnd );
                        /* determine icon here */
                        if (serverStatus.indexOf("(stable)") >= 0 || serverStatus.indexOf("normal") >= 0) {
                            statusIcon = "images/icon-stable.png";
                        } else if (serverStatus.indexOf("?") >= 0) {
                            statusIcon = "images/icon-building.png";
                        } else{
                            statusIcon = "images/icon-fail.png";
                        };
                        var tmp = detailsTemplate.replace( "%status%", statusIcon )
                                                 .replace( "%name%", title )
                                                 .replace( "%number%", number )
                                                 .replace( "%datetime%", datetime );
	                    $( "div#details" ).append( tmp );
                    } );
                }  else if ( ajax.readyState == 4 && ajax.status != 200 ) {
                	alert("Url seems to be invalid. Change your settings");
                	$( "div#details" ).hide();
                	$( "div#main" ).show( 1000 );
                }
            };
            ajax.onreadystatechange = tmpfunction;
            ajax.send();
    };
    
	$( "div.row" ).live('click', function() {
		$( "div#main" ).hide();
		var url = $(this).attr( "url" ),
		    currentServer = $(this).find( ".row-name" ).text();
		jenkins.current = {currentServer: currentServer, url: url};
		renderDetails( currentServer, url );
		$( "div#details" ).hide().show( 1000 );
	} );
	homeClickEvent = function() {
		 $( "div#main" ).show( 1000 );
		 $( "div#details" ).children().remove();
		 jenkins.current = null;
	};

	refreshClickEvent = function() {
		var serverList = $( "div#main:visible" );
		 if ( serverList.length > 0 ) {
		 	serverList.hide();
		 	serverList.children().remove();
		 	i = 0;
		 	loadURL( i );
		 	serverList.show( 1000 );
		 } else {
		 	$( "div#details" ).hide();
		 	$( "div#details" ).children().remove();
		 	renderDetails( jenkins.current.currentServer, jenkins.current.url );
		 	$( "div#details" ).show( 1000 );
		 }
	};

    window.quitClickEvent = function() {
    	navigator.app.exitApp();
    };
    
    var settingsTemplate = '<div class="server-row active" rid="%id%" url="%url%">' + 
            '<div class="server-name">%name%</div>' +
            '<input type="button" value="-" class="remove" />' +
         '</div>';
	window.settingClickEvent = function() {
		$( "div#content" ).hide();
		$( "div#server-list" ).children().remove();
		$( "div#settings" ).show( 1000 );
		var config = jenkins.Config.config;
		for ( var i in config ) {
			var tmp = settingsTemplate.replace( "%name%", config[i].title )
                                        .replace( "%url%", config[i].url )
                                        .replace( "%id%", config[i].id );
			if ( config[i].visible === false ) {
				tmp = tmp.replace( "active", "" );
			}
			$( "div#server-list" ).append( tmp );
		}
	};
	
	$( "div#server-list input.remove" ).live('click', function() {
		$(this).parent().hide( 500 ).remove();
		jenkins.Config.remove( $(this).parent().attr( "rid" ) );
		jenkins.Config.save();
    } );
    
    $( "div#server-list div.server-row" ).live( "click", function() {
    	var current = $(this),
    	   rid = current.attr( "rid" );
    	if ( current.hasClass("active") ) {
    		current.removeClass( "active" );
    		jenkins.Config.setActive( rid, false );
    	} else {
    		current.addClass( "active" );
            jenkins.Config.setActive( rid, true );    		
    	}
    	jenkins.Config.save();
    } );
   
    var timer, currentTime;
	$( "div#server-list div.server-row" ).mousedown(function() {
		currentTime = new Date().getTime();
		var serverId= $(this).attr("rid"),
		  serverUrl = $(this).attr("url");
		  serverName = $(this).find(".server-name").text();
		timer = setTimeout(function() {
            $( "input#popup-id" ).val( serverId );
            $( "input#popup-name" ).val( serverName );
            $( "input#popup-url" ).val( serverUrl );
            $( "div#popup" ).show( 1000 );
        }, 1000);
    } ).mouseup(function() {
    	if ( new Date().getTime() - currentTime < 1000 ) {
            clearTimeout(timer);
    	}
    } );
    
    window.backClickEvent = function() {
    	$( "div#settings" ).hide();
    	$( "div#server-list" ).children().remove();
    	$( "div#details" ).hide();
    	$( "div#main" ).show();
        $( "div#content" ).show( 1000 );
        $( "div#refreshButton" ).click();
    };
    
    window.addClickEvent = function() {
    	$( "div#popup" ).show(1000);
    };
    
    $( "input#popup-cancel" ).click( function(){
    	$( "div#popup" ).hide();
    	$( "input#popup-name" ).val( "Name" );
        $( "input#popup-url" ).val( "Url" );
        $( "input#popup-id" ).val( "" );
    });
    
    $( "input#popup-save" ).click( function(){
    	var config = jQuery.parseJSON(window.localStorage.getItem("config")),
    	    serverName = $( "input#popup-name" ).val(),
    	    serverId = $( "input#popup-id" ).val();
    	    serverUrl = $( "input#popup-url" ).val();
    	var key = jenkins.Config.set(serverId, {title: serverName, url: serverUrl, visible: true});
    	jenkins.Config.save();
    	
    	if ( serverId === "" ) {
    		var tmp = settingsTemplate.replace( "%name%", serverName )
                                    .replace( "%url%", serverUrl )
                                    .replace( "%id%", key );
            $( "div#server-list" ).append( tmp );
    	} else {
    		var row = $( "div#server-list .server-row[rid=" + key + "]" );
    		row.attr( "url", serverUrl );
    		row.children( ".server-name" ).html( serverName );
    	}
    	
    	$( "div#popup" ).hide();
    	$( "input#popup-name" ).val( "Name" );
        $( "input#popup-url" ).val( "Url" );
        $( "input#popup-id" ).val( "" );
    } );
    /*
	function isTouchDevice(){
	    try{
	        document.createEvent("TouchEvent");
	        return true;
	    }catch(e){
	        return false;
	    }
	}
	
	function touchScroll(id){
	    if(isTouchDevice()){ //if touch events exist...
	       console.log("TYAT");
           console.log("TYAT", id);
	        var el=document.getElementById(id);
	        var scrollStartPos=0;
	       
	        document.getElementById(id).addEventListener("touchstart", function(event) {
	            scrollStartPos=this.scrollTop+event.touches[0].pageY;
	            event.preventDefault();
	        },false);
	
	        document.getElementById(id).addEventListener("touchmove", function(event) {
	            this.scrollTop=scrollStartPos-event.touches[0].pageY;
	            event.preventDefault();
	        },false);
	    }
	}
	
	touchScroll( "main" );*/
} );
