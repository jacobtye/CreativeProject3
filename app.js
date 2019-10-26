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
    curiosityMaxDate: "",
    oppurtunityMaxDate: "",
    spiritMaxDate: "",
  },
  created() {
    this.setup();
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
    async setup(){
      await this.getPOD();
      await this.maxDates();
      await this.getRoverPhotos();
      await this.loadImages();
    },
    async maxDates(){
      const response = await axios.get(this.base_url + "/mars-photos/api/v1/manifests/" + "curiosity" + "?&api_key=" + this.api_key);
      console.log(response);
      this.curiosityMaxDate = response.data.photo_manifest.max_date;
      console.log(this.curiosityMaxDate);
      const response2 = await axios.get(this.base_url + "/mars-photos/api/v1/manifests/" + "opportunity" + "?&api_key=" + this.api_key);
      console.log(response2);
      this.oppurtunityMaxDate = response2.data.photo_manifest.max_date;
      console.log(this.curiosityMaxDate);
      const response3 = await axios.get(this.base_url + "/mars-photos/api/v1/manifests/" + "spirit" + "?&api_key=" + this.api_key);
      console.log(response3);
      this.spiritMaxDate = response3.data.photo_manifest.max_date;
      console.log(this.curiosityMaxDate);
      this.date = this.curiosityMaxDate;
      
    },
    async getPOD(){
      const response = await axios.get(this.base_url + "planetary/apod?api_key=" + this.api_key);
        this.POD = {
          copyright: response.data.copyright,
          date: response.data.date,
          explanation: response.data.explanation,
          hdurl: response.data.hdurl,
          title: response.data.title,
        };
    },
    async getRoverPhotos(){
        this.current_photos = [];
        console.log("here");
        console.log(this.date);
        var newDate = new Date(this.date);
        newDate.setDate(newDate.getDate() + 1);
        console.log(newDate.toISOString().split('T')[0]);
        const response = await axios.get(this.base_url + "/mars-photos/api/v1/rovers/"+ this.rover + "/photos?earth_date="+ this.date + "&api_key=" + this.api_key);
        console.log("got response");
        console.log(response);
        this.rover_photos = response.data.photos;
        if(this.rover_photos.length === 0){
          alert("No images on " + this.date + "\nGetting most recent images.");
          if (this.rover === "curiosity"){
            this.date = this.curiosityMaxDate;
          }
          else if(this.rover === "opportunity"){
            this.date = this.oppurtunityMaxDate;
          }
          else{
            this.date = this.spiritMaxDate;
          }
          await this.getRoverPhotos();
        }
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
      let i = this.start_num;
      while (i != end_num){
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
      var dots = document.getElementsByClassName("dot");
      if (n > slides.length) {this.slideIndex = 1}
      if (n < 1) {this.slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active_2", "");
      }
      slides[this.slideIndex-1].style.display = "block";
      dots[this.slideIndex-1].className += " active_2";
    },
  },
});
