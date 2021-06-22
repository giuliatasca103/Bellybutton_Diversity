// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panelData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) { // sample is going to come through as a string so like "940" or "941"
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var current_sample=resultArray[0] // how to get current_sample to be only for "941"
          // array.filter => returns an array so you can have to use [0] to get first element

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = current_sample.otu_ids;
    var otu_labels = current_sample.otu_labels;
    var sample_values = current_sample.sample_values;

    var wFreq = data.metadata.filter(f => f.id == sample);
      wfreq = wFreq[0].wfreq;
      console.log("Washing Freq: " + wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h", 
      } 
     ];
    // 9. Create the layout for the bar chart. 
    var barLayout = { 
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150}
    };
     
    // };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // build bubble chart
    // Deliverable 2

    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: {text: 'Belly Button Washing Frequency'},
        type: "indicator",

        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] },
              steps: [
              {range: [0, 1], color: "red"},
              {range: [1, 2], color: "orange"},
              {range: [2, 3], color: "yellow"},
              {range: [3, 4], color: "green"},
              {range: [4, 5], color: "blue"},
              {range: [5, 6], color: "white"},
              {range: [6, 7], color: "black"},
              {range: [7, 8], color: "grey"},
              {range: [8, 9], color: "white"}
                ]}
      }
    ];

    var gaugeLayout = {
      width: 700,
      height: 600,
      margin: { t: 20, b: 40, l:100, r:100 }
     };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selectorDropdown = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selectorDropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
};

// Initialize the dashboard
init()


// Bar Chart:
// line 49:  var yticks = otu_ids.slice(0, 10).map(otuID => 'OTU &{otuID}').reverse(); // use backticks, not single ticks and a $ in place of &:  `OTU ${otuID}`

// Guage:
// Change 41-43 from:
//     var wFreq = data.metadata.filter(f => f.currentSample.toString() === currentSample)[0];
//     wfreq = wreq.wreq;
//     console.log("Washing Freq: " + wreq);
// to:
//     var wFreq = data.metadata.filter(f => f.id == sample);
//     wfreq = wFreq[0].wfreq;
//     console.log("Washing Freq: " + wfreq);

// The '===' tripped you up.  That is a strict equals, which means the data type must match!

// Don't forget to uncomment the gauge id in your index.htmal file!

// Aside from those minor code changes, all you need to do is some modifications, for instance background color for the index page, etc.