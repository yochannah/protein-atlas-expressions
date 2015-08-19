var imjs      = require('imjs'),
_             = require('underscore'),
query         = require('./query'),
proexUi        = require('./ui'),
proexData      = require('./dataFormatter'),
strings       = require('./strings');

var proex = function(args){ //proex = disease + expression.
  var settings = _.extend({},args),
  dataFormatter = proexData(),
  data;

  function init() {
    if(validateParent()) {
      ui = new proexUi(settings);
      var mine = validateServiceRoot(),
      prom;
      if(prepQuery() && mine) {
        prom = mine.records(query).then(function(response) {
          console.debug('response:', response, 'settingsdata:', settings);
          if (response.length > 0) {
            try {
            data = dataFormatter.init(response);

            console.log(data);

            ui.init(data);

          } catch(e){console.error(e);}
          } else {
            ui.init(strings.user.noResults);
          }
        });
      }
    }
    return prom;
  };
  /**
   * Checks if there is indeed an element to attach to, and failing that tries a default.
   * @return {boolean} whether or not we've found an element to attach to. Allows you to cancel the xhr
   *                          since there's nowhere to render it to.
   */
  function validateParent() {
      if(!settings.parentElem){
        var defaultElem = document.getElementById('protein-gene-expression-atlas');
        if(defaultElem) {
          settings.parentElem = defaultElem;
          console.info(strings.dev.noParent.usingDefault);
        } else {
          console.error(strings.dev.noParent.noDefault);
          return false;
        }
      }
      return true;
    };
    function validateServiceRoot(){
      if(settings.service){
        return new imjs.Service({
          token: settings.service.token,
          root: settings.service.root,
          errorHandler : badServiceError
        });
      } else {
        throw new initError('noServiceUrl');
        return false;
      }

    }
    /**
     * Query comes from here: https://github.com/intermine/intermine/blob/beta/bio/webapp/src/org/intermine/bio/web/displayer/ProteinAtlasDisplayer.java
     * @return {[type]} [description]
     */
    function prepQuery() {
      if(settings.queryOn) {
        _.extend(query.where[0],settings.queryOn);
        return true;
      } else {

        throw new initError('noQueryData');
      }
    }

    /**
     * throw this error to console.error and display a user-facing error too
     * @param  {string} devMessage  this should be the key to a string in the strings.dev object.
     * @param  {[type]} userMessage optional - this should be the key to a string in the strings.user object. If not set, it will use the generic strings.user.noQuery message.
     */
    function initError(devMessage, userMessage){
      var um = userMessage ? userMessage : "noQueryData";
      ui.init(strings.user[um]);
      console.error(strings.dev[devMessage]);
    }
    /**
     * helper method for calling services from imjs. Useful because we can only pass a reference to a functtion (without args) to imjs, so passing initError wouldn't allow us to set the dev error message.
     * @return {[type]} [description]
     */
    function badServiceError(){
        throw new initError('badServiceUrl');
    }
    return init();
  }

//write tests in test.js

module.exports = proex;
