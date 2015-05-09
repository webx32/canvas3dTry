(function () {
    window.onload = function () {
        init();
    }

    function init() {

        var canvas_width = 400;
        var canvas_height = 400;

        var canvas = document.getElementById("my-canvas");
        canvas.width = canvas_width;
        canvas.height = canvas_height;

        var points = [
        	[-50, -50, -50],
        	[-50, -50,  50],
        	[-50,  50, -50],
        	[-50,  50,  50],
        	[ 50, -50, -50],
        	[ 50, -50,  50],
        	[ 50,  50, -50],
        	[ 50,  50,  50],
        ];

        var center_point = [canvas_width/2, canvas_height/2];

        var connection = [
        	[0,1], [1,3], [3,2], [2,0], //left square
        	[4,5], [5,7], [7,6], [6,4], //right square
        	[0,4], [1,5], [3,7], [2,6],
        	[0,7], [1,6], [2,5], [3,4]
        ];

        var camera_position = [0, 0, -200];
        var fov = 75;
        var background_color = 'rgb(255, 255, 255)';

        var canvas3d = new CanvasThreeD(points, center_point, connection);

        canvas3d.set_x_rotate(2);
        canvas3d.set_y_rotate(5);
        //canvas3d.set_z_rotate(30);
        //canvas3d.set_scale(1, 1, 2);
        //canvas3d.set_translate(-10, 1, 1);

        setInterval(function () {
        	canvas3d.drawing(canvas, camera_position, fov, background_color);
        }, 50);
    }
})();
