
var searchMenu = 0;
const aside = document.querySelector("aside");
var gPaths = null;
var gList = null;
var gCurrentPathId = null;
var gCurrentPathIndex = 0;
var gPathKeys = [];
var gLabels = ['DeptSelect', 'SubDeptSelect', 'ClassSelect', 'SubClassSelect', 'StyleSelect', 'UpcSelect', 'EpcSelect'];
var gEpcList = [];
var gLastX = 0;
var gLastY = 0;
var imageHeight = 1111;
var imageWidth = 1195;

var lastDate = null;

var gPoints = new Object();

var canvas = null;
var ctx = null;
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
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
    $("#SkuText").val('');
    $.ajax({
        type: "PUT",
        url: "/api/dept/list/",
        data: obj,
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
    $("#SkuText").val('');
    ShowLoader();
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
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
    $("#SkuText").val('');
    ShowLoader();
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
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
    $("#SkuText").val('');
    ShowLoader();
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
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

function AllStyleGroups() {
    $("#SkuText").val('');
    ShowLoader();
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    obj.class = $("#ClassSelect option:selected").val();
    obj.subClass = $("#SubClassSelect option:selected").val();
    $.ajax({
        type: "PUT",
        url: "/api/stylegroup/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '<option value=""></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].styleGroup + '">' + results[i].styleGroup + ' - ' + results[i].total + '</option>';
            }
            CleanUp('StyleGroupSelect', html);
            $("#TableSelect").val('CurrentLocation');
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function AllStyles() {
    $("#SkuText").val('');
    ShowLoader();
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
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
            var html = '<option value=""></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].style + '">' + results[i].styleName + ' - ' + results[i].total + '</option>';
            }
            CleanUp('StyleSelect', html);
            $("#TableSelect").val('CurrentLocation');
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
    obj.storeId = $("#StoreSelect option:selected").val();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    obj.class = $("#ClassSelect option:selected").val();
    obj.subClass = $("#SubClassSelect option:selected").val();
    obj.style = $("#StyleSelect option:selected").val();
    obj.styleGroup  = $("#StyleGroupSelect option:selected").val();
    $.ajax({
        type: "PUT",
        url: "/api/sku/list/",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '<option value=""></option>';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].productId + '">' + results[i].productId + ' - ' + results[i].styleName + '</option>';
            }
            CleanUp('UpcSelect', html);
            HideLoader();
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function StartLoadingIt() {
    var sku = $("#UpcSelect option:selected").val();
    $("#SkuText").val(sku);
    LoadIt();
}


function LoadIt(withProduct = true, loadCurrentEpc = false) {
    ShowLoader();
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
    obj.dept = $("#DeptSelect option:selected").val();
    obj.subDept = $("#SubDeptSelect option:selected").val();
    obj.class = $("#ClassSelect option:selected").val();
    obj.subClass = $("#SubClassSelect option:selected").val();
    obj.style = $("#StyleSelect option:selected").val();
    obj.styleGroup  = $("#StyleGroupSelect option:selected").val();
    obj.year = $("#Year").val();
    obj.month = $("#Month").val();
    obj.day = $("#Day").val();
    obj.hourStart = $("#HourStart").val();
    obj.hourStop = $("#HourStop").val();
    obj.regions = $("#RegionSelect").val();
    obj.table = $("#TableSelect option:selected").val();
    if (obj.regions === undefined) { obj.regions = []; }
    if (withProduct) {
        obj.productId = $("#SkuText").val();
        obj.epc = $("#EpcText").val();
    }
    if (loadCurrentEpc) {
        if (obj.table === 'CurrentLocation') {
            obj.table = 'EpcMoveView';
            $("#TableSelect").val('EpcMoveView');
        }
        obj.epcs = gEpcList;
        gEpcList = [];
    }
    obj.limit = $("#Limit").val();

    obj.isExit = $("#IsExitSelect option:selected").val();
    obj.isGhost = $("#IsGhostSelect option:selected").val();
    obj.isMissing = $("#IsMissingSelect option:selected").val();
    obj.isMove = $("#IsMoveSelect option:selected").val();
    obj.isRegion = $("#IsRegionSelect option:selected").val();
    obj.isSold = $("#IsSoldSelect option:selected").val();
    obj.isDeparture = $("#IsDepartureSelect option:selected").val();
    obj.isValid = $("#IsValidSelect option:selected").val();
    if (obj.limit === '0' || obj.limit === 0) { obj.limit = undefined; }
    if (obj.dept === 'XXX') { obj.dept = undefined; }
    if (obj.subDept === 'XXX') { obj.subDept = undefined; }
    if (obj.class === 'XXX') { obj.class = undefined; }
    if (obj.subClass === 'XXX') { obj.subClass = undefined; }
    if (obj.style === 'XXX') { obj.style = undefined; }
    $.ajax({
        type: "PUT",
        url: "/api/points/list",
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
            gEpcList = [];
            for (var i = 0; i < keys.length; i++) {
                if (gEpcList.indexOf(paths[keys[i]][0].id) === -1) {
                    gEpcList.push(paths[keys[i]][0].id);
                }
                html += '<option value="' + keys[i] + '">EPC:' + paths[keys[i]][0].id + ', ' + paths[keys[i]][0].productId + ' - ' + paths[keys[i]][0].name + ' (' + paths[keys[i]].length + ' reads)</option>';
            }
            CleanUp('EpcSelect', html);
            HideLoader();
            $("#EpcLables").empty();
            $("#EpcLables").append("EPC's (" + gEpcList.length + " found)");
        },
        error: function (results) {
            HideLoader();
        }
    });
}

function AllRegions() {
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
    //RegionSelect
    $.ajax({
        type: "PUT",
        url: "/api/region/list",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (results) {
            var html = '';
            for (var i = 0; i < results.length; i++) {
                html += '<option value="' + results[i].id + '">' + results[i].regionName + '</option>';
            }
            $("#RegionSelect").empty();
            $("#RegionSelect").append(html);

        },
        error: function (results) {
            alert(JSON.stringify(results));
        }
    });
}


function LoadHomeZone() {
    ShowLoader();
    var obj = new Object();
    obj.productId = $("#UpcSelect option:selected").val();
    if (obj.productId === undefined) {
        obj.productId = '';
    }
    obj.style = $("#StyleSelect option:selected").val();
    obj.storeId = $("#StoreSelect option:selected").val();
    obj.k = 3;
    $.ajax({
        type: "PUT",
        url: "/api/sku/home",
        data: obj,
        cache: false,
        dataType: "json",
        success: function (result) {
            HideLoader();
            ctx.save();
            ctx.beginPath();
            ctx.arc(result.xCenter, imageHeight - result.yCenter, result.radiusAvg, 0, Math.PI * 2);
            ctx.globalAlpha = 0.5;
            ctx.closePath();
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.restore();
            drawPin(result.xCenter, imageHeight - result.yCenter, 'HOME CENTER');
        },
        error: function (results) {
            HideLoader();
            alert(JSON.stringify(results));
        }
    });
}

function Forward() {
    $("#TableSelect").val('CurrentLocation');
    var list = gPaths[gCurrentPathId];
    if (gCurrentPathIndex < list.length - 1) {
        gCurrentPathIndex++;
        var o = list[gCurrentPathIndex];
        var x = o.x;
        var y = imageHeight - o.y;
        var localDate = new Date(o.timestamp);
        drawPin(x, y, localDate);
        // ctx.beginPath();
        // ctx.fillRect(x, y, 2, 2);
        // ctx.stroke();

        // ctx.closePath();
        // ctx.fillStyle = "red";
        // ctx.fill();
        // if (gLastX > 0) {
        //     ctx.beginPath();
        //     ctx.moveTo(gLastX, gLastY);
        //     ctx.lineTo(x, y);
        //     ctx.stroke();
        // }
        if (gLastX > 0) {
            ctx.beginPath();
            ctx.moveTo(gLastX, gLastY);
            ctx.strokeStyle = '#ff0000';
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        gLastX = x;
        gLastY = y;

        $("#Message").empty();
        var t = gCurrentPathIndex;
        var h2 = '<h4>EPC: ' + o.id + ', SKU: ' + o.productId + ', Name: ' + o.name + ' - ' + o.timestamp + ' Step ' + t + ' of ' + list.length + ' in ' + o.regionName + ' ' + o.x + ',' + o.y + '</h4>';
        $(".IsSelect").removeClass('RedClass');

        $("#IsDepartureSelect").val(o.isDeparture);
        if (o.isDeparture === 1 || o.isDeparture === 0) {
            $("#IsDepartureSelect").addClass('RedClass');
        }
        $("#IsExitSelect").val(o.isExit);
        if (o.isExit === 1 || o.isExit === '1') {
            $("#IsExitSelect").addClass('RedClass');
        }
        $("#IsGhostSelect").val(o.isGhost);
        if (o.isGhost === 1 || o.isGhost === '1') {
            $("#IsGhostSelect").addClass('RedClass');
        }
        $("#IsMissingSelect").val(o.isMissing);
        if (o.isMissing === 1 || o.isMissing === '1') {
            $("#IsMissingSelect").addClass('RedClass');
        }
        $("#IsMoveSelect").val(o.isMove);
        if (o.isMove === 1 || o.isMove === '1') {
            $("#IsMoveSelect").addClass('RedClass');
        }
        $("#IsRegionSelect").val(o.isRegion);
        if (o.isRegion === 1 || o.isRegion === '1') {
            $("#IsRegionSelect").addClass('RedClass');
        }
        $("#IsValidSelect").val(o.isValid);
        if (o.isValid === 1 || o.isValid === '1') {
            $("#IsValidSelect").addClass('RedClass');
        }
        $("#IsSoldSelect").val(o.isSold);
        if (o.isSold === 1 || o.isSold === '1') {
            $("#IsSoldSelect").addClass('RedClass');
        }
        $("#Message").append(h2);
        $("#Message").show();

    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gLastX = 0;
        gLastY = 0;
        var index = gPathKeys.indexOf(gCurrentPathId);
        var lastDate = null;
        gCurrentPathIndex = -1;
        if (index < gPathKeys.length - 1) {
            index++;
            gCurrentPathId = gPathKeys[index];
            $("#EpcSelect").val(gCurrentPathId);
        } else {
            gCurrentPathId = gPathKeys[0];
            gCurrentPathIndex = -1;
            $("#EpcSelect").val(gCurrentPathId);
        }
    }
}

function ClearIsFields() {
    $(".IsSelect").removeClass('RedClass');
    $(".IsSelect").val('');
}

function ChangeEpcView() {
    var ids = $("#EpcSelect").val();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gLastX = 0;
    gLastY = 0;
    lastDate = null;
    if (ids.length === 1) {
        lastDate = null;
        gCurrentPathId = ids[0];
        gCurrentPathIndex = -1;
        Forward();
    } else if (ids.length > 1) {
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var list = gPaths[id];
            for (var j = 0; j < list.length; j++) {
                var o = list[gCurrentPathIndex];
                var x = o.x;
                var y = imageHeight - o.y;
                drawPin(x, y, '');
                gLastX = x;
                gLastY = y;

                $("#Message").empty();
                var t = gCurrentPathIndex;
                var h2 = '<h4>' + o.name + ' - ' + o.timestamp + ' Step ' + t + ' of ' + list.length + ' ' + o.x + ',' + o.y + '</h4>';
                $("#Message").append(h2);
            }
        }
    }
}

function LoadJustThisEpc() {
    ShowLoader();
    var obj = new Object();
    obj.storeId = $("#StoreSelect option:selected").val();
    obj.table = 'EpcMoveView';
    $("#TableSelect").val(obj.table);
    obj.id = gCurrentPathId;
    $.ajax({
        type: "PUT",
        url: "/api/points/list",
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

function ShowAll() {
    ShowLoader();
    gPoints = new Object();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var keyList = [];
    for (var i = 0; i < gList.length; i++) {
        var o = gList[i];
        var x = o.x;
        var y = imageHeight - o.y;
        var tempId = x + '_' + y;
        if (gPoints[tempId] === undefined) {
            gPoints[tempId] = new Object();
            gPoints[tempId]['x'] = x;
            gPoints[tempId]['y'] = y;
            gPoints[tempId]['count'] = 0;
            keyList.push(tempId);
        } else {
            gPoints[tempId]['count'] = gPoints[tempId]['count'] + 1;
        }

        drawPin(x, y, '');
        gLastX = x;
        gLastY = y;
    }
    console.log(JSON.stringify(gPoints));
    for (var i = 0; i < keyList.length; i++) {
        var k = keyList[i];
        var move = 5;
        var x0 = gPoints[k]['x'] - 4;
        var y0 = gPoints[k]['y'] - 4;
        var x1 = x0 + 2 * move;
        var y1 = y0 + 2 * move;
        var currentX = x0;
        var currentY = y0;
        var movePath = 0;
        for (var j = 0; j < gPoints[k]['count'] - 1; j++) {
            if (movePath === 0) {
                //Means going right from last current point
                currentX = currentX + move;
                currentY = currentY;
                if (currentX >= x1) {
                    movePath = 1;
                }
            } else if (movePath === 1) {
                //Means going up right arm
                currentX = currentX;
                currentY = currentY + move;
                if (currentY >= y1) {
                    movePath = 2;
                }
            } else if (movePath === 2) {
                //Means going left on top
                currentX = currentX - move;
                currentY = currentY;
                if (currentX <= x0) {
                    movePath = 3;
                }
            } else if (movePath === 3) {
                currentX = currentX;
                currentY = currentY - move;
                if (currentY <= y0) {
                    x0 = x0 - move;
                    y0 = y0 - move;
                    x1 = x1 + move;
                    y1 = y1 + move;
                    currentX = x0;
                    currentY = y0;
                    movePath = 0;
                }
            }
            drawPin(currentX, currentY, '');
        }

    }
    var h2 = '<h4>Show all</h4>';

    $("#Message").empty();
    $("#Message").append(h2);

    HideLoader();
}

function TESTME() {
    var v = $("#IsExit").is(":checked");
    alert(v);
    $("#IsRegion").prop('checked', true);
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
        HideLoader();
    } else {
        $(".EpcStuff").hide();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function SwitchMap() {
    if ($("#StoreSelect option:selected").val() !== '1597647a-7056-3fe9-94c1-ae5c9d16d69b') {
        window.location.href = '/map2';
    }
}

function drawPin(x, y, localDate) {
    var label = '';
    if (localDate !== undefined && localDate !== '') {
        try {
            var diff = localDate.getTime() - lastDate.getTime();
            label = "+" + Math.round(diff / 60000) + " minutes";
        } catch (ex) {
            label = localDate;
        }
        lastDate = localDate;
    }
    ctx.font = "12px Arial";
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.fillText(label, x, y + 10);
    ctx.restore();
}