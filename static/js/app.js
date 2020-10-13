// d3.json("samples.json").then((data => {
//     console.log(data)
// }))

// Build a function to pull the meta data from samples.json and display the selected ID data on the display box 
function PullSampledata(sample) {
  // Pull in data from samples.json
  d3.json("samples.json").then((data) => {
    // grab the deomgraphic data tied to IDs - metadata
    let metadata = data.metadata;
    // Filter the data for the specific ID 
    let results = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = results[0];
    // Use d3 to select the display panel (#sample-metadata) for the specific sample number
    let display = d3.select("#sample-metadata");
    // clear any existing metadata
    display.html("");
    // add each key and value pair to the display box
    Object.entries(result).forEach(([key, value]) => {
      display.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Build a function for the charts
function chartBuilder(sample) {
  // Pull in data from samples.json  
  d3.json("samples.json").then((data) => {
    // Grab the UTO data - samples 
    let samples = data.samples;
    // Filter data object and pull ids, labels, and values
    let results = samples.filter(sampleObj => sampleObj.id == sample);
    let result = results[0];
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a bar chart of top 10 Bacteria Cultures found
    // use slice (0,10) to grab top 10 and .reverse to order decending
    let y = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
    {
      y: y,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      marker: {
        color: otu_ids,
        colorscale: 'Portland'},
      type: "bar",
      orientation: "h"
    }
  ];
    // Bar graph layout
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 },

  };
    // call plotly to make the bar chart
    Plotly.newPlot("bar", barData, barLayout);


    // Build a Bubble Chart for the Bacteria Cultures for selected sample
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Jet"
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Build a fucntion (initial function) to populate page with default sample id and populate drop down selection
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
    chartBuilder(firstSample);
    PullSampledata(firstSample);
  });
}

// Build a function to update plots on a sample ID change
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  chartBuilder(newSample);
  PullSampledata(newSample);
}

// Set up the dashboard
init();

