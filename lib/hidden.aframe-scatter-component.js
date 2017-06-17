AFRAME.registerComponent('graph', {
  schema: {
    csv: {
      type: 'string'
    },
    id: {
      type: 'int',
      default: '0'
    },
    width: {
      type: 'number',
      default: 1
    },
    height: {
      type: 'number',
      default: 1
    },
    depth: {
      type: 'number',
      default: 1
    }
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  update: function () {
    // Entity data
    var el = this.el;
    var object3D = el.object3D;
    var data = this.data;

    var width = data.width;
    var height = data.height;
    var depth = data.depth;

    // These will be used to set the range of the axes' scales
    var xRange = [0, width];
    var yRange = [0, height];
    var zRange = [0, -depth];

    /**
     * Create origin point.
     * This gives a solid reference point for scaling data.
     * It is positioned at the vertex of the left grid and bottom grid (towards the front).
     */
    var originPointPosition = (-width / 2) + ' 0 ' + (depth / 2);
    var originPointID = 'originPoint' + data.id;

    d3.select(el).append('a-entity')
                 .attr('id', originPointID)
                 .attr('position', originPointPosition);

    // Create graphing area out of three textured planes
    var grid = gridMaker(width, height, depth);
    object3D.add(grid);

    // Label axes
    var xLabelPosition = '-0.06'+ ' ' + '-0.5' + ' ' + '0';
    d3.select('#' + originPointID)
      .append('a-entity')
      .attr('id', 'x')
      .attr('bmfont-text', 'text: Will give max compensation ?')
      .attr('bmfont-color', 'color:red')
      .attr('position', xLabelPosition);
      
      xLabelPosition = '-0.06'+ ' ' + '-0.2' + ' ' + '0';
      d3.select('#' + originPointID)
      .append('a-entity')
      .attr('id', 'x')
      .attr('bmfont-text', 'text:0  1  2  3  4  5  6  7  8  9  ')
      .attr('position', xLabelPosition);
      

    var yLabelPosition = (width + 0.3) + ' ' + (height / 2.2) + ' ' + (-depth);
      
    d3.select('#' + originPointID)
      .append('a-entity')
      .attr('id', 'y')
      .attr('bmfont-text', 'text: Prefer to work again ?')
      .attr('position', yLabelPosition);
      
      yLabelPosition = 0 + ' ' + -0.1 + ' ' + .10;

       d3.select('#' + originPointID)
      .append('a-entity')
      .attr('id', 'x')
      .attr('bmfont-text', 'text:0  1  2  3  4  5  6  7  8  9  ')
      .attr('position', yLabelPosition)
      .attr('rotation', '0 90 90');
      
      yLabelPosition = (width + 0.2) + ' ' + 0 + ' '  + (-depth);

       d3.select('#' + originPointID)
      .append('a-entity')
      .attr('id', 'x')
      .attr('bmfont-text', 'text:0  1  2  3  4  5  6  7  8  9  ')
      .attr('position', yLabelPosition)
      .attr('rotation', '0 0 90');
      
      
      
    var zLabelPosition = (width + 0.02) + ' ' + '-0.05' + ' ' + (-depth / 2);
    d3.select('#' + originPointID)
      .append('a-entity')
      .attr('id', 'z')
      .attr('bmfont-text', 'text: Total FIs (cm)')
      .attr('position', zLabelPosition);
      
      zLabelPosition = (width) + ' ' + '-0.2' + ' ' + '0.05';
       d3.select('#' + originPointID)
      .append('a-entity')
      .attr('id', 'x')
      .attr('bmfont-text', 'text:0  1  2  3  4  5  6  7  8  9  ')
      .attr('position', zLabelPosition)
      .attr('rotation', '0 90 0');
      

    if (data.csv) {
      /* Plot data from CSV */



      var originPoint = d3.select('#originPoint' + data.id);

      // Needed to assign species a color
      var cScale = d3.scale.ordinal()
      										 .domain(["BTA", "Manager", "Consultant"])
      										 .range(["green", "blue", "red"]);

       //Convert CSV data from string to number
      d3.csv(data.csv, function (data) {
      	data.forEach(function (d) {
      	  d.color = cScale(d.Species)
      	});
           console.log(data);
        plotData(data);
      });

        d3.json("iris.json", function(error, data) {
                console.log(data);
            });


      var plotData = function (data) {
        // Scale x, y, and z values
        var xExtent = d3.extent(data, function (d) {console.log("logx "+d.compensation); return d.compensation; });
        var xScale = d3.scale.linear()
                       .domain([0,10])
                       .range([xRange[0], xRange[1]])
                       .clamp('true');

        var yExtent = d3.extent(data, function (d) { console.log("logy "+d.willWork);return d.willWork; });
        var yScale = d3.scale.linear()
                       .domain([0,10])
                       .range([yRange[0], yRange[1]]);

        var zExtent = d3.extent(data, function (d) {console.log("logz "+d.totalFI); return d.totalFI; });
        var zScale = d3.scale.linear()
                       .domain([0,10])
                       .range([zRange[0], zRange[1]]);
        var wScale = d3.scale.linear()
                       .domain([0,1])
                       .range([0, 20]);
          console.log(wScale(10));
          console.log(xExtent);
          console.log(yExtent);
          console.log(zExtent);

          console.log(xRange[0],xRange[1],yRange[0],yRange[1]);
          console.log(xScale(5) + ' ' + yScale(5) + ' ' + zScale(5));

        // Append data to graph and attach event listeners
        originPoint.selectAll('a-sphere')
                   .data(data)
                   .enter()
                   .append('a-sphere')
                   .attr('radius', function(d){
                       var r =  d.PetalWidth/100000 >0.05 ? d.PetalWidth/10000 : 0.05;            
                        return r;
                    })
                   .attr('color', function(d) {
                     return d.color;
                   })
                   .attr('position', function (d) {
                     //console.log(xScale(d.compensation) + ' ' + yScale(d.willWork) + ' ' + zScale(d.totalFI));
                     return xScale(d.compensation) + ' ' + yScale(d.willWork) + ' ' + zScale(d.totalFI);
                   })
                   .on('mouseenter', mouseEnter);

        /**
         * Event listener adds and removes data labels.
         * "this" refers to sphere element of a given data point.
         */
        function mouseEnter () {
        	// Get data
        	var data = this.__data__;
            console.log(data)

          // Get width of graphBox (needed to set label position)
          var graphBoxEl = this.parentElement.parentElement;
          var graphBoxData = graphBoxEl.components.graph.data;
          var graphBoxWidth = graphBoxData.width;

          // Look for an existing label
          var oldLabel = d3.select('#tempDataLabel');
          var oldLabelParent = oldLabel.select(function () { return this.parentNode; });

          // Look for an existing beam
          var oldBeam = d3.select('#tempDataBeam');
          
      	// Look for an existing background
        var oldBackground = d3.select('#tempDataBackground');

          // If there is no existing label, make one
          if (oldLabel[0][0] === null) {
            labelMaker(this, graphBoxWidth);
          } else {
            // Remove old label
            oldLabel.remove();
            // Remove beam
            oldBeam.remove();
            // Remove background
	          oldBackground.remove();
            // Create new label
            labelMaker(this, graphBoxWidth);
          }
        }
      };



    }
  }
});

/* HELPER FUNCTIONS */

/**
 * planeMaker() creates a plane given width and height (kind of).
 *  It is used by gridMaker().
 */
function planeMaker (horizontal, vertical) {
  // Controls texture repeat for U and V
  var uHorizontal = horizontal * 4;
  var vVertical = vertical * 4;

  // Load a texture, set wrap mode to repeat
  var texture = new THREE.TextureLoader().load('img/grid_transparent.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.repeat.set(uHorizontal, vVertical);

  // Create material and geometry
  var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 0.9, side: THREE.DoubleSide});
  var geometry = new THREE.PlaneGeometry(horizontal, vertical);

  return new THREE.Mesh(geometry, material);
}

