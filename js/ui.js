var util        = require('./util'),
template        = require('../template/basechart.html'),
jQuery          = require('jquery');


var ui = function(settings) {
  this.settings = settings;

  var init = function(data) {
    (function() {
      //hovering on an organ tissue level will merge the contained tissue expressions of the same level and show a tooltip --%>
      jQuery(settings.parentElem).find("div.expression").each(function() {
        var level = jQuery(this).attr('class').replace('expression', '').trim();
        var that = this;
        jQuery(this).hover(
              function() {
                  jQuery('<span/>', {
                      'class': 'tooltip',
                      'html': function() {
                        var tooltip = new Array();
                        jQuery(that).parent().find("div.expression."+level).each(function() {
                            tooltip.push(jQuery(this).find('span.tissue').text());
                        });
                        return tooltip.join('<br/>');
                      },
                      'click': function() {
                        jQuery(that).parent().click();
                      }
                  }).appendTo(that);
              },
              function() {
                  jQuery(this).find('span.tooltip').remove();
              }
        );
      });

      //table "sorting" --%>
      jQuery(settings.parentElem).find("table th.sortable").click(function() {
        var order = jQuery(this).attr('title');
        jQuery(settings.parentElem).find("div.table.active").removeClass('active').addClass('inactive');
        jQuery(settings.parentElem).find("div.table."+order).removeClass('inactive').addClass('active');
      });

      //determine the viewport size and 'resize' the chart --%>
      function sizeChart() {
        var width = jQuery(window).width();
        var ratio = Math.round(width / 160);
        if (ratio < 5) {
            ratio = 5;
        } else if (ratio > 10) {
            ratio = 10;
        }
        if (jQuery("#protein-atlas-displayer").hasClass('ape')) {
            jQuery("#protein-atlas-displayer").attr('class', 'ape scale-' + ratio);
        } else {
            jQuery("#protein-atlas-displayer").attr('class', 'staining scale-' + ratio);
        }
      };
      sizeChart();

      //resize chart on browser window resize --%>
      jQuery(window).resize(function() {
        if (this.resz) clearTimeout(this.resz);
        this.resz = setTimeout(function() {
          sizeChart();
        }, 500);
      });

      // switcher between tables this displayer haz
      jQuery(settings.parentElem).find("div.sidebar div.collection-of-collections div.switchers a").each(function(i) {
        jQuery(this).bind(
          "click",
          function(e) {
              // hide anyone (!) that is shown
              jQuery(settings.parentElem).find("div.sidebar div.collection-of-collections div.pane:visible").each(function(j) {
                jQuery(this).hide();
              });

              // show the one we want
              jQuery(settings.parentElem).find("div.sidebar div.collection-of-collections div." + jQuery(this).attr('title') + ".pane").show();

              // switchers all off
              jQuery(settings.parentElem).find("div.sidebar div.collection-of-collections div.switchers a.active").each(function(j) {
                jQuery(this).toggleClass('active');
              });

              // we are active
              jQuery(this).toggleClass('active');

              // no linking on my turf
              e.preventDefault();
          }
        );
      });
    })();

  };

    return {
      init: init
    }
};

module.exports = ui;
