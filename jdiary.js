
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
	dataUrl: "https://netrc.github.io/jdiary/dtest.json",
	currPage: 0,
	lastPageAvail: 0,
	currLocTag: '',
	gMapUrl: "https://www.google.com/maps/d/embed?mid=1gq6dzgv8SMbpdThRQ4nj9U8zT_A"
}

function setView() {
	var m = $("#map");
	var mod = "&ll=51.75830779657324%2C-1.2635350191405905&z=14";
	var thisLocTag = dd[g.currPage].locTag;
	if (g.currLocTag != thisLocTag) {
		g.currLocTag = thisLocTag;
		var mm = ltag[thisLocTag];
		m.attr("src",g.gMapUrl+mm)
	}
}

function showEntry() {
	var thisDD = dd[g.currPage];
	$("#mainDate").html(thisDD.showDate);
	$("#intro").html(thisDD.text);
	if (thisDD.hasOwnProperty('note')) {
		$("#note").html(thisDD.note);  
	} else {
		$("#note").html("xxx");        
	}
	setView();
	// move map to new view if needed
	// inactivate prev/next buttons as necesary
	//location.href = "https://codepen.io/netrc/pen/oGgLjN#" + thisDD.date;
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
	g.currPage = 0;
	g.lastPageAvail = dd.length-1;
	showEntry();
}
function initPage(){
	//$("#next").click(setView);
	$("#next").click(nextEntry);
	$("#prev").click(prevEntry);
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
