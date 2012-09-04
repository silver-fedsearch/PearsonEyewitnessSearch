/*
 * The MIT License
 * 
 * Copyright (c) 2012 MetaBroadcast
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 */
var rest = require('restler');
var util = require('util');
var SearchResults = require('../modules/SearchResults');
var SearchResult = require('../modules/SearchResult');

var PearsonEyewitnessSearch = function(q, config, fn) {
	this.q = q;
	this.config = config;
	this.fn = fn; // callback function
};

PearsonEyewitnessSearch.prototype.run = function() {
	var url = 'https://api.pearson.com/eyewitness/london/block.json?q='
			+ this.q + '&apikey=' + this.config.apiKey;

	var o = this;
	
	var request;
	
	request = rest.get(url);
	
	var eyewitness_timeout = setTimeout(function () {
		request.abort("timeout");
	}, this.config.timeout);
	
	request.on('complete', function(data) {
		clearTimeout(eyewitness_timeout);
		var resultnum = 0;
		if (data.list) {
			
			var rawResults = [];
			if (Array.isArray(data.list.link)) {
				rawResults = data.list.link;
			} else {
				rawResults.push(data.list.link);
			}

			for ( var i in rawResults) {
				var content = rawResults[i];
				var result = new SearchResult();
				result.addId("eyewitness", content["@id"]);
				result.title = content["@title"];
				result.source = "eyewitness";
				if (content["@tag"] == "illustration") {
					result.type = "artistic";
				} else {
					result.type = "literary";
				}
                result.thumbnail_url = "";
				o.fn(result);
				resultnum++;
				if (resultnum > o.config.limit) {
					break;
				}
			}
		} else {
			util.error("eyewitness: Cannot understand response");
			util.error(util.inspect(data));
			util.error("=====");
		}
		o.fn("eyewitness", true);
	});
};

module.exports = PearsonEyewitnessSearch;
