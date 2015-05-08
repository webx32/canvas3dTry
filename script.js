(function () {
    window.onload = function () {
        init();
    }

    function init() {

        var canvas_width = 400;
        var canvas_height = 400;

        var canvas = document.getElementById("my-canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = canvas_width;
        canvas.height = canvas_height;

	//����p�x
        var fov = 90;
	//�����̂̃T�C�Y
        var cube_size = 100;
	//���싗���̌v�Z����
	var viewing_distance = calculate_viewing_distance(fov, canvas_width);

	//�����̂̒��S����̑��΍��W���X�g
	var points = [
	    [-cube_size/2, cube_size/2,-cube_size/2],
	    [-cube_size/2, cube_size/2, cube_size/2],
	    [-cube_size/2,-cube_size/2, cube_size/2],
	    [-cube_size/2,-cube_size/2,-cube_size/2],
	    [ cube_size/2, cube_size/2,-cube_size/2],
	    [ cube_size/2, cube_size/2, cube_size/2],
	    [ cube_size/2,-cube_size/2, cube_size/2],
	    [ cube_size/2,-cube_size/2,-cube_size/2]
	];

	//canvas�̒��S���W
	var center_point = [canvas_width / 2, canvas_height / 2];

	//�J�����ʒu
	var camera_position = [0, 0, -cube_size * 2];

	//�������烋�[�v
	setInterval(function () {
	    ctx.fillStyle = 'rgb(255, 255, 255)';
	    ctx.fillRect(0, 0, canvas_width, canvas_height);

	    //���W�ϊ�
	    var matrix = new Matrix44();
	    matrix.set_y_rotate(3);
	    matrix.set_z_rotate(3);
	    //matrix.set_translate(1, 0, 0);
	    //matrix.set_scale(1.01, 1.001, 1.001)
	    for (var i = 0; i < points.length; ++i) {
		points[i] = matrix.mapping(points[i]);
	    }
	    
	    //2�������e��̍��W
	    var transformed_points = [];
	    //2�����ɓ��e
	    var camera_view = [];
	    for (var i = 0; i < points.length; ++i) {
		var vec3 = new calVector3(points[i], camera_position);
		camera_view[i] = vec3.min();
		var transformed_point = perspective_project(camera_view[i], viewing_distance);
		transformed_point = [transformed_point[0] + center_point[0], transformed_point[1] + center_point[1]];
		transformed_points.push(transformed_point);
	    }
	    
	    //����`�� �����̐����`
	    ctx.beginPath();
	    ctx.moveTo(transformed_points[0][0], transformed_points[0][1]);
	    ctx.lineTo(transformed_points[1][0], transformed_points[1][1]);
	    ctx.lineTo(transformed_points[2][0], transformed_points[2][1]);
	    ctx.lineTo(transformed_points[3][0], transformed_points[3][1]);
	    ctx.closePath();
	    ctx.stroke();
	    //����`�� �E���̐����`
	    ctx.beginPath();
	    ctx.moveTo(transformed_points[4][0], transformed_points[4][1]);
	    ctx.lineTo(transformed_points[5][0], transformed_points[5][1]);
	    ctx.lineTo(transformed_points[6][0], transformed_points[6][1]);
	    ctx.lineTo(transformed_points[7][0], transformed_points[7][1]);
	    ctx.closePath();
	    ctx.stroke();
	    //����`�� ���E�̐����`���Ȃ���
	    ctx.beginPath();
	    ctx.moveTo(transformed_points[0][0], transformed_points[0][1]);
	    ctx.lineTo(transformed_points[4][0], transformed_points[4][1]);
	    ctx.moveTo(transformed_points[1][0], transformed_points[1][1]);
	    ctx.lineTo(transformed_points[5][0], transformed_points[5][1]);
	    ctx.moveTo(transformed_points[2][0], transformed_points[2][1]);
	    ctx.lineTo(transformed_points[6][0], transformed_points[6][1]);
	    ctx.moveTo(transformed_points[3][0], transformed_points[3][1]);
	    ctx.lineTo(transformed_points[7][0], transformed_points[7][1]);
	    ctx.stroke();

	}, 50);
    }

    //���_�������v�Z����֐�
    function calculate_viewing_distance(fov, screen_width) {
	var rad = fov / 180 * Math.PI;
        d = (screen_width / 2) / Math.tan(rad / 2)
        return d
    }

    //�������e���s���֐�
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


    //3�����̃x�N�g�����Z
    function calVector3(vec_a, vec_b) {
	this.vec_a = vec_a;
	this.vec_b = vec_b || [0, 0, 0];
    }
    calVector3.prototype.add = function () {
	return [this.vec_a[0]+this.vec_b[0], this.vec_a[1]+this.vec_b[1], this.vec_a[2]+this.vec_b[2]];
    }
    calVector3.prototype.min = function () {
	return [this.vec_a[0]-this.vec_b[0], this.vec_a[1]-this.vec_b[1], this.vec_a[2]-this.vec_b[2]];
    }
    calVector3.prototype.mul = function (times) {
	return [this.vec_a[0]*times, this.vec_a[1]*times, this.vec_a[2]*times];
    }


    //�s��v�Z
    function Matrix44() {
	this.box = [
	    [1, 0, 0, 0],
	    [0, 1, 0, 0],
	    [0, 0, 1, 0],
	    [0, 0, 0, 1]
	];
    }
    Matrix44.prototype.set_x_rotate = function (angle) {
	var rad = angle / 180 * Math.PI;
	var box2 = [
	    [1, 0, 0, 0],
	    [0, Math.cos(rad), -Math.sin(rad), 0],
	    [0, Math.sin(rad), Math.cos(rad), 0],
	    [0, 0, 0, 1]
	];
	this.connect(box2);
    }
    Matrix44.prototype.set_y_rotate = function (angle) {
	var rad = angle / 180 * Math.PI;
	var box2 = [
	    [Math.cos(rad), 0, Math.sin(rad), 0],
	    [0, 1, 0, 0],
	    [-Math.sin(rad), 0, Math.cos(rad), 0],
	    [0, 0, 0, 1]
	];
	this.connect(box2);
    }
    Matrix44.prototype.set_z_rotate = function (angle) {
	var rad = angle / 180 * Math.PI;
	var box2 = [
	    [Math.cos(rad), -Math.sin(rad), 0, 0],
	    [Math.sin(rad), Math.cos(rad), 0, 0],
	    [0, 0, 1, 0],
	    [0, 0, 0, 1]
	];
	this.connect(box2);
    }
    Matrix44.prototype.set_translate = function (x, y, z) {
	var box2 = [
	    [1, 0, 0, x],
	    [0, 1, 0, y],
	    [0, 0, 1, z],
	    [0, 0, 0, 1]
	];	
	this.connect(box2);
    }
    Matrix44.prototype.set_scale = function (x, y, z) {
	var box2 = [
	    [x, 0, 0, 0],
	    [0, y, 0, 0],
	    [0, 0, z, 0],
	    [0, 0, 0, 1]
	];
	this.connect(box2);
    }
    Matrix44.prototype.connect = function (box2) {
	if (this.box.length != box2[0].length) return; //�G���[����
	var box1 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]; //�z��̏�����
	for (var i = 0; i < this.box.length; ++i) { //���Ƃ̔z����R�s�[
	    for (var n = 0; n < this.box[0].length; ++n) {
		box1[i][n] = this.box[i][n];
	    }
	}
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
    Matrix44.prototype.mapping = function (vec3) {
	var mapping_x = 0, mapping_y = 0, mapping_z = 0;
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
})();
