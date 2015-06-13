//create 3D object
//points : [p1, p2, p3, ...]  p1 = [x, y, z]
//center_point : [x, y]
//connection : [[p1, p2], [p1, p3], ...]
function CanvasThreeD(points, center_point, connection) {
    this.points = points;
    this.center_point = center_point;
    this.connection = connection;
    this.box = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
}

//--Start Calculation Zone--

//calculate box according to rotationX
CanvasThreeD.prototype.set_x_rotate = function (angle) {
    var rad = angle / 180 * Math.PI;
    var box2 = [
        [1, 0, 0, 0],
        [0, Math.cos(rad), -Math.sin(rad), 0],
        [0, Math.sin(rad), Math.cos(rad), 0],
        [0, 0, 0, 1]
    ];
    this.connect(box2);
}

//calculate box according to rotationY
CanvasThreeD.prototype.set_y_rotate = function (angle) {
    var rad = angle / 180 * Math.PI;
    var box2 = [
        [Math.cos(rad), 0, Math.sin(rad), 0],
        [0, 1, 0, 0],
        [-Math.sin(rad), 0, Math.cos(rad), 0],
        [0, 0, 0, 1]
    ];
    this.connect(box2);
}

//calculate box according to rotationZ
CanvasThreeD.prototype.set_z_rotate = function (angle) {
    var rad = angle / 180 * Math.PI;
    var box2 = [
        [Math.cos(rad), -Math.sin(rad), 0, 0],
        [Math.sin(rad), Math.cos(rad), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    this.connect(box2);
}

//calculate box acording to translation
CanvasThreeD.prototype.set_translate = function (x, y, z) {
    var box2 = [
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]
    ];
    this.connect(box2);
}

//calculate scale according to scale
CanvasThreeD.prototype.set_scale = function (x, y, z) {
    var box2 = [
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1]
    ];
    this.connect(box2);
}

//calculate box * box
CanvasThreeD.prototype.connect = function (box2) {
    if (this.box.length != box2[0].length) return; //Error

    //copy this.box to box1
    var box1 = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    for (var i = 0; i < this.box.length; ++i) {
        for (var n = 0; n < this.box[0].length; ++n) {
            box1[i][n] = this.box[i][n];
        }
    }

    //calculate box2 * box1
    for (var i = 0; i < box1[0].length; ++i) {
        for (var j = 0; j < box2.length; ++j) {
            var val = 0;
            for (var k = 0; k < box1.length; ++k) {
                val += box1[k][i] * box2[j][k];
                if (k == box1.length - 1) this.box[j][i] = val;
            }
        }
    }
}

//translate vec3 according to this.box
//vec3 = [x, y, z]
CanvasThreeD.prototype.mapping = function (vec3) {
    var mapping_x = 0,
        mapping_y = 0,
        mapping_z = 0;
    for (var i = 0; i < 3; ++i) {
        mapping_x += vec3[i] * this.box[0][i];
        mapping_y += vec3[i] * this.box[1][i];
        mapping_z += vec3[i] * this.box[2][i];
    }
    mapping_x += this.box[0][3];
    mapping_y += this.box[1][3];
    mapping_z += this.box[2][3];
    return [mapping_x, mapping_y, mapping_z];
}

//initialize this.box
CanvasThreeD.prototype.initialize_box = function () {
    this.box = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
     ];
}

//translate center_point
//vec2 = [x, y]
CanvasThreeD.prototype.translate_center_point = function (vec2) {
    var new_x = this.center_point[0] + vec2[0];
    var new_y = this.center_point[1] + vec2[1];
    this.center_point = [new_x, new_y];
}

//--End Calculation Zone--
//--Start Drawing Zone--

//drawing 3d Object on Canvas
//display : canvas, background_color : 'rgb(255, 255, 255)', fov : degree
CanvasThreeD.prototype.drawing = function (display, camera_position, fov) {
    var ctx = display.getContext("2d");
    var canvas_width = display.width;

    //create 2d points from 3d points
    var viewing_distance = calculate_viewing_distance(fov, canvas_width);
    var mapped_points = [];
    for (var i = 0; i < this.points.length; ++i) {
        this.points[i] = this.mapping(this.points[i]);
        var camera_view = [
          this.points[i][0] - camera_position[0],
          this.points[i][1] - camera_position[1],
          this.points[i][2] - camera_position[2]
        ];
        var mapped_point = perspective_project(camera_view, viewing_distance);
        mapped_points.push(mapped_point);
    }

    //drawing canvas according to this.connection
    for (var i = 0; i < this.connection.length; ++i) {
        var before_point = mapped_points[this.connection[i][0]];
        var after_point = mapped_points[this.connection[i][1]];
        ctx.beginPath();
        ctx.moveTo(before_point[0] + this.center_point[0], before_point[1] + this.center_point[1]);
        ctx.lineTo(after_point[0] + this.center_point[0], after_point[1] + this.center_point[1]);
        ctx.closePath();
        ctx.stroke();
    }
}

