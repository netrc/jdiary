
var ltag = {
	'thetford': '',
	'oxford': '&ll=51.75830779657324%2C-1.2635350191405905&z=14'
};

var g = {   // The Global State (boo!)
	//dataUrl: "https://netrc.github.io/jdiary/diary.json",
	dataURL: "diary.json",  //"dtest.json",   // relative to current URL
	currPage: 0,
	lastPageAvail: 0,
	currLocTag: '',
	gMapUrl: "https://www.google.com/maps/d/embed?mid=1gq6dzgv8SMbpdThRQ4nj9U8zT_A",
	jd: {}
}

function convertMarkdown( s ) {
	// newlines to <p>
	let ns = s.replace(/\n/g,"<p>");
	// URLs with labels
	ns = ns.replace(/\[\|(.*?)\|(.*?)\]/g,"<a href=\"$2\"> $1 </a>");
	// simple URLs
	ns = ns.replace(/\[\|(.*?)\]/g,"<a href=\"$1\"> $1 </a>");

	return ns;
}
function convertNoteMarkdown( s ) {
	return "<br><hr><br>" + convertMarkdown(s);
}

function setView() {
	var m = $("#map");
	if( g.jd[g.currPage].hasOwnProperty("locTag") ) {
		var thisLocTag = g.jd[g.currPage].locTag;
		if (g.currLocTag != thisLocTag) {
			g.currLocTag = thisLocTag;
			var mm = ltag[thisLocTag];
			m.attr("src",g.gMapUrl+mm)
		}
	}
}


function showEntry(jd) {
	div = $("#mainText");

	let u = "https://lh3.googleusercontent.com/v_Ra1lXpZaBC7bQlsW912NhWqBMjNXJZHQwEIxJMkX4FNRtQWH8Nqp-MjIgLivAqrwTA5cfbSrKFXOys8i1nbaCoCQdg8hOh1ZJGMhyzR9rhllBkF2Hr8FgWO4QXF6Rd_xlywJ-Rk03teeTybZ4JnvYju3713RvzyBtoZ7_TExUDXHZdDz0NnXvO0B1KVH6Ny3L_iC-3ueYgSOTqfXN-eZL7XndmMcjoVJimpqRCO1dmWDThIcxVpwre3WGazBCrvUNXTbz15GYF61IrcSGvqhOHy7kAKDOBVz7X_ZhbgP8TIO237LNVK32gTwaZ8jvF0vI8ks1xD6N9egxpIWMr9K4yyvXRe8YrEzW1kAcvvxHmj3o2sGqnH7-PE3UJqICH1DCwY3TOOF49QGksBfBLuisD5k-YRG3LOxANVbQdayMjeUHuLcSswARGX4aiRrapQU0-MnLmnYnGZyh9i-5otNJd7eBDq62pnWlGUfYy4pR_ChLyr-fw1NReMhR6BjR86EwIVFqYPK_Z1fn96QodSdvk0bGa_Vl5WiR0RFXfHc8ih_-cMLqbzeADv7bRCrd6Wbmfo4b0kVAUGawNWSWVbFWSmiRG81pvltCZe3CvFbsNiSHw46t-u0UEAqH_Ok24-UyKkGVciextnq9QQEQADJxTf5U_O-agIGue=w1096-h858-no";
	let u2 = "https://lh3.googleusercontent.com/v_Ra1lXpZaBC7bQlsW912NhWqBMjNXJZHQwEIxJMkX4FNRtQWH8Nqp-MjIgLivAqrwTA5cfbSrKFXOys8i1nbaCoCQdg8hOh1ZJGMhyzR9rhllBkF2Hr8FgWO4QXF6Rd_xlywJ-Rk03teeTybZ4JnvYju3713RvzyBtoZ7_TExUDXHZdDz0NnXvO0B1KVH6Ny3L_iC-3ueYgSOTqfXN-eZL7XndmMcjoVJimpqRCO1dmWDThIcxVpwre3WGazBCrvUNXTbz15GYF61IrcSGvqhOHy7kAKDOBVz7X_ZhbgP8TIO237LNVK32gTwaZ8jvF0vI8ks1xD6N9egxpIWMr9K4yyvXRe8YrEzW1kAcvvxHmj3o2sGqnH7-PE3UJqICH1DCwY3TOOF49QGksBfBLuisD5k-YRG3LOxANVbQdayMjeUHuLcSswARGX4aiRrapQU0-MnLmnYnGZyh9i-5otNJd7eBDq62pnWlGUfYy4pR_ChLyr-fw1NReMhR6BjR86EwIVFqYPK_Z1fn96QodSdvk0bGa_Vl5WiR0RFXfHc8ih_-cMLqbzeADv7bRCrd6Wbmfo4b0kVAUGawNWSWVbFWSmiRG81pvltCZe3CvFbsNiSHw46t-u0UEAqH_Ok24-UyKkGVciextnq9QQEQADJxTf5U_O-agIGue=";
	let u2T = u2 + "w110-h86-no";
	let u2F = "https://photos.app.goo.gl/RqqyZORCiPI2incM2";
	div.append("<a target=\"_blank\" href=\"" +u2F+ "\"> <img src=\"" + u2T + "\"> </a>");

	div.append("<a href=\"#" + jd.date + "\"></a>\n");
	div.append("<p> " + convertMarkdown(jd.text) + "</p>");
	if (jd.hasOwnProperty('notes')) {
		let nbName = "nb"+jd.date;
		div.append("<button class=\"accordion\" id=\""+nbName+"\">Notes...</button>");
		div.append("<div class=\"panel active\"> <p> " + convertMarkdown(jd.notes) + "</p></div>");
		$("#"+nbName).click = function() {
			$(this).next().slideToggle('fast');
			//this.classList.toggle("active");
			//let panel = this.nextElementSibling;
			//if (panel.style.maxHeight){
			  //panel.style.maxHeight = null;
			//} else {
			  //panel.style.maxHeight = panel.scrollHeight + "px";
			//}
		};
	}

	//setView();
	// move map to new view if needed
	// inactivate prev/next buttons as necesary
	//location.href = "https://codepen.io/netrc/pen/oGgLjN#" + thisDD.date;

}

