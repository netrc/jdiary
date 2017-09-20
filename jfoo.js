
var ltag = {
	'thetford': '',
	'oxford': '&ll=51.75830779657324%2C-1.2635350191405905&z=14'
};

var g = {   // The Global State (boo!)
	//diaryURL: "https://netrc.github.io/jdiary/diary.json",
	diaryURL: "diary.json",  //"dtest.json",   // relative to current URL
	dataURL: "data.json",  
	currPage: 0,
	lastPageAvail: 0,
	currLocTag: '',
	currPTag: '',
	mainTextEl: '',
	pages: {}, // object with properties set to page tages, e.g. "p001"
	icons: {}, // object with properties set to icon tags, e.g. "anchor"
	locs: [],	// array of location objects
	views: {}, // object with properties set to view tags, e.g. "start"
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
	console.log(`showEntry: d jtag: ${jd.jtag}`);

	if (g.currPTag != jd.jtag) {  // then, new page to view
		let pThumb = "", pFull = "";
		if (g.pages.hasOwnProperty(jd.jtag)) {
			pThumb = g.pages[jd.jtag].baseURL + "w110-h86-no";
			pFull = g.pages[jd.jtag].fullPage;
		} else {
			console.log(`cant find page pic for this day: ${jd.jtag}`);
		}
		g.mainTextEl.append(`<a target="_blank" href="${pFull}"> <img src="${pThumb}"> </a>`);
		g.currPTag = jd.jtag;
	} else { // tmp for testing
		g.mainTextEl.append("<p> no new page </p>");
	}

	g.mainTextEl.append("<a href=\"#" + jd.date + "\"></a>\n");
	g.mainTextEl.append("<div class='entryText'> <p> " + convertMarkdown(jd.text) + "</p></div>");
	if (jd.hasOwnProperty('notes')) {
		let nbName = "nb"+jd.date;
		g.mainTextEl.append("<button class=\"accordion\" id=\""+nbName+"\">Notes...</button>");
		g.mainTextEl.append("<div class=\"panel active\"> <p> " + convertMarkdown(jd.notes) + "</p></div>");
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
	console.log("initMap...");
	  var uluru = {lat: -25.363, lng: 131.044};
		var adelaide = {lat: -34.92899, lng: 138.601};

		let start = g.views["start"];
        var map = new google.maps.Map(document.getElementById('mapDiv'), {
          zoom: start.zoom,
          center: start.ll
        });

		let ico = "";
		ico = "http://www.gstatic.com/mapspro/images/stock/1443-trans-marine.png";
		ico = g.icons["anchor"];
        var m1 = new google.maps.Marker({ position: uluru, map: map });
        var m2 = new google.maps.Marker({ position: adelaide, map: map, icon: ico });
		g.locs.forEach(function(l) {	// icon, name, ll, text	
			console.log(`loc: ${l.name}  ${l.icon}`);
			new google.maps.Marker({ position: l.ll, map: map, icon: g.icons[l.icon] });
		});

		//map.panTo(adelaide);
}

function doData(data, status) {
	console.log("doData...");
	if (status != "success") {
		console.log("get data json error: " + status);
		return;
	}
	if (typeof(data) === "string") {  // local python http doesn't return JSON
		data = JSON.parse(data);
	}
	g.pages = data.PAGES;
	g.icons = data.ICONS;
	g.locs = data.LOCS;
	g.views = data.VIEWS;
	anchorData = location.href.replace(/.*#/,"");
	// if anchorData is a date, try and set that global currPage in doJSON
	// else start at 0
	g.jd.forEach(function(jd) {
		showEntry(jd);
	});
	initMap();
}

function doJSON(data, status) {
	console.log("doJSON (diary)...");
	if (status != "success") {
		console.log("get diary json error: " + status);
		return;
	}
	if (typeof(data) === "string") {  // local python http doesn't return JSON
		data = JSON.parse(data);
	}
	g.jd = data;
	g.lastPageAvail = g.jd.length-1; // NO LONGER USED
	$.get(g.dataURL, doData);
}
function initPage(){
	//$("#next").click(setView);
	//$("#next").click(nextEntry);
	////$("#prev").click(prevEntry);
	console.log("initPage - URL=: " + location.href);
	g.mainTextEl = $("#mainText");
	$.get(g.diaryURL, doJSON);
}

function apiReady() {
	console.log("apiReady...");
	$(document).ready(initPage); 
}

// add map programmatically
// (flight pan from marker to marker)
// 
// Text
// Just add as normal text to HTML page / or fake #include it
//   ... this allows easier/better placement of extra links
// <iframe src="https://www.google.com/maps/d/embed?mid=1gq6dzgv8SMbpdThRQ4nj9U8zT_A" width="640" height="480"></iframe>