//draw shpere
//display : canvas, rad : radious, rough
CanvasThreeD.prototype.drawSphere = function (display, camera_position, fov, rad, rough, start_position) {
    var ctx = display.getContext("2d");
    var canvas_width = display.width;

    //calculate center point of shpere
    var viewing_distance = calculate_viewing_distance(fov, canvas_width);
    this.points[0] = this.mapping(this.points[0]);
    var camera_view = [
    this.points[0][0] - camera_position[0],
    this.points[0][1] - camera_position[1],
    this.points[0][2] - camera_position[2]
  ];
    var mapped_point = perspective_project(camera_view, viewing_distance);

    //calculate edge of shpere
    var top_position = perspective_project(
    [
      this.points[0][0] - camera_position[0],
      this.points[0][1] + rad - camera_position[1],
      this.points[0][2] - camera_position[2]
    ], viewing_distance
    );
    var bottom_position = perspective_project(
    [
      this.points[0][0] - camera_position[0],
      this.points[0][1] - rad - camera_position[1],
      this.points[0][2] - camera_position[2]
    ], viewing_distance
    );
    var left_position = perspective_project(
    [
      this.points[0][0] - rad - camera_position[0],
      this.points[0][1] - camera_position[1],
      this.points[0][2] - camera_position[2]
    ], viewing_distance
    );
    var right_position = perspective_project(
    [
      this.points[0][0] + rad - camera_position[0],
      this.points[0][1] - camera_position[1],
      this.points[0][2] - camera_position[2]
    ], viewing_distance
    );

    ctx.beginPath();
    for (var i = start_position; i <= rad; i += rough) {
        var upper_arc = perspective_project(
      [
        this.points[0][0] - camera_position[0],
        this.points[0][1] + rad - i - camera_position[1],
        this.points[0][2] - camera_position[2]
      ], viewing_distance
        );
        var lower_arc = perspective_project(
      [
        this.points[0][0] - camera_position[0],
        this.points[0][1] - rad + i - camera_position[1],
        this.points[0][2] - camera_position[2]
      ], viewing_distance
        );
        var left_arc = perspective_project(
      [
        this.points[0][0] - rad + i - camera_position[0],
        this.points[0][1] - camera_position[1],
        this.points[0][2] - camera_position[2]
      ], viewing_distance
        );
        var right_arc = perspective_project(
      [
        this.points[0][0] + rad - i - camera_position[0],
        this.points[0][1] - camera_position[1],
        this.points[0][2] - camera_position[2]
      ], viewing_distance
        );

        //drawing ellipse
        ctx.strokeEllipse(left_arc[0] + this.center_point[0],
            top_position[1] + this.center_point[1],
            right_arc[0] + this.center_point[0],
            bottom_position[1] + this.center_point[1]
        );
        ctx.strokeEllipse(left_position[0] + this.center_point[0],
            upper_arc[1] + this.center_point[1],
            right_position[0] + this.center_point[0],
            lower_arc[1] + this.center_point[1]
        );

    }
    ctx.closePath();
}

//--End Drawing Zone--

//calculate viewing distance
//fov : degree, screen_width : canvas_width
//return number
function calculate_viewing_distance(fov, screen_width) {
    var rad = fov / 180 * Math.PI;
    d = (screen_width / 2) / Math.tan(rad / 2)
    return d
}

//calculate 3D points to 2D points
//vec = [x, y, z], d = viewing_distance
function perspective_project(vec, d) {
    var x = vec[0];
    var y = vec[1];
    var z = vec[2];
    if (z > 0) {
        return [x * d / z, -y * d / z];
    } else {
        return false;
    }
}

//To draw sphere
CanvasRenderingContext2D.prototype.strokeEllipse = function (left, top, right, bottom) {
    var halfWidth = (right - left) / 2.0;
    var halfHeight = (bottom - top) / 2.0;
    var x0 = left + halfWidth;
    var y1 = top + halfHeight;
    this.beginPath();
    var cw = 4.0 * (Math.sqrt(2.0) - 1.0) * halfWidth / 3.0;
    var ch = 4.0 * (Math.sqrt(2.0) - 1.0) * halfHeight / 3.0;
    this.moveTo(x0, top);
    this.bezierCurveTo(x0 + cw, top, right, y1 - ch, right, y1);
    this.bezierCurveTo(right, y1 + ch, x0 + cw, bottom, x0, bottom);
    this.bezierCurveTo(x0 - cw, bottom, left, y1 + ch, left, y1);
    this.bezierCurveTo(left, y1 - ch, x0 - cw, top, x0, top);
    this.stroke();
};