var searchMenu = 0;
const aside = document.querySelector("aside");

function searchDiv(){
    if(searchMenu==0){
        searchMenu++;
        aside.style = "left:0vw;transition:1s ease-in-out;";
        $('#menu').attr('class', 'fas fa-angle-double-left fa-2x');
    }else{
        searchMenu--;
        aside.style = "left:-50vw;transition:1s ease-in-out;";
        $('#menu').attr('class', 'fas fa-bars fa-2x');
    }
}

function addPoint(){
    console.log( "pageX: " + event.pageX + ", pageY: " + event.pageY );
    var html = "";
    html+= "<li class='point' style='top:"+event.pageY+"px; left:"+event.pageX+"px;'></li>";
    $(".pointContainer").append(html);
}