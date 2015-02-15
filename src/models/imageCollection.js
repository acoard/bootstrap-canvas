//imageHandlerCollection
/*

imageCollection.findByName('name')
imageCollection.addImage( imageHandler )

imageCollection[3] gets 4th item -- is this possible?
    I THINK IT IS USING SUPER!
    partially working, just constructor now


 */

class ImageCollection extends Array{
        constructor(args) { 
            super();

            if (args instanceof Array){
                for (let i = args.length-1; i >= 0; i--){   
                    this.addImage(args[i]);
                }    
            }
            
        }


    addImage(imageHandler){
        //todo - make it so it can handle an array, and it flattens it
        super.unshift(imageHandler);
    }

}

module.exports = ImageCollection;