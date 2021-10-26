
var searchMenu = 0;
const aside = document.querySelector("aside");
var gPaths = null;
var gList = null;
var gCurrentPathId = null;
var gCurrentPathIndex = 0;
var gPathKeys = [];
var gLabels = ['DeptSelect', 'SubDeptSelect', 'ClassSelect', 'SubClassSelect', 'StyleSelect', 'UpcSelect', 'EpcSelect'];
var gOffset = null;
var width = null;
var height = null;
var gPosY = null;
var gPosX = null;
var gX = 0;
var gY = 0;

var gD = 0;
var gSD = 0;

function searchDiv() {
    if (searchMenu == 0) {
        searchMenu++;
        aside.style = "left:0vw;transition:1s ease-in-out;";
        $('#menu').attr('class', 'fas fa-angle-double-left fa-2x');
    } else {
        searchMenu--;
        aside.style = "left:-50vw;transition:1s ease-in-out;";
        $('#menu').attr('class', 'fas fa-bars fa-2x');
    }
}


function AllDepts() {
    ShowLoader();
    $.ajax({
        type: "GET",
        url: "/api/dept/list/",
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '<option value="XXX"></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].dept + '">' + results[i].deptName + ' - ' + results[i].total + '</option>';
            }

            CleanUp('DeptSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function AllSubDepts() {
    ShowLoader();
    var obj = new Object();
    obj.dept = $("#DeptSelect option:selected").val();
    $.ajax({
        type: "PUT",
        url: "/api/subdept/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '<option value="XXX"></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].subDept + '">' + results[i].subDeptName + ' - ' + results[i].total + '</option>';
            }
            CleanUp('SubDeptSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function AllClasses() {
    ShowLoader();
    var obj = new Object();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    $.ajax({
        type: "PUT",
        url: "/api/class/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '<option value="XXX"></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].class + '">' + results[i].className + ' - ' + results[i].total + '</option>';
            }
            CleanUp('ClassSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function AllSubClasses() {
    ShowLoader();
    var obj = new Object();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    obj.class = $("#ClassSelect option:selected").val();
    $.ajax({
        type: "PUT",
        url: "/api/subclass/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '<option value="XXX"></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].subClass + '">' + results[i].subClassName + ' - ' + results[i].total + '</option>';
            }
            CleanUp('SubClassSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function AllStyles() {
    ShowLoader();
    var obj = new Object();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    obj.class = $("#ClassSelect option:selected").val();
    obj.subClass = $("#SubClassSelect option:selected").val();
    $.ajax({
        type: "PUT",
        url: "/api/style/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '<option value="XXX"></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].style + '">' + results[i].styleName + ' - ' + results[i].total + '</option>';
            }
            CleanUp('StyleSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function LoadUPC() {
    ShowLoader();
    var obj = new Object();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    obj.class = $("#ClassSelect option:selected").val();
    obj.subClass = $("#SubClassSelect option:selected").val();
    obj.style = $("#StyleSelect option:selected").val();
    obj.year = $("#Year").val();
    obj.month = $("#Month").val();
    obj.day = $("#Day").val();
    obj.limit = $("#Limit").val();
    obj.table = $("#TableSelect option:selected").val();
    if (obj.limit === '0' || obj.limit === 0) { obj.limit = undefined; }
    if (obj.dept === 'XXX') { obj.dept = undefined; }
    if (obj.subDept === 'XXX') { obj.subDept = undefined; }
    if (obj.class === 'XXX') { obj.class = undefined; }
    if (obj.subClass === 'XXX') { obj.subClass = undefined; }
    if (obj.style === 'XXX') { obj.style = undefined; }
    $.ajax({
        type: "PUT",
        url: "/api/upc/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].productId + '">' + results[i].productId + ' - ' + results[i].name + ' (' + results[i].total + ' reads)</option>';
            }
            CleanUp('UpcSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function LoadIt() {
    ShowLoader();
    var obj = new Object();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    obj.class = $("#ClassSelect option:selected").val();
    obj.subClass = $("#SubClassSelect option:selected").val();
    obj.style = $("#StyleSelect option:selected").val();
    obj.year = $("#Year").val();
    obj.month = $("#Month").val();
    obj.day = $("#Day").val();
    obj.productId = $("#UpcSelect").val();
    obj.limit = $("#Limit").val();
    obj.table = $("#TableSelect option:selected").val();
    if (obj.limit === '0' || obj.limit === 0) { obj.limit = undefined; }
    if (obj.dept === 'XXX') { obj.dept = undefined; }
    if (obj.subDept === 'XXX') { obj.subDept = undefined; }
    if (obj.class === 'XXX') { obj.class = undefined; }
    if (obj.subClass === 'XXX') { obj.subClass = undefined; }
    if (obj.style === 'XXX') { obj.style = undefined; }
    $.ajax({
        type: "PUT",
        url: "/api/points/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var list = results.list;
            var paths = results.paths;
            gPaths = paths;
            gList = list;
            var keys = Object.keys(paths);
            gPathKeys = keys;
            var html = '';
            for (var i = 0; i < keys.length; i++) {
                html += '<option value="' + keys[i] + '">EPC:' + paths[keys[i]][0].id + ', ' + paths[keys[i]][0].productId + ' - ' + paths[keys[i]][0].name + ' (' + paths[keys[i]].length + ' reads)</option>';
            }
            CleanUp('EpcSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
            alert(JSON.stringify(results));
        }
    });
}

function Forward() {
    var list = gPaths[gCurrentPathId];
    if (gCurrentPathIndex < list.length - 1) {
        gCurrentPathIndex++;

        var o = list[gCurrentPathIndex];
        var x = gPosX + o.x * width / 1111;
        var y = gPosY + height - o.y * height / 1195;
        $(".pointContainer li").removeClass('newpoint');
        var html = '<li class="point newpoint" style="top: ' + y + 'px; left: ' + x + 'px;"></li>';
        $(".pointContainer").append(html);
        $("#Message").empty();
        var t = gCurrentPathIndex;
        var h2 = '<h4>' + o.name + ' - ' + o.timestamp + ' Step ' + t + ' of ' + list.length + '</h4>';
        $("#Message").append(h2);
    } else {

        $(".pointContainer li").removeClass('newpoint');
        $(".pointContainer li").addClass('oldpoint');
        var index = gPathKeys.indexOf(gCurrentPathId);
        gCurrentPathIndex = -1;
        if (index < gPathKeys.length - 1) {
            index++;
            gCurrentPathId = gPathKeys[index];
            $("#EpcSelect").val(gCurrentPathId);
            // var o = list[gCurrentPathIndex];
            // var x = gPosX + o.x * width / 1111;
            // var y = gPosY + height - o.y * height / 1195;
            // var html = '<li class="point newpoint" style="top: ' + y + 'px; left: ' + x + 'px;"></li>';
            // $(".pointContainer").append(html);
            // $("#Message").empty();
            // var t = gCurrentPathIndex;
            // var h2 = '<h4>' + o.name + ' - ' + o.timestamp + ' Step ' + t + ' of ' + list.length + '</h4>';
            // $("#Message").append(h2);
        } else {
            $(".pointContainer").empty();
            gCurrentPathId = gPathKeys[0];
            gCurrentPathIndex = -1;
            $("#EpcSelect").val(gCurrentPathId);
        }
    }
}

function ChangeEpcView() {
    var ids = $("#EpcSelect").val();
    $(".pointContainer").empty();
    if (ids.length === 1) {
        gCurrentPathId = ids[0];
        gCurrentPathIndex = -1;
        Forward();
    } else if (ids.length > 1) {
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var list = gPaths[id];
            for (var j = 0; j < list.length; j++) {
                var o = list[gCurrentPathIndex];
                var x = gPosX + o.x * width / 1111;
                var y = gPosY + height - o.y * height / 1195;
                var html = '<li class="point oldpoint" style="top: ' + y + 'px; left: ' + x + 'px;"></li>';
                $(".pointContainer").append(html);
                $("#Message").empty();
                var t = gCurrentPathIndex;
                var h2 = '<h4>' + o.name + ' - ' + o.timestamp + ' Step ' + t + ' of ' + list.length + '</h4>';
                $("#Message").append(h2);
            }
        }
    }
}

function ShowAll() {
    ShowLoader();
    $(".pointContainer").empty();
    gX = 0;
    gY = 0;
    gD = 0;

    gSD = 0;
    for (var i = 0; i < gList.length; i++) {
        var o = gList[i];
        var x = gPosX + o.x * width / 1111;
        var y = gPosY + height - o.y * height / 1195;
        var html = '<li class="point oldpoint" style="top: ' + y + 'px; left: ' + x + 'px;"></li>';
        gX = gX + o.x;
        gY = gY + o.y;
        $(".pointContainer").append(html);
    }
    gX = gX / (gList.length - 1);
    gY = gY / (gList.length - 1);
    for (var i = 0; i < gList.length; i++) {
        var o = gList[i];
        gD = gD + Math.sqrt((o.x - gX) * (o.x - gX) + (o.y - gY) * (o.y - gY));
    }
    gD = gD / gList.length;
    for (var i = 0; i < gList.length; i++) {
        var o = gList[i];
        var d = Math.sqrt((o.x - gX) * (o.x - gX) + (o.y - gY) * (o.y - gY));

        var gSD = gSD + (d - gD) * (d - gD);
    }
    gSD = Math.sqrt(gSD / (gList.length - 1));
    var x = gPosX + gX * width / 1111;
    var y = gPosY + height - gY * height / 1195;
    var h4 = '<li class="point newpoint" style="top: ' + y + 'px; left: ' + x + 'px;"></li>';
    $(".pointContainer").append(h4);
    var h2 = '<h4>Centroid X: ' + gX + ', Y: ' + gY + '. SD: ' + gSD + '</h4>';
    $("#Message").empty();
    $("#Message").append(h2);
    var xx = Math.floor(gPosX + (gX - gSD) * width / 1111 - 8);
    var yy = Math.floor(gPosY + height - (gY + gSD) * height / 1195 - 8);
    var temp = Math.floor(gSD * 2 + 1);
    var hh = '<li class="radius" style="top: ' + yy + 'px; left: ' + xx + 'px; height: ' + temp + 'px !important; width: ' + temp + 'px !important;"></li>';
    $(".pointContainer").append(hh);
    HideLoader();
}

function CancelStuff() {
    HideLoader();
    location.reload(true);
}

function CleanUp(label, html) {
    var index = gLabels.indexOf(label);
    for (var i = index; i < gLabels.length; i++) {
        $('#' + gLabels[i]).empty();
    }
    $("#" + label).append(html);
    if (label === 'EpcSelect') {
        $(".EpcStuff").show();
        $(".UpcStuff").hide();
        // HideLoader();
    } else {
        $(".EpcStuff").hide();
        $(".pointContainer").empty();
        $(".UpcStuff").show();
        // if (label === 'SubClassSelect' || label === 'ClassSelect') {
        //     LoadUPC();
        // }else{
        //     HideLoader();
        // }
    }
}

function HideLoader() {
    $('#loading').hide();
    $("#MapSection").show();
    $(".CheckLoader").prop('disabled', false);
}

function ShowLoader() {
    $('#loading').show();
    $("#MapSection").hide();
    $(".CheckLoader").prop('disabled', true);
}