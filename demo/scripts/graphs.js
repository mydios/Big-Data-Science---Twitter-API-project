/**
 * Contains all functions to create the graphs
 * Lots of duplicate code, but due to timing constraints I left it like this
 */

var graphWidth = 170
var graphHeight = 130
var paddingLeft = 20

/**
 * 
 * @param {string} containerBarsId 
 */
function createTweetCountGraph(containerBarsId) {
  d3.csv('../data/tweets_per_day.csv').then(function(data){
    var barSpacing = 1
    var svg = d3.select(containerBarsId).append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
    var bars = svg.selectAll('rect').data(data).enter();
    var numDays = data.length;
    var max = d3.max(data, function(d){ return +d['counts'] })
    var yScale = d3.scaleLinear().domain([max, 0]).range([0, graphHeight]);
    var domain = d3.extent(data, function(d) {
      return new Date(d['date'])
    })

    // Add two extra days to the domain to have nicer axis
    domain[0] = domain[0].setDate(domain[0].getDate() - 1)
    domain[1] = domain[1].setDate(domain[1].getDate() + 1)
    var xScale = d3.scaleTime().domain(domain).range([paddingLeft + (graphWidth/numDays - barSpacing)/2, graphWidth+paddingLeft - (graphWidth/numDays - barSpacing)/2]);
    
    var xAxis = d3.axisBottom().scale(xScale).ticks(14);
    var yAxis = d3.axisLeft().scale(yScale).ticks(20);
    svg.append('g').attr('class','axis').attr("transform", "translate(-"+barSpacing/2+","+graphHeight+")").call(xAxis).selectAll('text').attr('y',-2).attr('x', 15).attr("transform", "rotate(90)")
    svg.append('g').attr('class','axis').style("font", "5px times").attr("transform", "translate(20,0)").call(yAxis)

    var rects = bars.append('rect')
      .attr('x', (data) => {
      return xScale(new Date(data['date'])) - (graphWidth/numDays - barSpacing)/2;
    }).attr('y', (data) => {
      return yScale(data['counts'])
    }).attr('height', (data) => {
      return 130 - yScale(data['counts'])
    }).attr('width', (170 / numDays) - barSpacing)
    .style('fill','rgb(94, 204, 123)');
          
    rects.on("mouseover", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(53, 150, 78)')
      var date = new Date(d['date']).toDateString().split(' ')
      var text = d3.select("#tweet-text")
      text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['counts']+ " tweets").style("visibility", "visible")
    });
    rects.on("mouseout", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(94, 204, 123)');
      svg.selectAll('#countLabel').remove()
      var text = d3.select("#tweet-text")
      text.style("visibility", "hidden")
    });
    
  })
}


function createKeywordGraph(containerId) {
    keywords = []
    d3.csv('../data/keyword_count.csv').then(function(data){
        data.sort(function(x, y) {
        return y['count'] - x['count']
      })
      data.forEach(d => {
        keywords.push(d['keyword']);
      });

      var barSpacing = 5
      var svg = d3.select(containerId).append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
      var bars = svg.selectAll('rect').data(data).enter();
      var max = d3.max(data, function(d){ return +d['count'] })
      var yScale = d3.scaleLinear().domain([max, 0]).range([0, graphHeight]);
      var xScale = d3.scaleBand().domain(keywords).range([paddingLeft, graphWidth+paddingLeft]);
      var yAxis = d3.axisLeft().scale(yScale).ticks(10);
      var xAxis = d3.axisBottom().scale(xScale)
      svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(-1,130)").call(xAxis).selectAll('text').attr('y',5).attr('x', 10).attr("transform", "rotate(45)").style("font", '4px sans-serif')

      svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(19,0)").call(yAxis)
    
      bars.append('rect')
        .attr('x', (data, _) => {
        return xScale(data['keyword']); 
      }).attr('y', (data, _) => {
        return yScale(data['count'])
      }).attr('height', (data, _) => {
        return 130 - yScale(data['count'])
      }).attr('width', (180 / data.length)-barSpacing)
      .style('fill','rgb(94, 204, 123)')
      
      data.forEach(d => {
        svg.append('text')
        .text(d['count'])
        .attr('x', xScale(d['keyword']) + ((180 / data.length)-barSpacing)/2)
        .attr('y', 129)
        .attr('text-anchor', 'middle')
        .style("font", '6px sans-serif')
      })
    })
}

