define(['jquery',
        'underscore',
        'backbone',
        'models/Still',
        "utils/GeoUtils"
        ],
function($, _, Backbone,
                Still,
                GeoUtils){

  var Stills = Backbone.Collection.extend({

    model: Still,

    init:function(params) {
        var self = this;

        self.nbImages = params.nbStills;
        self.pathToStills = params.wayName;
        self.stillsPath = params.wayPath;

        self.nbImgLoaded = 0;
        self.percentageLoaded = 0;
        self.stopLoading = false;
        self.stillLoaded = [];

        self.queueToLoad = [];
        self.numOpenRequests = 0;
    },

    fetch: function() {
        var self = this;

        var accurate = 5;
        // var bearingTemp = 0;

        // TODO : better progressive loading, populate first frames first
        $.each([20,10,5,2,1], function(index, val) {

            for (var i = 0; i < self.nbImages; i+=val) {
            // for (var i = 0; i < self.nbImages; i++) {

                if(self.stopLoading) {
                    return;
                }

                //If still isn't yet loaded
                if(self.get(i) === undefined) {

                    // if(i < self.nbImages - 1) {
                    //     bearingTemp = GeoUtils.getBearing(self.stillsPath[i],self.stillsPath[i+1]);
                    // }

                    var still = new Still({
                        id:i,
                        // srcLowRes:"http://tdurand.github.io/scrollingvideo/"+self.pathToStills+"way"+self.lpad(i, 3)+".jpg",
                        // srcHighRes:"http://tdurand.github.io/scrollingvideo/"+self.pathToStills+"way"+self.lpad(i, 3)+".jpg"
                        // srcLowRes:"https://s3.amazonaws.com/pregonerosdemedellin/data/"+self.pathToStills+"/lowres/way"+self.lpad(i, 3)+".jpg",
                        // srcHighRes:"https://s3.amazonaws.com/pregonerosdemedellin/data/"+self.pathToStills+"/highres/way"+self.lpad(i, 3)+".jpg"
                        srcLowRes:"data/"+self.pathToStills+"/lowres/way"+self.lpad(i, 3)+".jpg",
                        srcHighRes:"data/"+self.pathToStills+"/highres/way"+self.lpad(i, 3)+".jpg"
                        // srcHighRes:"http://static2187.ovhcloudcdn.com/v1/AUTH_4ee2db5ea9c947b39eb3087c80294487/default/"+self.pathToStills+"/highres/way"+self.lpad(i, 3)+".jpg"
                        // srcLowRes:"http://maps.googleapis.com/maps/api/streetview?size=500x280&location="+self.stillsPath[i][0]+","+self.stillsPath[i][1]+"&fov=180&heading="+bearingTemp+"&pitch=5&key=AIzaSyBcQbYugBpXYmTvHVqBmmTa6EM0PHZZ28k",
                        // srcHighRes:"http://maps.googleapis.com/maps/api/streetview?size=500x280&location="+self.stillsPath[i][0]+","+self.stillsPath[i][1]+"&fov=180&heading="+bearingTemp+"&pitch=5&key=AIzaSyBcQbYugBpXYmTvHVqBmmTa6EM0PHZZ28k"

                    });

                    still.on("imgloaded", function() {
                        this.loaded = true;
                        self.stillLoaded.push(this.id);
                        self.nbImgLoaded++;
                        self.numOpenRequests--;
                        self.percentageLoaded = Math.floor(self.nbImgLoaded*accurate/(self.nbImages+1)*100);
                        self.trigger("updatePercentageLoaded");

                        if(self.nbImgLoaded == parseInt(self.nbImages/accurate,10)) {
                            self.trigger("loadingFinished");
                        }

                        if(self.nbImgLoaded == parseInt(self.nbImages,10)) {
                            self.trigger("loadingFinishedCompletely");
                        }
                    });

                    self.add(still);
                    self.queueToLoad.push(still);

                }
                
            }
             
        });
    
        self.intervalFetching = setInterval(function() {
            self.processQueue();
            if(self.queueToLoad.length === 0) {
                clearInterval(self.intervalFetching);
            }
        },100);
    },

    processQueue: function() {
        var self = this;

        while(self.numOpenRequests < 7 && self.queueToLoad.length > 0)
        {
            var stillToLoad = self.queueToLoad.shift();
            stillToLoad.pull();
            self.numOpenRequests++;
        }
    },

    // addPriorityStillToQueue: function(still) {
    //     self.queueToLoad.unshift(still);
    // },

    lpad: function(value, padding) {
        var zeroes = new Array(padding+1).join("0");
        return (zeroes + value).slice(-padding);
    },

    clear: function() {
        self = this;

        window.stop();
        self.stopLoading = true;
        setTimeout(function() {
            self.stopLoading = false;
        },500);
        
        _.each(self.models,function(still) {
            self.remove(still);
            //still.clear();
        });

        self.stillLoaded = [];
        self.nbImgLoaded = 0;
        self.percentageLoaded = 0;
    }

    

  });

  return Stills;
  
});