/**
 * gridMaker() creates a graphing box given width, height, and depth.
 * The textures are also scaled to these dimensions.
 *
 * There are many ways this function could be improved or done differently
 * e.g. buffer geometry, merge geometry, better reuse of material/geometry.
 */
function gridMaker (width, height, depth) {
  var grid = new THREE.Object3D();

  // AKA bottom grid
  var xGrid = planeMaker(width, depth);
  xGrid.rotation.x = 90 * (Math.PI / 180);
  grid.add(xGrid);

  // AKA far grid
  var yPlane = planeMaker(width, height);
  yPlane.position.y = (0.5) * height;
  yPlane.position.z = (-0.5) * depth;
  grid.add(yPlane);

  // AKA side grid
  var zPlane = planeMaker(depth, height);
  zPlane.position.x = (-0.5) * width;
  zPlane.position.y = (0.5) * height;
  zPlane.rotation.y = 90 * (Math.PI / 180);
  grid.add(zPlane);

  return grid;
}

/**
 * labelMaker() creates a label for a given data point and graph height.
 * dataEl - A data point's element.
 * graphBoxWidth - The width of the graph.
 */
function labelMaker (dataEl, graphBoxWidth) {
  var dataElement = d3.select(dataEl);
  // Retrieve original data
  var dataValues = dataEl.__data__;

  // Create individual x, y, and z labels using original data values
  // round to 1 decimal space (should use d3 format for consistency later)
  var name = 'Name : ' + dataValues.name + '\n\n';     
  var sepalLength = 'Max compensation : ' + dataValues.compensation + '\n \n';
  var petalLength = 'Work again : ' + dataValues.willWork + '\n \n';
  var sepalWidth = 'Total FIs : ' + dataValues.totalFI;
    
  var labelText = 'text: '+ name + sepalLength + petalLength + sepalWidth;

  // Position label right of graph
  var padding = 0.2;
  var sphereXPosition = dataEl.getAttribute('position').x;
  var labelXPosition = (graphBoxWidth + padding) - sphereXPosition;
  var labelPosition = labelXPosition + ' -0.43 0';

  // Add pointer
  var beamWidth = labelXPosition;
  // The beam's pivot is in the center
  var beamPosition = (labelXPosition - (beamWidth / 2)) + '0 0';
  dataElement.append('a-box')
             .attr('id', 'tempDataBeam')
             .attr('height', '0.01')
             .attr('width', beamWidth)
             .attr('depth', '0.01')
             .attr('color', 'purple')
             .attr('position', beamPosition);
    

  // Add label
  dataElement.append('a-entity')
             .attr('id', 'tempDataLabel')
             .attr('bmfont-text', labelText)
             .attr('position', labelPosition);
  
	var backgroundPosition = (labelXPosition + 1.1) + ' 0.01 -0.1';
  // Add background card
  dataElement.append('a-plane')
  					 .attr('id', 'tempDataBackground')
  					 .attr('width', '2.3')
  					 .attr('height', '1.8')
  					 .attr('color', '#ECECEC')
  					 .attr('position', backgroundPosition);
}