function createInfectionsGraph(containerId) {    
    covid = {}
    barSpacing = 0.5
    d3.csv('data/COVID19BE_CASES_AGESEX.csv', function(d) {
      if (d['DATE'] in covid)
        covid[d['DATE']] = { date: d['DATE'], count: covid[d['DATE']]['count'] + parseInt(d['CASES'], 0) }
      else
        covid[d['DATE']] = { date: d['DATE'], count: parseInt(d['CASES'], 0) }
    }).then(_ => {
      delete covid['NA']
      covid_data = Object.values(covid)

      var svg = d3.select(containerId).append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
      var bars = svg.selectAll('rect').data(covid_data).enter();
      var numDays = covid_data.length;
      var max = d3.max(covid_data, function(d){ return +d['count'] })
      var yScale = d3.scaleLinear().domain([max, 0]).range([0, graphHeight]);
      var domain = d3.extent(covid_data, function(d) {
        return new Date(d['date'])
      })
      domain[0] = domain[0].setDate(domain[0].getDate() - 1)
      domain[1] = domain[1].setDate(domain[1].getDate() + 1)
      var xScale = d3.scaleTime().domain(domain).range([paddingLeft + (graphWidth/numDays - barSpacing)/2, graphWidth+paddingLeft - (graphWidth/numDays - barSpacing)/2]);
      
      var xAxis = d3.axisBottom().scale(xScale).ticks(5).tickSizeOuter(0);
      var yAxis = d3.axisLeft().scale(yScale).ticks(10);
      
      svg.append('g').attr('class','axis').attr("transform", "translate(-"+barSpacing/2+","+graphHeight+")").call(xAxis).selectAll('text').attr('y',-2).attr('x', 15).attr("transform", "rotate(90)")
      svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(20.5,0)").call(yAxis)

      var rects = bars.append('rect')
        .attr('x', (data, _) => {
        return xScale(new Date(data['date'])) - (graphWidth/numDays - barSpacing)/2; 
      }).attr('y', (data, _) => {
        return yScale(data['count'])
      }).attr('height', (data, _) => {
        return 130 - yScale(data['count'])
      }).attr('width', (graphWidth / numDays) - barSpacing)
      .style('fill','rgb(94, 204, 123)')


      rects.on("mouseover", function(d){
        var currentBar = d3.select(this);
        currentBar.style('fill','rgb(53, 150, 78)')
        var date = new Date(d['date']).toDateString().split(' ')
        var text = d3.select("#covid-cases-text")
        text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['count']+ " new cases").style("visibility", "visible")
    	});
      rects.on("mouseout", function(d){
        var currentBar = d3.select(this);
        currentBar.style('fill','rgb(94, 204, 123)');
        svg.selectAll('#countLabel').remove()
        var text = d3.select("#covid-cases-text")
        text.style("visibility", "hidden")
      });

    })
}

/**
 * 
 * @param {string} containerId Id of the div container which will contain the graph
 */
