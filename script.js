(function () {
    window.onload = function () {
        init();
    }

    function init() {

        var canvas_width = 600;
        var canvas_height = 600;

        var canvas_cube = document.getElementById("cube");
        var canvas_transfer = document.getElementById("transfer-cube");
        var canvas_rotate = document.getElementById("rotate-cube");
        var canvas_scale = document.getElementById("scale-cube");
        var canvas_sphere = document.getElementById("sphere");
        var canvas_rotate_sphere = document.getElementById("rotate-sphere");
        var canvas = document.getElementById("sample");

        //cube points
        var cube_points = [
            [-50, -50, -50],
            [-50, -50, 50],
            [-50, 50, -50],
            [-50, 50, 50],
            [50, -50, -50],
            [50, -50, 50],
            [50, 50, -50],
            [50, 50, 50],
        ];

        var cube_points2 = [
            [-50, -50, -50],
            [-50, -50, 50],
            [-50, 50, -50],
            [-50, 50, 50],
            [50, -50, -50],
            [50, -50, 50],
            [50, 50, -50],
            [50, 50, 50],
        ];

        var cube_points3 = [
            [-50, -50, -50],
            [-50, -50, 50],
            [-50, 50, -50],
            [-50, 50, 50],
            [50, -50, -50],
            [50, -50, 50],
            [50, 50, -50],
            [50, 50, 50],
        ];

        var cube_points4 = [
            [-50, -50, -50],
            [-50, -50, 50],
            [-50, 50, -50],
            [-50, 50, 50],
            [50, -50, -50],
            [50, -50, 50],
            [50, 50, -50],
            [50, 50, 50],
        ];
        //shpere points
        var sphere_points = [
            [0, 0, 0]
        ];

        var center_point = [canvas_width / 2, canvas_height / 2];

        //cube connection
        var cube_connection = [
            [0, 1], [1, 3], [3, 2], [2, 0], //left square
            [4, 5], [5, 7], [7, 6], [6, 4], //right square
            [0, 4], [1, 5], [3, 7], [2, 6],
        ];

        var connection = [
            [0, 1], [1, 3], [3, 2], [2, 0], //left square
            [4, 5], [5, 7], [7, 6], [6, 4], //right square
            //[0, 4], [1, 5], [3, 7], [2, 6],
            [0, 6], [1, 7], [2, 4], [3, 5],
            [0, 7], [3, 4]
        ];

        //tetrahedron connection
        var tetrahedron_connection = [

        ];


        var camera_position = [0, 0, -200];
        var fov = 75;
        var background_color = 'rgb(255, 255, 255)';

        //drawing cube
        canvas_cube.width = canvas_width;
        canvas_cube.height = canvas_height;
        var cube3d = new CanvasThreeD(cube_points, center_point, cube_connection);
        cube3d.drawing(canvas_cube, camera_position, fov);

        //drawing transfer-cube
        canvas_transfer.width = canvas_width;
        canvas_transfer.height = canvas_height;
        var transer_cube3d = new CanvasThreeD(cube_points, center_point, cube_connection);
        transer_cube3d.set_translate(-60, -60, 0);
        transer_cube3d.drawing(canvas_transfer, camera_position, fov);
        transer_cube3d.initialize_box();
        transer_cube3d.set_translate(60, 60, 60);
        transer_cube3d.drawing(canvas_transfer, camera_position, fov);
        transer_cube3d.initialize_box();
        transer_cube3d.set_translate(60, 60, -60);
        transer_cube3d.drawing(canvas_transfer, camera_position, fov);

        //drawing rotate-cube
        canvas_rotate.width = canvas_width;
        canvas_rotate.height = canvas_height;
        var rotate_cube3d = new CanvasThreeD(cube_points2, center_point, cube_connection);
        rotate_cube3d.set_x_rotate(30);
        rotate_cube3d.drawing(canvas_rotate, camera_position, fov);
        rotate_cube3d.drawing(canvas_rotate, camera_position, fov);
        rotate_cube3d.drawing(canvas_rotate, camera_position, fov);

        //drawing scale-cube
        canvas_scale.width = canvas_width;
        canvas_scale.height = canvas_height;
        var scale_cube3d = new CanvasThreeD(cube_points3, center_point, cube_connection);
        scale_cube3d.drawing(canvas_scale, camera_position, fov);
        scale_cube3d.set_scale(2.0, 1, 1);
        scale_cube3d.drawing(canvas_scale, camera_position, fov);

        //drawing sphere
        canvas_sphere.width = canvas_width;
        canvas_sphere.height = canvas_height;
        var sphere3d = new CanvasThreeD(sphere_points, center_point, null);
        sphere3d.drawSphere(canvas_sphere, camera_position, fov, 100, 20, 0);

        //drawing rotate sphere
        canvas_rotate_sphere.width = canvas_width;
        canvas_rotate_sphere.height = canvas_height;
        var rotate_sphere3d = new CanvasThreeD(sphere_points, center_point, null);
        var cnt = 0;
        var ctx_sphere = canvas_rotate_sphere.getContext("2d");
        ctx_sphere.fillStyle = "rgb(255, 255, 255)";
        setInterval(function () {
            ctx_sphere.fillRect(0, 0, canvas_width, canvas_height);
            var start_position = (cnt % 2) * 10;
            rotate_sphere3d.drawSphere(canvas_rotate_sphere, camera_position, fov, 100, 20, start_position);
            ++cnt;
        }, 50);

        //sample
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        var canvas3d = new CanvasThreeD(cube_points4, center_point, connection);
        canvas3d.set_scale(1, 1, 2);
        canvas3d.drawing(canvas, camera_position, fov);
        canvas3d.initialize_box();
        canvas3d.set_x_rotate(2);
        canvas3d.set_y_rotate(3);
        canvas3d.set_z_rotate(5);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(255, 255, 255)";
        var fov_sp = fov;
        var fov_flg = true;
        setInterval(function () {
            if (fov_sp >= 90) fov_flg = false;
            else if (fov_sp <= 0) fov_flg = true;
            if (fov_flg) {
                ++fov_sp;
            } else {
                --fov_sp;
            }

            ctx.fillRect(0, 0, canvas_width, canvas_height);
            canvas3d.drawing(canvas, camera_position, fov_sp);
        }, 50);
    }
})();