;(function($) {

  $.fn.megaNav = function(options) {
    if (!options.vid){
      console.log("No vendor given");
      return;
    };

    var
      cache     = {},
      mustaches = Avetti.mustaches,
      partials  = Avetti.partials;

    this.mouseenter(function() {
      $("#megaNav-contain").show();
    });

    this.mouseleave(function () {
      $("#megaNav-contain").hide();
      $("#megaNav-panel").hide();
    });

    this.find("nav li a").mouseover(function(event){
      var cid = $(this).attr("data-cid");

      if (!cid){
        return;
      }

      if (cache[cid]){
        renderSubCats(cid);

      }
      else{
        var url = "subcat.ajx"
          + "?vid=" + options.vid
          + "&cid=" + cid;

        $.getJSON(url, function( data ){
          data = processCatergory(data);

          cache[cid] = Mustache.render(mustaches.megaNav_category, data, partials);

          renderSubCats(cid);

        });
      }
    });

    function renderSubCats(cid) {
      $("#megaNav-panel").html(cache[cid]);
      $("#megaNav-panel").show();

      $("div[name='meganav']").hide();
      $("#"+cid).show();
      if($("#"+cid).attr('name') =="hidemeganav"){
      $("#megaNav-panel").hide();
}

    };


    function processCatergory(data){
      return {
        name:        data.name,
        cid:         data.cit,
        vid:         data.vid,
        position:    data.position,
        description: data.description,
        URL:         data.URL,

        properties:  processProperties(data.properties),

        childs: data.childs.map(function(subcat){
          return processCatergory(subcat);
        })
      };
    }

    function processProperties(properties) {
      props = {};

      for (var index = properties.length - 1; index >= 0; index--) {
        var propname = properties[index].propname.toLowerCase();
        props[propname] = properties[index].propvalue;
      };

      return props;
    }
  };

} (jQuery));