function createDeathsGraph(containerId) {
  covid_deaths   = {}
  var newWidth = graphWidth - 6
  var svg = d3.select(containerId).append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
  d3.csv('data/COVID19BE_MORT.csv', function(d) {
    if (d['DATE'] in covid_deaths)
      covid_deaths[d['DATE']] = { date: d['DATE'], count: covid_deaths[d['DATE']]['count'] + parseInt(d['DEATHS'], 0) }
    else
      covid_deaths[d['DATE']] = { date: d['DATE'], count: parseInt(d['DEATHS'], 0) }
  }).then(_ => {
    delete covid_deaths['NA']
    covid_deaths_filtered = Object.values(covid_deaths)

    var barSpacing = 0.5
    var bars = svg.selectAll('rect').data(covid_deaths_filtered).enter();
    var numDays = covid_deaths_filtered.length;
    var max = d3.max(covid_deaths_filtered, function(d){ return +d['count'] })
    var yScale = d3.scaleLinear().domain([max, 0]).range([0, 130]);
    var domain = d3.extent(covid_deaths_filtered, function(d) {
      return new Date(d['date'])
    })
    domain[0] = domain[0].setDate(domain[0].getDate() - 1)
    domain[1] = domain[1].setDate(domain[1].getDate() + 1)
    var xScale = d3.scaleTime().domain(domain).range([paddingLeft + (newWidth/numDays - barSpacing)/2, newWidth+paddingLeft - (newWidth/numDays - barSpacing)/2]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(17).tickSize(4);
    var yAxis = d3.axisLeft().scale(yScale).ticks(10);
    
    svg.append('g').attr('class','axis').attr("transform", "translate(-"+barSpacing/2+","+graphHeight+")").call(xAxis).selectAll('text').attr("transform", "rotate(90)").attr('y',-2).attr('x', 16)
    svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate("+paddingLeft+",0)").call(yAxis)

    var rects = bars.append('rect')
      .attr('x', (data, _) => {
        return xScale(new Date(data['date'])) - (newWidth/numDays - barSpacing)/2; 
      }).attr('y', (data, _) => {
        return yScale(data['count'])
      }).attr('height', (data, _) => {
        return 130 - yScale(data['count'])
      }).attr('width', (newWidth / numDays) - barSpacing)
      .style('fill','rgb(94, 204, 123)')


    rects.on("mouseover", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(53, 150, 78)')
      var date = new Date(d['date']).toDateString().split(' ')
      var text = d3.select("#covid-deaths-text")
      text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['count']+ " new deaths").style("visibility", "visible")
    });
    rects.on("mouseout", function(_){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(94, 204, 123)');
      svg.selectAll('#countLabel').remove()
      var text = d3.select("#covid-deaths-text")
      text.style("visibility", "hidden")
    });
  })
}

function createHospitalGraph(containerId) {    
  covid = {}
  barSpacing = 0.5
  d3.csv('data/COVID19BE_HOSP.csv', function(d) {
    if (d['DATE'] in covid)
      covid[d['DATE']] = { date: d['DATE'], count: covid[d['DATE']]['count'] + parseInt(d['NEW_IN'], 0) }
    else
      covid[d['DATE']] = { date: d['DATE'], count: parseInt(d['NEW_IN'], 0) }
  }).then(_ => {
    delete covid['NA']
    covid_data = Object.values(covid)

    var svg = d3.select(containerId).append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
    var bars = svg.selectAll('rect').data(covid_data).enter();
    var numDays = covid_data.length;
    var max = d3.max(covid_data, function(d){ return +d['count'] })
    var yScale = d3.scaleLinear().domain([max, 0]).range([0, graphHeight]);
    var domain = d3.extent(covid_data, function(d) {
      return new Date(d['date'])
    })
    domain[0] = domain[0].setDate(domain[0].getDate() - 1)
    domain[1] = domain[1].setDate(domain[1].getDate() + 1)
    var xScale = d3.scaleTime().domain(domain).range([paddingLeft + (graphWidth/numDays - barSpacing)/2, graphWidth+paddingLeft - (graphWidth/numDays - barSpacing)/2]);
    
    var xAxis = d3.axisBottom().scale(xScale).ticks(5).tickSizeOuter(0);
    var yAxis = d3.axisLeft().scale(yScale).ticks(10);
    
    svg.append('g').attr('class','axis').attr("transform", "translate(-"+barSpacing/2+","+graphHeight+")").call(xAxis).selectAll('text').attr('y',-2).attr('x', 15).attr("transform", "rotate(90)")
    svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(20.5,0)").call(yAxis)

    var rects = bars.append('rect')
      .attr('x', (data, _) => {
      return xScale(new Date(data['date'])) - (graphWidth/numDays - barSpacing)/2; 
    }).attr('y', (data, _) => {
      return yScale(data['count'])
    }).attr('height', (data, _) => {
      return 130 - yScale(data['count'])
    }).attr('width', (graphWidth / numDays) - barSpacing)
    .style('fill','rgb(94, 204, 123)')


    rects.on("mouseover", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(53, 150, 78)')
      var date = new Date(d['date']).toDateString().split(' ')
      var text = d3.select("#covid-hosp-text")
      text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['count']+ " new hospitalizations").style("visibility", "visible")
    });
    rects.on("mouseout", function(_){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(94, 204, 123)');
      svg.selectAll('#countLabel').remove()
      var text = d3.select("#covid-hosp-text")
      text.style("visibility", "hidden")
    });

  })
}