function initMap() {
	  var uluru = {lat: -25.363, lng: 131.044};
		var adelaide = {lat: -34.92899, lng: 138.601};
		var midAtlantic = {lat: 38.96, lng: -46.20};

        var map = new google.maps.Map(document.getElementById('mainPane'), {
          zoom: 2,
          center: midAtlantic
        });
		var ico = "http://google.com/mapfiles/ms/micons/marina";
		var ico = "harbor.png";
		var ico = "http://www.gstatic.com/mapspro/images/stock/1443-trans-marine.png";


        var m1 = new google.maps.Marker({ position: uluru, map: map });
        var m2 = new google.maps.Marker({ position: adelaide, map: map, icon: ico });
		setTimeout(function(){ 
			//#34°55′44.4″S 138°36′3.6″E
			map.panTo(adelaide);
			}, 10000);
}

function doJSON(data, status) {
	if (status != "success") {
		console.log("get json error: " + status);
		return;
	}
	if (typeof(data) === "string") {  // local python http doesn't return JSON
		data = JSON.parse(data);
	}
	g.jd = data;
	g.lastPageAvail = g.jd.length-1;
	anchorData = location.href.replace(/.*#/,"");
	// if anchorData is a date, try and set that global currPage in doJSON
	// else start at 0
	data.forEach(function(jd) {
		showEntry(jd);
	});
}
function initPage(){
	//$("#next").click(setView);
	//$("#next").click(nextEntry);
	////$("#prev").click(prevEntry);
	console.log("URL=: " + location.href);
	$.get(g.dataURL, doJSON);
}

$(document).ready(initPage); 

// add map programmatically
// (flight pan from marker to marker)
// 
// Text
// Just add as normal text to HTML page / or fake #include it
//   ... this allows easier/better placement of extra links
// <iframe src="https://www.google.com/maps/d/embed?mid=1gq6dzgv8SMbpdThRQ4nj9U8zT_A" width="640" height="480"></iframe>
