
function convertMarkdown( s ) {
	// newlines to <p>
console.log(`s: ${s}`);
	let ns = s.replace(/\n/g,"<p>");
console.log(`replace <p>...ns: ${ns}`);
	// URLs with labels
	ns = ns.replace(/\[\|([^\]]*?)\|(.*?)\]/g,`<a href="$2" target="_blank"> $1 </a>`);
console.log(`replace urls with labels...ns: ${ns}`);
	// simple URLs
	ns = ns.replace(/\[\|(.*?)\]/g, `<a href="$1" target="_blank"> $1 </a>`);
console.log(`replace simple urls...ns: ${ns}`);
	// Date tags
	ns = ns.replace(/\[D\|(.*?)\]/g, `<a href="index.html#$1"> $1 </a>`);
console.log(`replace date tags ns: ${ns}`);
	// Geo tags
	ns = ns.replace(/\[G\|(.*?)\]/g, `<span class="geoTag" onclick="geoTagClick('$1');"> &otimes; </span>`);
console.log(`replace geo tags ns: ${ns}`);

	return ns;
}

 var date = "1917-10-19";
 var vtag = "Oxford";
 var text = "Oct 19 - We got a little taste of Zeppelin raids last night. The lights went out at 9:30 and the warning was given that the Huns were raiding London and had headed this way. They didn't get here but came to a village about 12 miles east. No one was very scared. I went to bed the same as usual for staying up wouldn't keep them away and didn't have much trouble getting to sleep.";
var notes = "Actually, this was the night of the largest Zeppelin fleet to attack England in WWI. [|https://en.wikipedia.org/wiki/German_strategic_bombing_during_World_War_I#Night_raids] xxx , [|largest fleet to attack UK on Oct 19|https://www.theguardian.com/news/2011/oct/16/weatherwatch-zeppelin-air-raid-first-world-war] yyy";
 var orignotes = "Actually, this was the night of the largest Zeppelin fleet to attack England in WWI. [|https://en.wikipedia.org/wiki/German_strategic_bombing_during_World_War_I#Night_raids] , [|largest fleet to attack UK on Oct 19|https://www.theguardian.com/news/2011/oct/16/weatherwatch-zeppelin-air-raid-first-world-war], [|general search|https://www.google.com/search?q=zeppelin+raid+london+october+19+1917&oq=zeppelin+raid+london+october+19+1917&aqs=chrome..69i57.8831j0j4&sourceid=chrome&ie=UTF-8] , [|http://lewishamwarmemorials.wikidot.com/incident:air-raid-ww1-19-20-october-1917], [|http://londonist.com/2010/07/wwi_airship_attacks_on_london_mappe], [|http://www.bridgetonowhere.friendsofburgesspark.org.uk/the-story-of-burgess-park-heritage-trail/heritage-trail-a-l/bomb-damage/]";
 var jtag = "p014";

var notes = "A WWI. [|https://b] c , [|d 19|https://e] f";

console.log(notes);
console.log("");
console.log(convertMarkdown(notes));