/**
 * Create graph with Covid-19 deaths and append the sentiment deviation line to it
 * @param {string} containerId Id of the div which will contain the graph
 */
function createDeathSentGraph(containerId) {
  covid_deaths   = {}
  var newWidth = graphWidth - 6
  var svg = d3.select(containerId).append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
  d3.csv('data/COVID19BE_MORT.csv', function(d) {
    if (d['DATE'] in covid_deaths)
      covid_deaths[d['DATE']] = { date: d['DATE'], count: covid_deaths[d['DATE']]['count'] + parseInt(d['DEATHS'], 0) }
    else
      covid_deaths[d['DATE']] = { date: d['DATE'], count: parseInt(d['DEATHS'], 0) }
  }).then(_ => {
    delete covid_deaths['NA']
    covid_deaths_filtered = Object.values(covid_deaths)

    var barSpacing = 0.5
    var bars = svg.selectAll('rect').data(covid_deaths_filtered).enter();
    var numDays = covid_deaths_filtered.length;
    var max = d3.max(covid_deaths_filtered, function(d){ return +d['count'] })
    var yScale = d3.scaleLinear().domain([max, 0]).range([0, 130]);
    var domain = d3.extent(covid_deaths_filtered, function(d) {
      return new Date(d['date'])
    })
    domain[0] = domain[0].setDate(domain[0].getDate() - 1)
    domain[1] = domain[1].setDate(domain[1].getDate() + 1)
    var xScale = d3.scaleTime().domain(domain).range([paddingLeft + (newWidth/numDays - barSpacing)/2, newWidth+paddingLeft - (newWidth/numDays - barSpacing)/2]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(17).tickSize(4);
    var yAxis = d3.axisLeft().scale(yScale).ticks(10);
    
    svg.append('g').attr('class','axis').attr("transform", "translate(-"+barSpacing/2+","+graphHeight+")").call(xAxis).selectAll('text').attr("transform", "rotate(90)").attr('y',-2).attr('x', 16)
    svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate("+paddingLeft+",0)").call(yAxis)

    var rects = bars.append('rect')
      .attr('x', (data, _) => {
        return xScale(new Date(data['date'])) - (newWidth/numDays - barSpacing)/2; 
      }).attr('y', (data, _) => {
        return yScale(data['count'])
      }).attr('height', (data, _) => {
        return 130 - yScale(data['count'])
      }).attr('width', (newWidth / numDays) - barSpacing)
      .style('fill','rgb(94, 204, 123)')


    rects.on("mouseover", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(53, 150, 78)')
      var date = new Date(d['date']).toDateString().split(' ')
      var text = d3.select("#covid-deaths-text-2")
      text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['count']+ " new deaths").style("visibility", "visible")
    });
    rects.on("mouseout", function(_){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(94, 204, 123)');
      svg.selectAll('#countLabel').remove()
      var text = d3.select("#covid-deaths-text-2")
      text.style("visibility", "hidden")
    });

    var rolling_average_14 = []
    var rolling_average_7 = []
    d3.csv('data/filtered_rolling_average_negative_fraction.csv', function(d) {
      if (d['rolling_average_14'] != 0) {
        rolling_average_14.push({'date': d['date'], 'rolling_average_14': d['rolling_average_14']})
      }
    }).then(_ => {
      var max = d3.max(rolling_average_14, function(d){ return +d['rolling_average_14'] })
      var min = d3.min(rolling_average_14, function(d) { return +d['rolling_average_14']})
      var yscale2 = d3.scaleLinear().domain([max, min]).range([1, 130]);
      var yAxisRight = d3.axisRight().scale(yscale2).ticks(5); 
      var svgAxisRight = svg.append("g")
      .attr('class','axis')	
      .style("font", "3px times")
      .attr("transform", "translate(" + 183 + " ,0)")	
      .call(yAxisRight)
      svgAxisRight.selectAll('path').style('stroke', '#0980A0')
      svgAxisRight.selectAll('line').style('stroke', '#0980A0')
      
      svg.append("path")
      .datum(rolling_average_14)
      .attr("fill", "none")
      .attr("stroke", "#0980A0")
      .attr("stroke-width", 1) 
      .attr("d", d3.line()
        .x(function(d) { return xScale(new Date(d['date'])) })
        .y(function(d) { return yscale2(d['rolling_average_14'])
       }).curve(d3.curveMonotoneX)
      )
    })

    d3.csv('data/filtered_rolling_average_negative_fraction.csv', function(d) {
      if (d['rolling_average_7'] != 0) {
        rolling_average_7.push({'date': d['date'], 'rolling_average_7': d['rolling_average_7']})
      }
    }).then(_ => {
      var max = d3.max(rolling_average_7, function(d){ return +d['rolling_average_7'] })
      var min = d3.min(rolling_average_7, function(d) { return +d['rolling_average_7']})
      var yscale2 = d3.scaleLinear().domain([max, min]).range([1, 130]);
      var yAxisRight = d3.axisRight().scale(yscale2).ticks(5); 
      var svgAxisRight = svg.append("g")
      .attr('class','axis')	
      .style("font", "3px times")
      .attr("transform", "translate(" + 183 + " ,0)")	
      .call(yAxisRight)
      svgAxisRight.selectAll('path').style('stroke', '#0980A0')
      svgAxisRight.selectAll('line').style('stroke', '#0980A0')
      
      svg.append("path")
      .datum(rolling_average_7)
      .attr("fill", "none")
      .attr("stroke", "#C47208")
      .attr("stroke-width", 1) 
      .attr("d", d3.line()
        .x(function(d) { return xScale(new Date(d['date'])) })
        .y(function(d) { return yscale2(d['rolling_average_7'])
       }).curve(d3.curveMonotoneX)
      )
    })
    svg.append("circle").attr("cx",30).attr("cy",165).attr("r", 2).style("fill", "#5ECC7B")
    svg.append("circle").attr("cx",30).attr("cy",170).attr("r", 2).style("fill", "#0980A0")
    svg.append("circle").attr("cx",30).attr("cy",175).attr("r", 2).style("fill", "#C47208")

    svg.append("text").attr("x", 35).attr("y", 165).text("Covid-19 deaths").style("font-size", "5px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 35).attr("y", 170).text("Rolling average of negative sentiment fraction (14-day window)").style("font-size", "5px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 35).attr("y", 175).text("Rolling average of negative sentiment fraction (7-day window)").style("font-size", "5px").attr("alignment-baseline","middle")

  })
}


