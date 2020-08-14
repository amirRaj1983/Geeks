(function ($) {
    var animation;
    var distance;
    var fileName;
    var picIndex = 0;
    var correctAnswer = 0;

    gameStart.onclick = function (event) {
        textBoxClear();
        var dataResult = { period: picIndex };
        if (picIndex < 10) {
            $.ajax({
                url: "Home/GetFileName",
                type: "GET",
                data: dataResult,
                dataType: "text",
                success: function (response) {
                    $("div.image").css("content", "url('../../image/" + response + "')");
                    $("#draggable").css("margin", "0 auto");
                    $("#draggable").css("left", "0");
                    $("#draggable").css("top", "0");
                    $("#draggable").css("display", "block");
                    animation = $("#draggable").animate({ top: '600px' }, 3000, 'linear', function () {
                        nextPic();
                        $("#gameStart").trigger("click");
                    });
                    fileName = response;
                }
            });
        } else {
            $("#draggable").css("display", "none");
            stopMovement();
        }
    }

    draggable.onmouseover = function () {
        if (animation !== undefined) {
            animation.stop();
        }
        distance = draggable.style.top;
    }

    draggable.onmouseout = function () {
        if (distance) {
            var speed = (3000 * parseInt(distance, 10)) / 600;
            if (picIndex < 10) {
                animation = $("#draggable").animate({ top: '600px' }, (3000 - speed), 'linear', function () {
                    nextPic();
                    $("#gameStart").trigger("click");
                });
            } else {
                $("#draggable").css("display", "none");
                stopMovement();
            }
        }
    }

    $(function () {
        $("#draggable").draggable({
            scroll: false,
            revert: 'invalid',
            stack: false,
            cursor: "pointer",
            drag: function () {
                $(".droppable").removeClass("ui-state-highlight");
            }
        });
        $(".droppable").droppable({
            tolerance: 'intersect',
            drop: function (event, ui) {
                distance = "";
                var drop_el = $(this).offset();
                var drag_el = ui.draggable.offset();
                var left_end = (drop_el.left + ($(this).width() / 2)) - (drag_el.left + (ui.draggable.width() / 2));
                var top_end = (drop_el.top + ($(this).height() / 2)) - (drag_el.top + (ui.draggable.height() / 2));
                $(this).addClass("ui-state-highlight");
                ui.draggable.animate({
                    top: '+=' + top_end,
                    left: '+=' + left_end
                }, callback = function () {
                    if (picIndex < 10) {
                        $("#draggable").css("display", "none");
                        if (fileName.toLowerCase().toString().includes(event.target.id.toLowerCase())) {
                            correctAnswer = correctAnswer + 1;
                        }
                        picIndex = picIndex + 1;
                        $("#gameStart").trigger("click");
                    } else {
                        stopMovement();
                    }
                });
            }
        });
    });

    function stopMovement() {
        var calculation = (correctAnswer * 20) + ((10 - correctAnswer) * (-5));
        $("#gameStart").prop('disabled', false);
        $("#score").val(calculation);
        picIndex = 0;
        correctAnswer = 0;
    }

    function nextPic() {
        picIndex = picIndex + 1;
        $("#draggable").css("display", "none");
    }

    function textBoxClear() {
        $("#score").text("");
        $("#score").val(0);
        $("#gameStart").prop('disabled', true);
    }
})(jQuery);