
	var var_st,
		map_color="lightblue",
		gTermsarray = [];

	function drawLineGraph(pPopularFiftyWordsLineGraph, minYYYYMM, maxYYYYMM, minDomain, maxDomain) {
		var vMargin = {top: 40, right: 20, bottom: 30, left: 50},
			vWidth = 800 - vMargin.left - vMargin.right + 100,
			vHeight = 600 - vMargin.top - vMargin.bottom,
			vMargin2 = { top: 300, right: 10, bottom: 20, left: 40 },
			vHeight2 = 500 - vMargin2.top - vMargin2.bottom,
			vColor,
			div,
			vClrCnt = 0,
			i = 0,
			xAxis,
			yAxis,
			vContext,
			vContextArea,
			valueline,
			vLineColor,
			// Parse the date / time
			vParseDate2 = d3.time.format("%Y%m%d").parse,
			// Set the ranges
		   	x = d3.time.scale()
			   .range([0, vWidth]),
			xScale2 = d3.time.scale()
			  .range([0, vWidth]), // Duplicate xScale for brushing ref later
			y = d3.scale.linear()
			   .range([vHeight, 0]),
			vColorArr = ["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", 
						"#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", 
						"#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", 
						"#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", 
						"#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", 
						"#F2DE8A","#0040FF", "#2EFE64", "#8258FA", "#2EFEC8", "#BCF5A9", "#58D3F7", "#A9F5F2", "#ECE0F8", 
						"#CED8F6","#FA58F4"];
			
			// Define the div for the tooltip
			div = d3.select("body").append("div")	
				.attr("class", "tooltip")				
				.style("opacity", 0);
				
			// Define the axes
			xAxis = d3.svg.axis().scale(x)
					.orient("bottom").ticks(10),
				
			xAxis2 = d3.svg.axis() // Axis for brush slider
			   		.scale(xScale2)
					.orient("bottom").ticks(10);

			yAxis = d3.svg.axis().scale(y)
					.orient("left").ticks(10);
			
			// Define the line
			valueline = d3.svg.line()
						.x(function(d) { 
							return x(d.date); 
						})
						.y(function(d) { 
							return y(d.yrMonthCount); 
						});
			
		// Adds the svg canvas
		svg = d3.select(line_graph).append("svg")
			   .attr("width", vWidth + vMargin.left + vMargin.right + 100)
			   .attr("height", vHeight + vMargin.top + vMargin.bottom +100)
			   .append("g")
			   .attr("transform","translate(" + vMargin.left + "," + vMargin.top + ")") 
			   .on("mouseover", function(d) {		
				})
			
		vColor = d3.scale.category20();  //color scale
			
		// Get the data  
		for(var i = 0 ; i < pPopularFiftyWordsLineGraph.length ; i++) {
			var vObj = pPopularFiftyWordsLineGraph[i];

			for(var j = 0 ; j < vObj.values.length ; j++) {
				var vKeyObj = vObj.values[j];

				pPopularFiftyWordsLineGraph[i].values[j].date = vParseDate2(""+vKeyObj.yyyymm);
				pPopularFiftyWordsLineGraph[i].values[j].yrMonthCount =  +pPopularFiftyWordsLineGraph[i].values[j].yrMonthCount;
			};

			pPopularFiftyWordsLineGraph[i].values.sort(function(a,b) {
				if (a.date<b.date)
					return -1;
				else if (a.date>b.date)
					return 1;
				else
					return 0;
			});
		}

		for(var i = 0 ; i < pPopularFiftyWordsLineGraph.length ; i++){
			gTermsarray.push(pPopularFiftyWordsLineGraph[i].values);
		}

		// Scale the range of the data
		x.domain(d3.extent(gTermsarray[0], function(d) { 
				return d.date; 
		}));
			
		y.domain([0, 70]);

		// Add the valueline path.
		svg.selectAll(".line")
		.data(gTermsarray).enter()
		.append("path")
		.attr("class", "line")
		.attr("stroke-width","2")
		.attr("stroke","brown")
		.attr("fill","none")
		.attr("clip-path","url(#clip)")						
		.attr("stroke",function(d){
			vLineColor = vColorArr[vClrCnt%50];

			vClrCnt++;
			return vLineColor;
		})
		.attr("d",function(d){
			return valueline(d);
		})
		.on("mouseover", function(d1) {
			svg.selectAll(".line")
			.transition().duration(300)
			.attr("stroke-width",function(d2) {
				if(d1 == d2)
					return 3;
				else
					return 2;
			})
			.attr("stroke-opacity",function(d2) {
				if(d1 == d2) {	
					document.getElementById("cls").innerHTML=""+d1[0].key_name;
					return 1; 
				} else
					return 0;
			})									
		}) 
		 .on("mouseout", function(d2) {
			svg.selectAll(".line")
			.transition().duration(300)
			.attr("stroke-opacity", 1)
			.attr("stroke-width",2);
		})
		
		// Add the X Axis
		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + vHeight + ")") //X axis line position
		.call(xAxis);

		 // Add the Y Axis
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
			
		 //Add yaxis label		
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("x", -10)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Monthly Fequency");
								
		//Set xaxis label			
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(0)")
		.attr("y", 510)
		.attr("x", 800)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Date");

		xScale2.domain(x.domain()); // Setting a duplicate xdomain for brushing reference later
								
		vBrush = d3.svg.brush()//for slider bar at the bottom
		.x(xScale2) 
		.on("brush", function () {
		x.domain(vBrush.empty() ? xScale2.domain() : vBrush.extent()); 
		
		svg.select(".x.axis")
		.transition()
		.call(xAxis);
								  
		//Redraw the line 
		svg.selectAll(".line")
		.attr("class", "line")
		.attr("stroke-width","2")
		.attr("stroke","brown")
		.attr("fill","none")
		.attr("clip-path","url(#clip)")
		.attr("stroke",function(d) {
			vLineColor = vColorArr[vClrCnt%50];

			vClrCnt++;
			return vLineColor;
		})
		.attr("d",function(d) {
			return valueline(d);
		})
		.on("mouseover", function(d1) {
			svg.selectAll(".line")
			.transition().duration(300)
			.attr("stroke-width",function(d2) {
				if(d1 == d2)	
					return 3;
				else
					return 2;
			})
			.attr("stroke-opacity",function(d2) {
				if(d1 == d2) {	
					document.getElementById("cls").innerHTML=""+d1[0].key_name;
					return 1;
				} else
					return 0;
			})
		}) 
		.on("mouseout", function(d2) {
		   svg.selectAll(".line")
		   .transition().duration(300)
		   .attr("stroke-opacity", 1)
		   .attr("stroke-width",2);
			})
		});

	//Slider Part			  
		vContext = svg.append("g") // Brushing context box container
			.attr("transform", "translate(" + 0 + "," + 450 + ")")
			.attr("class", "context")
			.attr("stroke","blue")
			.attr("stroke-opacity",.9)
			.attr("fill","white");

		svg.append("defs")
		.append("clipPath") 
		.attr("id", "clip")  
		.append("rect")
		.attr("stroke","blue")			
		.attr("stroke-opacity",.9)
		.attr("stroke-width","2")
		.attr("fill","none")
		.attr("width", vWidth)
		.attr("height", vHeight);  
				
		vContext.append("g") // Create brushing xAxis
		.attr("class", "x axis1")
		.attr("transform", "translate(0," + [vHeight2] + ")")
		.call(xAxis2);
				
		vContextArea = d3.svg.area() 
			.interpolate("monotone")
		 	.x(function(d) { 
		 		return xScale2(d.date); 
		 	}) // x is scaled to xScale2
		 	.y0(vHeight2) // Bottom line begins at vHeight2 (area line_graph not inverted) 
		 	.y1(150); // Top line of area, 0 (area line_graph not inverted)

		//plot the rect as the bar at the bottom
		vContext.append("path") // Path is created using svg.area details
		.attr("class", "area")
		.attr("fill","white")
		.attr("d", vContextArea(gTermsarray[0])) 
		.attr("fill", "#F1F1F2");
				
		//append the brush for the selection of subsection  
		vContext.append("g")
		.attr("class", "x brush")
		.call(vBrush)
		.selectAll("rect")
		.attr("stroke","steelblue")
		.attr("transform", "translate(0," + 150 + ")")
		.attr("height", vHeight2)
		.attr("fill", "black")
		.attr("opacity",.4); 
	}