function createDeathSentGraph2(containerId) {
  covid_deaths   = {}
  var newWidth = graphWidth - 6
  var svg = d3.select(containerId).append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
  d3.csv('data/COVID19BE_MORT.csv', function(d) {
    if (d['DATE'] in covid_deaths)
      covid_deaths[d['DATE']] = { date: d['DATE'], count: covid_deaths[d['DATE']]['count'] + parseInt(d['DEATHS'], 0) }
    else
      covid_deaths[d['DATE']] = { date: d['DATE'], count: parseInt(d['DEATHS'], 0) }
  }).then(_ => {
    delete covid_deaths['NA']
    covid_deaths_filtered = Object.values(covid_deaths)

    var barSpacing = 0.5
    var bars = svg.selectAll('rect').data(covid_deaths_filtered).enter();
    var numDays = covid_deaths_filtered.length;
    var max = d3.max(covid_deaths_filtered, function(d){ return +d['count'] })
    var yScale = d3.scaleLinear().domain([max, 0]).range([0, 130]);
    var domain = d3.extent(covid_deaths_filtered, function(d) {
      return new Date(d['date'])
    })
    domain[0] = domain[0].setDate(domain[0].getDate() - 1)
    domain[1] = domain[1].setDate(domain[1].getDate() + 1)
    var xScale = d3.scaleTime().domain(domain).range([paddingLeft + (newWidth/numDays - barSpacing)/2, newWidth+paddingLeft - (newWidth/numDays - barSpacing)/2]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(17).tickSize(4);
    var yAxis = d3.axisLeft().scale(yScale).ticks(10);
    
    svg.append('g').attr('class','axis').attr("transform", "translate(-"+barSpacing/2+","+graphHeight+")").call(xAxis).selectAll('text').attr("transform", "rotate(90)").attr('y',-2).attr('x', 16)
    svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate("+paddingLeft+",0)").call(yAxis)

    var rects = bars.append('rect')
      .attr('x', (data, _) => {
        return xScale(new Date(data['date'])) - (newWidth/numDays - barSpacing)/2; 
      }).attr('y', (data, _) => {
        return yScale(data['count'])
      }).attr('height', (data, _) => {
        return 130 - yScale(data['count'])
      }).attr('width', (newWidth / numDays) - barSpacing)
      .style('fill','rgb(94, 204, 123)')


    rects.on("mouseover", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(53, 150, 78)')
      var date = new Date(d['date']).toDateString().split(' ')
      var text = d3.select("#covid-deaths-text-2")
      text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['count']+ " new deaths").style("visibility", "visible")
    });
    rects.on("mouseout", function(_){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(94, 204, 123)');
      svg.selectAll('#countLabel').remove()
      var text = d3.select("#covid-deaths-text-3")
      text.style("visibility", "hidden")
    });

    var squared_deviation = []
    d3.csv('data/filtered_rolling_average_squared_deviation.csv', function(d) {
      if (d['signed_squared_deviation'] != 0) {
        squared_deviation.push({'date': d['date'], 'squared_deviation': d['signed_squared_deviation']})
      }
    }).then(_ => {
      var max = d3.max(squared_deviation, function(d){ return +d['squared_deviation'] })
      var min = d3.min(squared_deviation, function(d) { return +d['squared_deviation']})
      var yscale2 = d3.scaleLinear().domain([max, min]).range([1, 130]);
      var yAxisRight = d3.axisRight().scale(yscale2).ticks(5); 
      var svgAxisRight = svg.append("g")
      .attr('class','axis')	
      .style("font", "3px times")
      .attr("transform", "translate(" + 183 + " ,0)")	
      .call(yAxisRight)
      svgAxisRight.selectAll('path').style('stroke', '#0980A0')
      svgAxisRight.selectAll('line').style('stroke', '#0980A0')
      
      svg.append("path")
      .datum(squared_deviation)
      .attr("fill", "none")
      .attr("stroke", "#0980A0")
      .attr("stroke-width", 1) 
      .attr("d", d3.line()
        .x(function(d) { return xScale(new Date(d['date'])) })
        .y(function(d) { return yscale2(d['squared_deviation'])
       }).curve(d3.curveMonotoneX)
      )
    })

    svg.append("circle").attr("cx",30).attr("cy",165).attr("r", 2).style("fill", "#5ECC7B")
    svg.append("circle").attr("cx",30).attr("cy",170).attr("r", 2).style("fill", "#0980A0")

    svg.append("text").attr("x", 35).attr("y", 165).text("Covid-19 deaths").style("font-size", "5px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 35).attr("y", 170).text("Rolling avergage of signed square deviation (14-day window)").style("font-size", "5px").attr("alignment-baseline","middle")
  
  })
}

