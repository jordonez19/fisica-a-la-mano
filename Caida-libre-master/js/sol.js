function clearResult(){
  location.reload()
}

function resize () {
  document.querySelector("#content").viewBox.baseVal.x = -(window.innerWidth / 2);
  document.querySelector("#content").viewBox.baseVal.y = -(window.innerHeight / 2);
  document.querySelector("#content").viewBox.baseVal.width = window.innerWidth;
  document.querySelector("#content").viewBox.baseVal.height = window.innerHeight;
  document.querySelector("#content").style.height = window.innerHeight + "px";
  document.querySelector("#content").style.width = window.innerWidth + "px";
  document.querySelector(".content").style.height = window.innerHeight + "px";
  document.querySelector(".content").style.width = window.innerWidth + "px";
  document.querySelector("#suelo").y.baseVal.value = ((window.innerHeight/2) - window.innerHeight*0.05);
}

dibujar = function(datos){
  var _self = this;
  _self.datos = datos;
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var array = [['t', 'v', 'y']];
    fracciones = _self.datos.t/5;
    for (var i = 0; i <= 5; i++) {
      array.push(
        [
          fracciones*i,
          caida({t:(fracciones*i)}).vf(),
          caida({t:(fracciones*i)}).d()
        ]);
    }
    var data = google.visualization.arrayToDataTable(array);

    var options = {
      title: 'Distancia y Velocidad vs Tiempo',
      hAxis: {title: 't',  titleTextStyle: {color: '#111'}},
      vAxis: {title: 'y, v', minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }
}

animar = function (datos) {
  var _self = this;
  _self.datos = datos;
  _self.datos.t_actual = 0;

  function init() {
    $("#vf").html(_self.datos.vf);
    $("#cuerpo").velocity({cy: ($("#suelo").attr("y")-$("#cuerpo").attr("r")), cx: $("#cuerpo").attr("cx")}, (_self.datos.t*1000));
  }

  init();
  return _self;
}

caida = function (datos) {
  var _self = this;
  _self.datos = datos;
  function init(){
    _self.datos.a = 274;
    _self.datos.vo = 0;
    if (!_self.datos.d) {
      _self.datos.d = _self.d();
    }
    if (!_self.datos.t) {
      _self.datos.t = _self.t();
    }
    if (!_self.datos.vf) {
      _self.datos.vf = _self.vf();
    }
    animar(_self.datos);
  }
  _self.vf = function (){
    return (274*(_self.datos.t));
  }
  _self.d = function (){
    return ((0.5*(274)*(_self.datos.t*_self.datos.t)));
  }
  _self.t = function (){
    return (Math.sqrt((2*_self.datos.d)/274));
  }
  init();
  return _self;
}

$("#iniciar").click(function(){
  if ($("#tiempo").val() && $("#distancia").val()) {
    alert("Ingrese solo uno de los valores");
    return 0;
  }
  if ($("#distancia").val()) {
    var datos = caida({d:$("#distancia").val()});
    $("#tiempo").val(datos.datos.t);
    setTimeout(function(){
      dibujar(datos.datos);
    }, (datos.datos.t*1000));
    return;
  }
  if ($("#tiempo").val()) {
    var datos = caida({t:$("#tiempo").val()});
    $("#distancia").val(datos.datos.d);
    setTimeout(function(){
      dibujar(datos.datos);
    }, (datos.datos.t*1000));
    dibujar(datos.datos);
  }
});

$("#distancia").on("input", function(e){
  $("#tiempo")[0].disabled = true;
  $("#tiempo").val("");
  if (!$("#distancia").val()) {
    $("#tiempo")[0].disabled = false;
  }
});

$("#tiempo").on("input", function(e){
  $("#distancia")[0].disabled = true;
  $("#distancia").val("");
  if (!$("#tiempo").val()) {
    $("#distancia")[0].disabled = false;
  }
});

$("#altura").on("input", function(){
  $("#distancia").val($("#altura").val());
  $("#distancia").trigger("input", $("#altura").val());
  $("#distancia")[0].disabled = false;
});

window.onresize = resize;
resize();

