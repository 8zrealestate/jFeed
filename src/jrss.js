function JRss(xml) {
    this._parse(xml);
};
    

JRss.prototype  = {
    
    _parse: function(xml) {
     
        if(jQuery('rss', xml).length == 0) this.version = '1.0';
        else this.version = jQuery('rss', xml).eq(0).attr('version');

        var channel = jQuery('channel', xml).eq(0);
    
        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').text();
        this.description = jQuery(channel).find('description:first').text();
        this.language = jQuery(channel).find('language:first').text();
        this.updated = jQuery(channel).find('lastBuildDate:first').text();
    
        this.items = new Array();
        
        var feed = this;

        jQuery('item', xml).each( function() {
            var item = new JFeedItem();
            
            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).text();
            item.description = jQuery(this).find('description').eq(0).text();
            item.updated = jQuery(this).find('pubDate').eq(0).text();
            item.id = jQuery(this).find('guid').eq(0).text();
            item.latlon = jQuery(this).find("georss\\:point,point").eq(0).text();

            // store the <content:encoded> section and hand it off to the imageURL parser to get the imageURL
	    var contentEncodedJQueryObject = jQuery(this).find("content\\:encoded,encoded").eq(0);
	    item.contentEncoded = contentEncodedJQueryObject.text();
            item.imageURL = feed._getImageURLFromSrcTag(contentEncodedJQueryObject);

            feed.items.push(item);
        });
    },
    _getImageURLFromSrcTag: function (jQueryObjectToSearch) {

        var imageURL;
        // cData does not get parsed by the jFeed parser, so we need to manually
        // access the object and parse it into a jQuery object, since the
        // content:encoded cData object is where our imageURLs are
        var cDataObject = jQuery(jQueryObjectToSearch[0].childNodes[0].data);

        cDataObject.find('img').each(function() {
            var src = jQuery(this).attr('src');
            var match = src.match(/\.(jpg)|(JPG)|(jpeg)|(JPEG)|(png)|(PNG)|(gif)|(GIF)$/);
            if (match) {
                imageURL = src;
                return false; // match found -- break out of the each loop
            }

        });
	    return imageURL; // no JPG src matches found within jQueryObjectToSearch
    }

};

