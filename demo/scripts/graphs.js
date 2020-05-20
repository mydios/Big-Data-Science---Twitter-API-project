function createTweetCountGraph(container_bars, container_lines) {
  d3.csv('../data/tweets_per_day.csv').then(function(data){
    var svg = container_bars.append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
    var svg2 = container_lines.append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
    var bars = svg.selectAll('rect').data(data).enter();
    var numDays = data.length;
    var max = d3.max(data, function(d){ return +d['counts'] })
    var yScale = d3.scaleLinear().domain([max, 0]).range([0, 130]);
    var xScale = d3.scaleTime().domain(d3.extent(data, function(d) {
      return new Date(d['date'])
    })).range([20, 190]);
    
    var xAxis = d3.axisBottom().scale(xScale).ticks(14);
    var yAxis = d3.axisLeft().scale(yScale).ticks(20);
    svg.append('g').attr('class','axis').attr("transform", "translate(0,150)").call(xAxis).selectAll('text').attr('y',0).attr('x', 15).attr("transform", "rotate(90)")
    svg.append('g').attr('class','axis').style("font", "5px times").attr("transform", "translate(18,20)").call(yAxis)
    
    svg2.append('g').attr('class','axis').attr("transform", "translate(0,150)").call(xAxis).selectAll('text').attr('y',0).attr('x', 15).attr("transform", "rotate(90)")
    svg2.append('g').attr('class','axis').style("font", "5px times").attr("transform", "translate(18,20)").call(yAxis)

    svg2.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "rgb(94, 204, 123)")
    .attr("stroke-width", 1)
    .attr("d", d3.line()
      .x(function(d, i) { return xScale(new Date(d['date'])) })
      .y(function(d) { return yScale(d['counts']) + 20
     }).curve(d3.curveMonotoneX)
    )

    var rects = bars.append('rect')
      .attr('x', (data, i) => {
      return xScale(new Date(data['date']));
    }).attr('y', (data, i) => {
      return yScale(data['counts'])+20
    }).attr('height', (data, i) => {
      return 130 - yScale(data['counts'])
    }).attr('width', (180 / numDays)-1)
    .style('fill','rgb(94, 204, 123)');
          
    rects.on("mouseover", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(53, 150, 78)')
      var date = new Date(d['date']).toDateString().split(' ')
      var text = d3.select("#tweet-text")
      text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['counts']+ " new cases").style("visibility", "visible")
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


function createKeywordGraph(container) {
    keywords = []
    d3.csv('../data/keyword_count.csv').then(function(data){
        data.sort(function(x, y) {
        return y['count'] - x['count']
      })
      data.forEach(d => {
        keywords.push(d['keyword']);
      });

      var svg = container.append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
      var bars = svg.selectAll('rect').data(data).enter();
      var max = d3.max(data, function(d){ return +d['count'] })
      var yScale = d3.scaleLinear().domain([max, 0]).range([0, 130]);
      var xScale = d3.scaleBand().domain(keywords).range([20, 190]);
      var yAxis = d3.axisLeft().scale(yScale).ticks(10);
      var xAxis = d3.axisBottom().scale(xScale)
      svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(-1,150)").call(xAxis).selectAll('text').attr('y',5).attr('x', 10).attr("transform", "rotate(45)").style("font", '4px sans-serif')

      svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(19,20)").call(yAxis)
    
      bars.append('rect')
        .attr('x', (data, i) => {
        return xScale(data['keyword']); 
      }).attr('y', (data, i) => {
        return yScale(data['count'])+20
      }).attr('height', (data, i) => {
        return 130 - yScale(data['count'])
      }).attr('width', (180 / data.length)-5)
      .style('fill','rgb(94, 204, 123)')
      
      data.forEach(data => {
        svg.append('text')
        .text(data['count'])
        .attr('x', xScale(data['keyword']))
        .attr('y', yScale(data['count']) + 18)
        .style("font", '8px sans-serif')
      })
    })
}

function createInfectionsGraph(container) {    
    covid = {}
    d3.csv('data/COVID19BE_CASES_AGESEX.csv', function(d) {
      if (d['DATE'] in covid)
        covid[d['DATE']] = { date: d['DATE'], count: covid[d['DATE']]['count'] + parseInt(d['CASES'], 0) }
      else
        covid[d['DATE']] = { date: d['DATE'], count: parseInt(d['CASES'], 0) }
    }).then(_ => {
      delete covid['NA']
      covid_data = Object.values(covid)

      var svg = container.append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
      var bars = svg.selectAll('rect').data(covid_data).enter();
      var numDays = covid_data.length;
      var max = d3.max(covid_data, function(d){ return +d['count'] })
      var yScale = d3.scaleLinear().domain([max, 0]).range([0, 130]);
      var xScale = d3.scaleTime().domain(d3.extent(covid_data, function(d) {
        return new Date(d['date'])
      })).range([20, 190]);
      
      var xAxis = d3.axisBottom().scale(xScale).ticks(14);
      var yAxis = d3.axisLeft().scale(yScale).ticks(10);
      
      svg.append('g').attr('class','axis').attr("transform", "translate(0,150)").call(xAxis).selectAll('text').attr('y',0).attr('x', 15).attr("transform", "rotate(90)")
      svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(19,20)").call(yAxis)

      var rects = bars.append('rect')
        .attr('x', (data, i) => {
        return xScale(new Date(data['date'])); 
      }).attr('y', (data, i) => {
        return yScale(data['count']) + 20
      }).attr('height', (data, i) => {
        return 130 - yScale(data['count'])
      }).attr('width', (180 / numDays) - 0.5)
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

function createDeathsGraph(container) {
  covid_deaths   = {}
  d3.csv('data/COVID19BE_MORT.csv', function(d) {
    if (d['DATE'] in covid_deaths)
      covid_deaths[d['DATE']] = { date: d['DATE'], count: covid_deaths[d['DATE']]['count'] + parseInt(d['DEATHS'], 0) }
    else
      covid_deaths[d['DATE']] = { date: d['DATE'], count: parseInt(d['DEATHS'], 0) }
  }).then(_ => {
    delete covid_deaths['NA']
    covid_deaths_filtered = Object.values(covid_deaths)

    var svg = container.append('svg').attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 200 200").classed("svg-content", true);
    var bars = svg.selectAll('rect').data(covid_deaths_filtered).enter();
    var numDays = covid_deaths_filtered.length;
    var max = d3.max(covid_deaths_filtered, function(d){ return +d['count'] })
    var yScale = d3.scaleLinear().domain([max, 0]).range([0, 130]);
    var xScale = d3.scaleTime().domain(d3.extent(covid_deaths_filtered, function(d) {
      return new Date(d['date'])
    })).range([200/numDays/2 + 18, 200 - 200/numDays/2]);
    
    var xAxis = d3.axisBottom().scale(xScale).ticks(17).tickSize(4);
    var yAxis = d3.axisLeft().scale(yScale).ticks(10);
    
    svg.append('g').attr('class','axis').attr("transform", "translate(0,130)").call(xAxis).selectAll('text').attr("transform", "rotate(90)").attr('y',-2).attr('x', 16)
    svg.append('g').attr('class','axis').style("font", "4px times").attr("transform", "translate(18,0)").call(yAxis)

    var rects = bars.append('rect')
      .attr('x', (data, i) => {
      return xScale(new Date(data['date'])); 
    }).attr('y', (data, i) => {
      return yScale(data['count'])
    }).attr('height', (data, i) => {
      return 130 - yScale(data['count'])
    }).attr('width', (190 / numDays) - 0.5)
    .style('fill','rgb(94, 204, 123)')


    rects.on("mouseover", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(53, 150, 78)')
      var date = new Date(d['date']).toDateString().split(' ')
      var text = d3.select("#covid-deaths-text")
      text.text(date[0]+' '+date[2]+' '+date[1]+": "+d['count']+ " new deaths").style("visibility", "visible")
    });
    rects.on("mouseout", function(d){
      var currentBar = d3.select(this);
      currentBar.style('fill','rgb(94, 204, 123)');
      svg.selectAll('#countLabel').remove()
      var text = d3.select("#covid-deaths-text")
      text.style("visibility", "hidden")
    });

  })
}

function createLocationMap(mapName) {
  var map = L.map(mapName).setView([50.8549541, 4.3053504], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Timeout to notify leaflet the map size has changed
    setTimeout(function(){ map.invalidateSize()
      d3.csv('data/tweet_locations.csv', function(d) {
        L.circle([d['location_lat'], d['location_lon']], {
          color: '#3399ff',
          radius: 10
        }).addTo(map);
      })
    }, 400);
}