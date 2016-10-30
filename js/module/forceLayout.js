function showRelationships(pTerm) {
        var h = 800, 
			w = 950,
			/* Set the color scale we want to use */
			color = d3.scale.category20(),
			gNodeArr = new Array(),
			gLinkArray = new Array(),
			gLocArr = [],
			gPersonArr = [],
			gMiscArr = [],
			gOrgArr = [],
			gColorObj = { LOCATION : "#48A36D",PERSON : "#56AE7C", MISC:   "#64B98C", ORG : "#72C39B"},
			gTerm = pTerm,
			gCnt = 0,
			gTermType,
			gTexts,
			gForce,
			gEdges,
			gNode,
			gNodes,
			gTooltip,
			/* Establish/instantiate an SVG container object */
			vSvg,
			vIsFound =  false;

		d3.select("#viewRelationships").select("svg").remove();
		vSvg = d3.select("#viewRelationships")
							.append("svg")
							.attr("height",h)
							.attr("width",w);
		/* Build the directional arrows for the links/edges */
			vSvg.append("svg:defs")
			.selectAll("marker")
			.data(["end"]) 
			.enter().append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 15)
			.attr("refY", -1.5)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

		/* Define the main worker or execution function */
		function createPerArr(pInputArr) {
			for(var i = 0 ; i < pInputArr.length ; i++) {
				gPersonArr.push(pInputArr[i]);
			}
		}

		function createLocArr(pInputArr) {
			for(var i = 0 ; i < pInputArr.length ; i++) {
				gLocArr.push(pInputArr[i]);
			}
		}

		function createOrgArr(pInputArr){
			for(var i = 0 ; i < pInputArr.length ; i++) {
				gOrgArr.push(pInputArr[i]);
			}
		}

		function createMiscArr(pInputArr){
			for(var i = 0 ; i < pInputArr.length ; i++) {
				gMiscArr.push(pInputArr[i]);
			}
		}

		d3.tsv("../data/wikinews.tsv", function(pData) {
			//parsedJsonArray = populateDataArray(data);
			for(var i = 0 ; i < pData.length ; i++ ) {
				if(!vIsFound) {
					if(_.contains(pData[i].location.split("|"), gTerm)) {
						createPerArr(pData[i].person.split("|"));
						createOrgArr(pData[i].miscellaneous.split("|"));
						createMiscArr(pData[i].organization.split("|"));
						gTermType = "loc";
						vIsFound = true;
					} else if(_.contains(pData[i].person.split("|"), gTerm)) {
						createLocArr(pData[i].location.split("|"));
						createOrgArr(pData[i].miscellaneous.split("|"));
						createMiscArr(pData[i].organization.split("|"));
						gTermType = "per";
						vIsFound = true;							
					} else if(_.contains(pData[i].organization.split("|"), gTerm)) {
						createPerArr(pData[i].location.split("|"));
						createLocArr(pData[i].miscellaneous.split("|"));
						createMiscArr(pData[i].person.split("|"));
						gTermType = "org";
						vIsFound = true;
					} else if(_.contains(pData[i].miscellaneous.split("|"), gTerm)) {
						createPerArr(pData[i].location.split("|"));
						createLocArr(pData[i].person.split("|"));
						createOrgArr(pData[i].organization.split("|"));
						gTermType = "misc";
						vIsFound = true;
					}
				}
			}
					
			gNode = {};
			gNode.name = gTerm;
			if(gLocArr.length == 0 ) {
					gNode.type = "location";
			} else if(gPersonArr.length == 0) {
				gNode.type = "person";
			} else if(gMiscArr.length == 0) {
				gNode.type = "miscellaneous";
			} else if(gOrgArr.length == 0) {
				gNode.type = "organization";
			}

			gNodeArr.push(gNode);
			for(var i = 0 ; i < gLocArr.length ; i++) {	
				var vNode = {},
					vLink = {};

				vNode.name = gLocArr[i];
				vNode.color =  gColorObj.LOCATION;
				vNode.type = "location";
				gNodeArr.push(vNode);
				vLink.source = 0;
				vLink.target = gCnt;
				gLinkArray.push(vLink);
				gCnt++;
			}
				
			for(var i = 0 ; i < gPersonArr.length ; i++) {	
				var vNode = {},
					vLink = {};

				vNode.name = gPersonArr[i];
				vNode.color =  gColorObj.PERSON;
				vNode.type = "person";
				gNodeArr.push(vNode);
				vLink.source = 0;
				vLink.target = gCnt;
				gLinkArray.push(vLink);
				gCnt++;
			}
					
			for(var i = 0 ; i < gOrgArr.length ; i++) {	
				var vNode = {},
					vLink = {};

				vNode.name = gOrgArr[i];
				vNode.color =  gColorObj.MISC;
				vNode.type = "organization";
				gNodeArr.push(vNode);
				vLink.source = 0;
				vLink.target = gCnt;
				gLinkArray.push(vLink);
				gCnt++;
			}
				
			for(var i = 0 ; i < gMiscArr.length ; i++) {	
				var vNode = {},
					vLink = {};

				vNode.name = gMiscArr[i];
				vNode.color =  gColorObj.ORG;
				vNode.type = "miscellaneous";
				gNodeArr.push(vNode);
				vLink.source = 0;
				vLink.target = gCnt;
				gLinkArray.push(vLink);
				gCnt++;
			}
					
			gTooltip = d3.select("#viewRelationships").append("div")
						.attr("class", "tooltip")
						.style("opacity", 0);//so that its not visible initially

				/* Draw the node labels first */
			gTexts = vSvg.selectAll("text")
						.data(gNodeArr)
						.enter()
						.append("text")
						.attr("fill", "black")
						.attr("font-family", "sans-serif")
						.attr("font-size", "10px")
						.text(function(d) { 
								return d.name; 
						}); 

			/* Establish the dynamic force behavor of the nodes */
			gForce = d3.layout.force()
						.nodes(gNodeArr)
						.links(gLinkArray)
						.size([w,h])
						.linkDistance([250])
						.charge([-1500])
						.gravity(0.3)
						.start();

			/* Draw the edges/links between the nodes */
			gEdges = vSvg.selectAll("line")
						.data(gLinkArray)
						.enter()
						.append("line")
						.style("stroke", "#ccc")
						.style("stroke-width", 1)
						.attr("marker-end", "url(#end)")
						.on("mouseover",  function(d) { 
							gTooltip.transition()
									.duration(200)
									.style("opacity", 0.9);
									gTooltip.html("<p>" +d.source.name+"(<b>"+d.source.type +"</b>) is related to </p><p>"+
									d.target.name+"(<b>"+d.target.type +"</b>) </p>")//tool tip html
									.style("left", (d3.event.pageX) + "px")
									.style("top", (d3.event.pageY - 28) + "px");
									})
									.on("mouseout",  function(d) { 
									
									});
			
			/* Draw the nodes themselves */                
			gNodes = vSvg.selectAll("circle")
						.data(gNodeArr)
						.enter()
						.append("circle")
						.attr("r", 20)
						.attr("opacity", 0.5)
						.style("fill", function(d,i) { 
							return color(i);
						})
						.call(gForce.drag);

			/* Run the Force effect */
			gForce.on("tick", function() {
				gEdges.attr("x1", function(d) { 
					return d.source.x; 
				})
				.attr("y1", function(d) { 
					return d.source.y; 
				})
				.attr("x2", function(d) { 
					return d.target.x; 
				})
				.attr("y2", function(d) { 
					return d.target.y; 
				});
				gNodes.attr("cx", function(d) { 
					return d.x; 
				})
				.attr("cy", function(d) { 
					return d.y; 
				})
				gTexts.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			}); // End tick func
		}); // End makeDiag worker func
    }