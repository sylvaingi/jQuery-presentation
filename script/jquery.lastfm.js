/*---------------
 * jQuery Last.Fm Plugin by Engage Interactive
 * Examples and documentation at: http://labs.engageinteractive.co.uk/lastfm/
 * Copyright (c) 2009 Engage Interactive
 * Version: 1.0 (10-JUN-2009)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3 or later
---------------*/
/*-------------
V 1.1 By Sylvain Gizard
- Few fixes
- Added 'Currently listening img and text' in lfm_cur class
---------------*/

(function($){
	$.fn.lastFM = function(options) {
		
		var defaults = {
			number: 10,
			username: 'bendingunit00',
			apikey: '96e0589327a3f120074f74dbc8ec6443',
			artSize: 'medium',
			noart: 'noartwork.gif',
			onComplete: function(){}
		},
		settings = $.extend({}, defaults, options);

		var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+settings.username+'&api_key='+settings.apikey+'&limit='+settings.number+'&format=json&callback=?';
		
		var imgSize;
		if(settings.artSize == 'small'){imgSize = 0}
		if(settings.artSize == 'medium'){imgSize = 1}
		if(settings.artSize == 'large'){imgSize = 2}
		
		var $this = $(this),
        container = $this.find("dl.lfm:first");

		$this.empty().each(function() {
		
			$.getJSON(lastUrl, function(data){ 
				//Must have an array of tracks
				if(!(data.recenttracks.track instanceof Array))
					data.recenttracks.track=[data.recenttracks.track];
				
				//if a track is played, there's an extra track, thus we pop it..
				if(data.recenttracks.track.length==settings.number+1)
					data.recenttracks.track.pop();
					
				$.each(data.recenttracks.track, function(i, item){
				
					var art,
						url = stripslashes(item.url),
						song = item.name,
						artist = item.artist['#text'],
						album = (item.album['#text']!='')?item.album['#text']:'&nbsp;'; //Album can be missing sometimes
						
					if(item.image[imgSize]['#text'] == ''){
						art = settings.noart;
					}else{
						art = stripslashes(item.image[imgSize]['#text']);
					}					
					var $current = container.clone().appendTo($this).show();
					
					$('.lfm_song',$current).html(song);
					$('.lfm_artist',$current).html(artist);
					$('.lfm_album',$current).html(album);
					$('.lfm_art',$current).html("<img src='"+art+"' alt='Artwork for "+album+"'></img>");
					$('a',$current).attr({href : url, title : 'Listen to '+song+' on Last.FM' , target :  '_blank'});
					$('.lfm_cur',$current).html("");
					//Add currently listening icon and text
					if(item['@attr'] && item['@attr']['nowplaying']=='true'){
						$('.lfm_cur',$current).html("<img src='img/icon_eq.gif' alt='Currently listening'></img> Currently listening");
					}
					
					//callback
					if(i==(settings.number-1)){
						settings.onComplete.call(this);
					}
					
				});
			});
		});
	};
	
	//Clean up the URL's
	function stripslashes( str ) {	 
		return (str+'').replace(/\\(.?)/g, '$1');
	}
})(jQuery);