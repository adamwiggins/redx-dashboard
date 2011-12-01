var dashOpts = {
  chartRangeMin: 0,
  chartRangeMax: 60,
  spotColor: false,
  minSpotColor: false,
  maxSpotColor: false,
  lineWidth: 2,
  width: 400,
  height: 180
};

function dashUpdate() {
  console.log("update")
  jQuery.ajax({
    url: "/stats",
    type: "GET",
    dataType: "json",
    success: function(data, status, xhr) {
      console.log(data);
      console.log($("request-rate-sparkline"));
      $("#request-rate-sparkline").sparkline(data, dashOpts);
    },
    complete: function(xhr, status) {
      setTimeout(dashUpdate, 500);
    }
  });
}

$(document).ready(dashUpdate);
