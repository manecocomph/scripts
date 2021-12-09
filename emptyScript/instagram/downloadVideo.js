if($("#insVideo").length < 1) {
    $("#playGround").append("<div id='insVideo' style='margin:8px;'></div>");
} else {
    $("#insVideo").html("");
}

$("#insVideo").append("<input id='insVideoUrl' type='text' style='width:800px'/>");
$("#insVideo").append("<button id='insVideoDownloadBtn' class='btn btn-sm btn-default' style='margin:0 8px;'>Download</button>");

$("#insVideoDownloadBtn").click(function(){
  const url = $("#insVideoUrl").val();
  $.get(url, function(rsps){
      const videoUrlEx = /video_url\"\:\"(.+?)\",\"video_view_count/g;
      let match = null;
      let videoUrl = null;
      while (null !== (match = videoUrlEx.exec(rsps))) {
          videoUrl = match[1].replaceAll("\\u0026", "&");
          console.log(videoUrl);
          chrome.downloads.download({url:videoUrl},function(downloadId){
                console.log("download begin, the download id is:" + downloadId);
          });
      } 
  });
});
