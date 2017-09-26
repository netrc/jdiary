
var ltag = {
	'thetford': '',
	'oxford': '&ll=51.75830779657324%2C-1.2635350191405905&z=14'
};

var g = {   // The Global State (boo!)
	//diaryURL: "https://netrc.github.io/jdiary/diary.json",
	diaryURL: "diary.json",  //"dtest.json",   // relative to current URL
	dataURL: "data.json",
	introMD: "introduction.md",
	otherNotesMD: "otherNotes.md",
	currPage: 0,
	lastPageAvail: 0,
	currLocTag: '',
	currPTag: '',
	mainTextEl: '',
	pageTop: [],  // array of offsets for each entry-card displayed
	pages: {}, // object with properties set to page tages, e.g. "p001"
	icons: {}, // object with properties set to icon tags, e.g. "anchor"
	locs: [],	// array of location objects
	views: {}, // object with properties set to view tags, e.g. "start"
	nbVisible: {}, // obj with props for each Button to hold vis State
	gMapUrl: "https://www.google.com/maps/d/embed?mid=1gq6dzgv8SMbpdThRQ4nj9U8zT_A",
	gmap: 0,  // the Google Map object
	jd: {}
}

function convertMarkdown( s ) {
	// newlines to <p>
	let ns = s.replace(/\n/g,"<p>");
	// URLs with labels
	ns = ns.replace(/\[\|(.*?)\|(.*?)\]/g,`<a href="$2" target="_blank"> $1 </a>`);
	// simple URLs
	ns = ns.replace(/\[\|(.*?)\]/g, `<a href="$1" target="_blank"> $1 </a>`);

	return ns;
}
function convertNoteMarkdown( s ) {
	return "<br><hr><br>" + convertMarkdown(s);
}


function showEntry(jd) {
	//console.log(`showEntry: d jtag: ${jd.jtag}`);

	if (g.currPTag != jd.jtag) {  // then, new page to view
		let pThumb = "", pFull = "";
		if (g.pages.hasOwnProperty(jd.jtag)) {
			pThumb = g.pages[jd.jtag].baseURL + "w220-h172-no";
			pFull = g.pages[jd.jtag].fullPage;
		} else {
			console.log(`cant find page pic for this day: ${jd.jtag}`);
		}
		g.mainTextEl.append(`<div class="pageThumb"> <a target="_blank" href="${pFull}"> <img src="${pThumb}"> </a> </div>`);
		g.currPTag = jd.jtag;
	} else {
		//g.mainTextEl.append("<p> no new page </p>");
	}

	g.mainTextEl.append(`<a href="#${jd.date}"></a>`);
	let nbName = "nb"+jd.date;
	let nbDiv = (jd.hasOwnProperty('notes')) ? `<div class="accordion"  id="${nbName}">Notes...</div>` : "";
	g.mainTextEl.append(`<div class="entryText" id="jd${jd.date}"> <p> ${convertMarkdown(jd.text)} </p> ${nbDiv}</div>`);
	if (jd.hasOwnProperty('notes')) {
		let nName = "n"+jd.date;
		let nn = $(`<div class="note hide" id="${nName}"> <p> ${convertMarkdown(jd.notes)} </p></div>`);
		g.mainTextEl.append(nn);
		g.nbVisible[nbName] = false;
		$(`#${nbName}`).click(function() {	 // see http://jsfiddle.net/chriscoyier/zgtfA/1/
			//console.log(`${nbName} clicked - curr state ${g.nbState[nbName]}`);
		 	if (g.nbVisible[nbName]) { // true == visible, so hide it
		 		nn.slideUp('fast',function(){
		 			nn.addClass(`hide`).slideDown(0);
		 			g.nbVisible[nbName] = false;
		 		});
		 	} else {  // false == hidden, so show it
		 		nn.slideUp(0,function(){
		 			nn.removeClass(`hide`).slideDown(`fast`);
		 			g.nbVisible[nbName] = true;
		 		});
		 	}
		});
	}

	//setView();
	// move map to new view if needed
	// inactivate prev/next buttons as necesary
	//location.href = "https://codepen.io/netrc/pen/oGgLjN#" + thisDD.date;
}

