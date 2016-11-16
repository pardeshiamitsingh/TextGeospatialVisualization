
#Project - Text And Geospatial Visualization

#	Technology Stack -
	1) Angular JS - Enables one page application feature.
	2) D3 JS - For creating interactive data visualziations
	3) Underscore JS - For data manipulation
	4) Bootstrap JS and CSS - For styling user interface.

#	Github Link: https://github.com/pardeshiamitsingh/TextGeospatialVisualization

#	Link for Web Application:  https://pardeshiamitsingh.github.io/TextGeospatialVisualization-v1/html/

# 	Video Link:	https://lookback.io/watch/bXrnvExwH5qHE6vZt

#	SnapShots Of the Web Application:

## Word cloud
![top50popularwords](https://cloud.githubusercontent.com/assets/23156180/19853197/e95c4172-9f8d-11e6-9310-db75d5cba436.JPG)

## Time Vs Frequency (50 popular term)
![populartermsgraph](https://cloud.githubusercontent.com/assets/23156180/19853063/f12b96ce-9f8c-11e6-98d2-964238cd6c7a.JPG)

## Time Vs Frequency (Single term)
![singleterm](https://cloud.githubusercontent.com/assets/23156180/19853476/6efac1a4-9f8f-11e6-848f-0222aaf438d3.png)

## Relationship 
![relationships](https://cloud.githubusercontent.com/assets/23156180/19853248/1de9c072-9f8e-11e6-964a-8b7b585a99ba.JPG)


#	This is the project for visualizing 
	1) 	Most popular 50 words in word cloud
	2)	Monthly Frequency of the 50 popular words over the time frame.
		using D3, Angularjs, UnderscoreJS, Bootstrap and JQuery.
	3)	DIsplays Relationships.
	Here the data set used is 'wikinews.tsv'.	
	
#	The application consists of three tabs:
	The Tab rendering is handled using AngularJS.
	1) 	Most Popular Words:
		This Tab displays word cloud for the most popular top 50 words form wikinews.tsv dataset provided.
	2)	Popular Term Graph:
		This Tab displays monthly frequency of the 50 popular terms over time.
		When a term is selected its monthly frequency is highlighted.
		Users can quickly zoom into a time interval for daily frequency.
	3)	Relationships Graph:
		This is displayed using the force layout of D3. After entering the search term and hitting over the 
		search button, application searches the term in given data set and finds all the related terms for the
		entered term and draws a force layout as shown in the screenshot above.
		

		
