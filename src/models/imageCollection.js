class ImageCollection extends Array{
        constructor(args) { 
            super(); //Instantiate the array

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

    findImageByName(name){
        return super.filter( x => x.name === name)[0];
   }

}

module.exports = ImageCollection;