/**
 * Loads the tweet location data and displays it on a leaflet map
 * @param {string} mapName The id of the map div element
 */
function createLocationMap(mapName) {
  
  // Set center to Brussels and zoom level to 7
  // Use OpenStreetMap tiles
  var map = L.map(mapName).setView([50.8549541, 4.3053504], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Timeout to notify leaflet the map size has changed, otherwise only a part of the map is visible
    setTimeout(function(){ map.invalidateSize()
      // Load the tweet locations and add circle on the map for every location
      d3.csv('data/tweet_locations.csv', function(d) {
        L.circle([d['location_lat'], d['location_lon']], {
          color: '#3399ff',
          radius: 10
        }).addTo(map);
      })
    }, 400);
}

function showMostPopular(divId) {
  var container = d3.select(divId)
  d3.csv('../data/most_popular_tweets.csv', function (tweet) {
    tweetEl = container.append('div')
    .attr('class', 'alert alert-primary')
    .attr('role', 'primary')
    
    tweetEl.append('p').append('q').text(tweet['text']).style("font", "12px times")
    tweetEl.append('hr')
    var p = tweetEl.append('p').style("font-size", "12px")
    p.append('i').attr('class', 'fas fa-heart').text(' '+tweet['favorite_count']).style('margin-right','5px')
    p.append('i').attr('class', 'fas fa-retweet').text(' '+tweet['retweet_count']).style('margin-right','5px')
    p.append('i').attr('class', 'fas fa-reply').text(' '+tweet['reply_count']).style('margin-right','5px')
  })
}