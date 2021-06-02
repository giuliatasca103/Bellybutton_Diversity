function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

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
    var buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var current_sample=buildingArray[0] // how to get current_sample to be only for "941"
          // array.filter => returns an array so you can have to use [0] to get first element

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = current_sample.otu_ids;
    var otu_labelos = result.otu_labels;
    var sample_values = result.sample_values;

    var wFreq = data.metadata.filter(f => f.sample.toString() === sample)[0];
    wfreq = wreq.wreq;
    console.log("Washing Freq: " + wreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.slice(0, 10).map(otuID => 'OTU &{otuID}').reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labelos.slice(0, 10).reverse(),
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
                 {range: [0, 1], color: "white"},
                 {range: [1, 2], color: "white"},
                 {range: [2, 3], color: "white"},
                 {range: [3, 4], color: "white"},
                 {range: [4, 5], color: "white"},
                 {range: [5, 6], color: "white"},
                 {range: [6, 7], color: "white"},
                 {range: [7, 8], color: "white"},
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
