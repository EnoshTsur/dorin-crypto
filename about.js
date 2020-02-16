function createAbout() {
    const wrapDiv = $("<div class = card bg-dark>");
    const imgDiv = $("<div class = card-img-overlay>");
    const img = $("<img class = card-img style = 'opacity: 0.6'>");
    const title = $("<h5 class = card-title>DORIN YAFE</h5>");
    const para1 = $("<p class = card-text style = 'text-align: center'>Hi, I am dorin.</p>");
    const para2 = $("<p class = card-text style = 'text-align: center'>Hope you all enjoyed my Crypto App.</p>");
    const para3 = $("<p class = card-text style = 'text-align: center'>I worked very hard in order making you experience as conviniant as possiable.</p>");
    img.attr("src", "assets/WhatsApp Image 2020-02-02 at 18.41.16.jpeg");
    img.css("height", "60rem");
    imgDiv.append(title, para1, para2, para3);
    wrapDiv.append(img, imgDiv);
    $("#container").append(wrapDiv);
};

