
var ltag = {
	'thetford': '',
	'oxford': '&ll=51.75830779657324%2C-1.2635350191405905&z=14'
};
var dd = [
{ date: "1918-02-19",
showDate: "Feb 19, 1918",
locTag: "thetford",
text: "Feb 19 - The third day of the raid. They had a bad time last night by the way the guns were going. They\'re at it again tonight and I can hear the guns booming away. Word came through today that Buckley was killed at Hounslow yesterday on a Pip. He is the sixt of our \"Italian Detachment\" to cash in.",
note: '<hr> This was the largest bombing raid by Germany over England. See <a target="_blank" href="https://en.wikipedia.org/wiki/German_strategic_bombing_during_World_War_I#1918"> Night Raids </a>'
},
{ date: "1918-02-20",
showDate: "Feb 20, 1918",
locTag: "oxford",
text: "more text"}
];

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

function setPageImage() {
	let u2 = "https://lh3.googleusercontent.com/v_Ra1lXpZaBC7bQlsW912NhWqBMjNXJZHQwEIxJMkX4FNRtQWH8Nqp-MjIgLivAqrwTA5cfbSrKFXOys8i1nbaCoCQdg8hOh1ZJGMhyzR9rhllBkF2Hr8FgWO4QXF6Rd_xlywJ-Rk03teeTybZ4JnvYju3713RvzyBtoZ7_TExUDXHZdDz0NnXvO0B1KVH6Ny3L_iC-3ueYgSOTqfXN-eZL7XndmMcjoVJimpqRCO1dmWDThIcxVpwre3WGazBCrvUNXTbz15GYF61IrcSGvqhOHy7kAKDOBVz7X_ZhbgP8TIO237LNVK32gTwaZ8jvF0vI8ks1xD6N9egxpIWMr9K4yyvXRe8YrEzW1kAcvvxHmj3o2sGqnH7-PE3UJqICH1DCwY3TOOF49QGksBfBLuisD5k-YRG3LOxANVbQdayMjeUHuLcSswARGX4aiRrapQU0-MnLmnYnGZyh9i-5otNJd7eBDq62pnWlGUfYy4pR_ChLyr-fw1NReMhR6BjR86EwIVFqYPK_Z1fn96QodSdvk0bGa_Vl5WiR0RFXfHc8ih_-cMLqbzeADv7bRCrd6Wbmfo4b0kVAUGawNWSWVbFWSmiRG81pvltCZe3CvFbsNiSHw46t-u0UEAqH_Ok24-UyKkGVciextnq9QQEQADJxTf5U_O-agIGue=";
	let u2T = u2 + "w110-h86-no";

	var p = $("#pageImage");
	p.attr("src",u2T)
}

function showEntry() {
	var thisDD = g.jd[g.currPage];
	$("#mainDate").html(thisDD.showDate);
	$("#intro").html(convertMarkdown(thisDD.text));
	if (thisDD.hasOwnProperty('notes')) {
		$("#note").html(convertNoteMarkdown(thisDD.notes));  
	} else {
		$("#note").html("(no note)");        
	}
	setView();
	// move map to new view if needed
	// inactivate prev/next buttons as necesary
	//location.href = "https://codepen.io/netrc/pen/oGgLjN#" + thisDD.date;
	setPageImage();
}
function prevEntry() {
	if (g.currPage > 0) {
		g.currPage -= 1;
		showEntry();    
	}
}
function nextEntry() {
	if (g.currPage < g.lastPageAvail) {
		g.currPage += 1;
		showEntry();    
	}
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
	g.currPage = 0;
	showEntry();
}
function initPage(){
	//$("#next").click(setView);
	$("#next").click(nextEntry);
	$("#prev").click(prevEntry);
	console.log("URL=: " + location.href);
	$.get(g.dataURL, doJSON);

	let u = "https://lh3.googleusercontent.com/v_Ra1lXpZaBC7bQlsW912NhWqBMjNXJZHQwEIxJMkX4FNRtQWH8Nqp-MjIgLivAqrwTA5cfbSrKFXOys8i1nbaCoCQdg8hOh1ZJGMhyzR9rhllBkF2Hr8FgWO4QXF6Rd_xlywJ-Rk03teeTybZ4JnvYju3713RvzyBtoZ7_TExUDXHZdDz0NnXvO0B1KVH6Ny3L_iC-3ueYgSOTqfXN-eZL7XndmMcjoVJimpqRCO1dmWDThIcxVpwre3WGazBCrvUNXTbz15GYF61IrcSGvqhOHy7kAKDOBVz7X_ZhbgP8TIO237LNVK32gTwaZ8jvF0vI8ks1xD6N9egxpIWMr9K4yyvXRe8YrEzW1kAcvvxHmj3o2sGqnH7-PE3UJqICH1DCwY3TOOF49QGksBfBLuisD5k-YRG3LOxANVbQdayMjeUHuLcSswARGX4aiRrapQU0-MnLmnYnGZyh9i-5otNJd7eBDq62pnWlGUfYy4pR_ChLyr-fw1NReMhR6BjR86EwIVFqYPK_Z1fn96QodSdvk0bGa_Vl5WiR0RFXfHc8ih_-cMLqbzeADv7bRCrd6Wbmfo4b0kVAUGawNWSWVbFWSmiRG81pvltCZe3CvFbsNiSHw46t-u0UEAqH_Ok24-UyKkGVciextnq9QQEQADJxTf5U_O-agIGue=w1096-h858-no";
}

$(document).ready(initPage); 

// add map programmatically
// (flight pan from marker to marker)
// 
// Text
// Just add as normal text to HTML page / or fake #include it
//   ... this allows easier/better placement of extra links
// <iframe src="https://www.google.com/maps/d/embed?mid=1gq6dzgv8SMbpdThRQ4nj9U8zT_A" width="640" height="480"></iframe>