var gmStyles = [
  { "elementType": "geometry", "stylers": [ { "color": "#ebe3cd" } ] },
  { "elementType": "labels.text.fill", "stylers": [ { "color": "#523735" } ] },
  { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f1e6" } ] },
  { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#c9b2a6" } ] },
  { "featureType": "administrative.land_parcel", "elementType": "geometry.stroke", "stylers": [ { "color": "#dcd2be" } ] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#ae9e90" } ] },
  { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [ { "color": "#dfd2ae" } ] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#dfd2ae" } ] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#93817c" } ] },
  { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [ { "color": "#a5b076" } ] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#447530" } ] },
  { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#f5f1e6" } ] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#fdfcf8" } ] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#f8c967" } ] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#e9bc62" } ] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [ { "color": "#e98d58" } ] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [ { "color": "#db8555" } ] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#806b63" } ] },
  { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#dfd2ae" } ] },
  { "featureType": "transit.line", "elementType": "labels.text.fill", "stylers": [ { "color": "#8f7d77" } ] },
  { "featureType": "transit.line", "elementType": "labels.text.stroke", "stylers": [ { "color": "#ebe3cd" } ] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#dfd2ae" } ] },
  { "featureType": "water", "elementType": "geometry.fill", "stylers": [ { "color": "#83B3D4"     //"#99d3c2" } ] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#92998d" } ] }
];

function initMap() {
	console.log("initMap...");
	let start = g.views["Start"];
  g.gmap = new google.maps.Map(document.getElementById('mapDiv'), {
      zoom: start.zoom,
	  mapTypeId: 'terrain',
      styles: gmStyles,
	  center: start.ll
		});

	g.locs.forEach(function(l) {	// icon, name, ll, text
		//console.log(`loc: ${l.name}  ${l.icon}`);
		new google.maps.Marker({ position: l.ll, map: g.gmap, title: l.name, icon: g.icons[l.icon] });
	});
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
	// for scroll-mapping...
	// get scroll offsets of each page card
	g.jd.map( jd => {  // orjust add pTop absOffset to existing g.jd objects
		//console.log(`getting top of #${jd.date}`);
		g.pageTop.push( {jd: jd, absOffset: $(`#jd${jd.date}`).offset().top});
	});
	// other idea, in order to not have to search array
	// ... keep linear/integer array of Top-pos mod 10 (about 1000 elems); just index into this array rather than search
	g.currView = '';
	$(`#mainText`).on('scroll',function(){
		let scrollTopPos = $(this).scrollTop(); // curr scroll position
		//console.log(`scroll - stp: ${scrollTopPos}`);
		// magic number 120 seems to give good results
		let currPageTop = g.pageTop.find( pt => { return scrollTopPos-120 < pt.absOffset;});
		if (g.currView != currPageTop.jd.vtag) {
			console.log(`scroll - new view - ${currPageTop.jd.vtag}`);
			g.currView = currPageTop.jd.vtag;
			if (g.views.hasOwnProperty(g.currView)) {
				g.gmap.panTo(g.views[g.currView].ll);
				g.gmap.setZoom(g.views[g.currView].zoom);
			} else {
				console.log(`missing VIEWS for ${g.currView}`)
			}
		}
	});
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

function doIntro(data, status) {
	if (status != "success") {
		console.log("get intro md error: " + status);
		return;
	}
	$(`#app`).append(`<div id="intro"> ${convertMarkdown(data)}</div>`);
}
function doOtherNotes(data, status) {
	if (status != "success") {
		console.log("get other notes error: " + status);
		return;
	}
	$(`#app`).append(`<div id="intro"> ${convertMarkdown(data)}</div>`);
}

function doPrint(data, status) {
	if (status != "success") {
		console.log("get other notes error: " + status);
		return;
	}
	if (typeof(data) === "string") {  // local python http doesn't return JSON
		data = JSON.parse(data);
	}
	var t = "";
	g.jd = data;
	g.jd.forEach(function(jd) {
		t += `<p> ${convertMarkdown(jd.text)} </p>`;
		if (jd.hasOwnProperty('notes')) {
 			t += `<p> NOTE: ${convertMarkdown(jd.notes)} </p>`;
		}
	});
	$(`#app`).append(`<div id="intro"> ${t}</div>`);
}

function doRouting() {
	let newU = location.href;
	console.log(`doRouting: ${newU}`)// manual routing
	$(`#app`).empty();
	if (newU.match(/.*#Introduction/)) {
		$.get(g.introMD, doIntro);
	} else if (newU.match(/.*#Notes/)) {
		$.get(g.otherNotesMD, doOtherNotes);
	} else if (newU.match(/.*#Print/)) {
		$.get(g.diaryURL, doPrint);
	} else { // THE DIARY
		$(`#app`).append(`	<div id="mainText"> </div> <div id="mainPane"> <div id="mapDiv"> </div> </div>`)
		g.mainTextEl = $("#mainText");
		$.get(g.diaryURL, doJSON);
	}
}

function initPage(){
	//$("#next").click(setView);
	//$("#next").click(nextEntry);
	////$("#prev").click(prevEntry);
	window.onhashchange = doRouting;
	console.log("initPage - URL=: " + location.href);
	// auto start if URL is empty
	location.href="#Introduction";
	//doRouting(); // why do I have to call this?
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
