/*global Vue*/
/*global axios*/
let app = new Vue({
  // bind it to the #root div in the DOM
  el: "#space",
  // provide data for bindings
  data: {
    api_key: "cYmdxev54qO8WIMvorEdhzEIUTnFS8tmqAHowzGz",
    base_url: "https://api.nasa.gov/",
    POD: {},
    date: "2018-08-01",
    rover: "curiosity",
    rover_photos: {},
    start_num: 0,
    current_photos: [],
    slideIndex:1,
  },
  created() {
    this.getPOD();
    this.getRoverPhotos();
    this.loadImages();
  },
  watch: {
    rover_photos(value, oldvalue) {
        this.loadImages();
    },
    start_num(value, oldvalue){
      console.log("here");
      this.loadImages();
    }
  },
  methods: {
    async getPOD(){
      const response = await axios.get(this.base_url + "planetary/apod?api_key=" + this.api_key);
        this.POD = {
          copyright: response.data.copyright,
          date: response.data.date,
          explanation: response.data.explanation,
          hdurl: response.data.hdurl,
          title: response.data.title,
        };
      console.log(this.POD);
    },
    async getRoverPhotos(){
        this.current_photos = [];
        console.log("here");
        console.log(this.date);
        console.log(this.date + 1);
        const response = await axios.get(this.base_url + "/mars-photos/api/v1/rovers/"+ this.rover + "/photos?earth_date="+ this.date + "&api_key=" + this.api_key);
        console.log("got response");
        console.log(response);
        this.rover_photos = response.data.photos;
    },
    async get10Photos(){
      this.current_photos = [];
      let end_num
      if (this.start_num + 10 > this.rover_photos.length){
        end_num = this.rover_photos.length;
      }
      else{
        end_num = this.start_num + 10;
      }
      console.log(this.start_num);
      console.log(end_num);
      let i = this.start_num;
      while (i != end_num){
        console.log(i);
        this.current_photos.push({
          camera: this.rover_photos[i].camera,
          earth_date: this.rover_photos[i].earth_date,
          id: this.rover_photos[i].id,
          url: this.rover_photos[i].img_src,
          rover: this.rover_photos[i].rover,
          sol: this.rover_photos[i].sol,
          num: i + 1,
        })
        i++;
      }
      console.log("showing 1");
    },
    async getNext10(){
      this.start_num += 10;
      if (this.start_num > this.rover_photos.length){
        this.start_num = 0;
      }
      console.log(this.start_num);
    },
    async loadImages(){
      if (this.rover_photos.length > 0){
        await this.get10Photos();
        this.showSlides(1);
        document.getElementById("slideshow").innerHTML = "";
      }
      else{
        document.getElementById("slideshow").innerHTML = "No images on this date<br>Examples of Dates With Images With Curiosity:<br>08-01-2018<br>08-01-2015";
      }
    },
    // Next/previous controls
    async plusSlides(n) {
      this.showSlides(this.slideIndex += n);
    },
    
    // Thumbnail image controls
    async currentSlide(n) {
      this.showSlides(this.slideIndex = n);
    },
    
    async showSlides(n) {
      var i;
      if(n > 10){
        n -= 10;
        this.slideIndex -= 10;
      }
      var slides = document.getElementsByClassName("mySlides");
      console.log("slides " + slides.length);
      console.log("n " + n);
      var dots = document.getElementsByClassName("dot");
      console.log(n);
      if (n > slides.length) {this.slideIndex = 1}
      if (n < 1) {this.slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
      }
      console.log("slideIndex " + this.slideIndex);
      slides[this.slideIndex-1].style.display = "block";
      dots[this.slideIndex-1].className += " active";
    },
  },
});
