	// Converts data to the format required to drar word cloud
	function convertToTagData(pData) {
		var vMostPopularWordCount = d3.nest()
			.key(function(d) { return d.key_name; })
			.rollup(function(v) { 
				return v.length;
			})
			.entries(pData);
		
		return vMostPopularWordCount;
	}

	//Save json file to local.
	function saveText(text, filename){
		var blob = new Blob([text], {type: "application/json"}),
			url  = URL.createObjectURL(blob),
			a = document.createElement('a');

		a.download    = filename;
		a.href        = url;
		a.textContent = "Download "+filename;
		document.getElementById('content').appendChild(a);
	}

	// Converts input data to the format required to draw line graph for 50 terms	
	function convertToGraphData(pData, pWordArr) {
		var vGrpByKeyNameFiftyArr = new Array(),
			vGrpByKeyNameFifty,
			vYyyymmCount,
			i,
			j,
			yrMonthCount,
			vObj,
		 	vGrpByKeyName = d3.nest()
		.key(function(d) { 
			return d.key_name; 
		})		
		.entries(pData);
		
		for(i  = 0 ; i < pWordArr.length ; i++) {
			vGrpByKeyNameFifty = _.findWhere(vGrpByKeyName, {key: pWordArr[i].key});
			
			vYyyymmCount = d3.nest()
			.key(function(d) { return d.yrMonth; })
			.rollup(function(v) { 
				return v.length;
			})
			.entries(vGrpByKeyNameFifty.values);
			
			for(j = 0 ; j < vGrpByKeyNameFifty.values.length ; j++) {
				yrMonthCount = _.findWhere(vYyyymmCount, {key: ""+vGrpByKeyNameFifty.values[j].yrMonth});
				vGrpByKeyNameFifty.values[j].yrMonthCount = yrMonthCount.values;
			}			
			vObj = {};
			vObj.key = pWordArr[i].key;
			vObj.freqByMonth = vYyyymmCount;
			vGrpByKeyNameFiftyArr.push(vGrpByKeyNameFifty);
		}		
		return vGrpByKeyNameFiftyArr;		
	}

	// Converts input data to custom format
	function populateDataArray(pData) {
		var vDataArr = new Array(),
			vReturnDataArray =  new Array(),
			vPersonArray =  new Array(),
		 	vLocationArray =  new Array(),
		 	vOrgArray =  new Array(),
			vMiscArray =  new Array(),
			i,
			vCurrentObj;

		for(i = 0 ; i < pData.length ; i++) {
			vCurrentObj = pData[i];
			vPersonArray = convertToCommonFormat(vCurrentObj,"person");
			vLocationArray = convertToCommonFormat(vCurrentObj,"location");
			vOrgArray = convertToCommonFormat(vCurrentObj,"organization");
			vMiscArray = convertToCommonFormat(vCurrentObj,"miscellaneous");
			vDataArr = vPersonArray.concat(vLocationArray).concat(vOrgArray).concat(vMiscArray);
			vReturnDataArray = vReturnDataArray.concat(vDataArr);
		}
		return vReturnDataArray;
	}
	
	// Converts input data to custom format
	function convertToCommonFormat(pData, pType) {
		var vDataArray = new Array(),
			vReturnDataArray = new Array(),
			vNewJsonObj,
			vDateArr,
			vDay,
			i;

		if(pType === "person") {
			vDataArray = pData.person.split("|");
		} else if(pType === "location") {
			vDataArray = pData.location.split("|");
		} else if(pType === "organization") {
			vDataArray = pData.organization.split("|");
		} else {
			vDataArray = pData.miscellaneous.split("|");
		}
		
		for(i = 0 ; i < vDataArray.length ; i++) {
			vNewJsonObj = {};
			vDateArr	=	pData.time.split("-"); 
			vDay = vDateArr[2].split(" ")[0];
			vNewJsonObj.key_name	=	vDataArray[i];
			vNewJsonObj.key_type =	pType;
			vNewJsonObj.date 	=	pData.time;
			vNewJsonObj.month	=	vDateArr[1];
			vNewJsonObj.year		=	vDateArr[0];
			vNewJsonObj.day		=	vDay;
			vNewJsonObj.yyyymm	=	parseInt(vDateArr[0]+vDateArr[1]+vDay)
			vNewJsonObj.yrMonth	=	parseInt(vDateArr[0]+vDateArr[1])
			vReturnDataArray.push(vNewJsonObj);
		};

		return vReturnDataArray;
	}
