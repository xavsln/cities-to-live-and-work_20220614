// alert('Hello World!');


// We define the cityList that will gather the data for each city collected from the API
let cityList = [];
// We define the endpoint to collect the first level of data for each city
let apiDataLevel1Url = 'https://api.teleport.org/api/urban_areas/';


// We create the function that will fetch the FIRST LEVEL of data from the API
function loadListLevel1(){
  return fetch(apiDataLevel1Url).then(function(response){
    return response.json();

  }).then(function(json){
    // console.log(json);
    // console.log(json._links);
    console.log(json["_links"]["ua:item"]);   // Need to use the bracket notation to access ua.item oherwise it would not recognize the colon when using the dot notation

    // json["_links"]["ua:item"].forEach(function(item){
    //   console.log(item);
    // });

    json["_links"]["ua:item"].forEach(function(item){
      let city = {
        cityName: item.name,
        cityDetailsUrl: item.href
      }
      add(city);
    })

  }).catch(function(e){
    console.error(e);
  })
}

// We define a function that will load the details LEVEL 2, ie. the details of each city that can be found from the cityDetailsUrl
function loadListLevel2(item){
  let cityUrl = item.cityDetailsUrl;
  return fetch(cityUrl).then(function(response){
    return response.json();
  }).then(function(details){
    console.log(details.teleport_city_url);
    item.teleportCityUrl = details.teleport_city_url;
    console.log(details["_links"]["ua:images"]["href"]);
    item.cityImagesUrl = details["_links"]["ua:images"]["href"];    // Use the bracket notation to access data otherwise there is an issue with the colon in the key
    console.log(details["_links"]["ua:scores"]["href"]);
    item.cityScoresUrl = details["_links"]["ua:scores"]["href"];    // Use the bracket notation to access data otherwise there is an issue with the colon in the key
  })
}


// We define a function that will load the details LEVEL 3 - To extract the images for each city
function loadListLevel3Images(item){
  let cityImgUrl = item.cityImagesUrl;
  console.log(cityImgUrl);

  let cityName = item.cityName;
  console.log(cityName);

  return fetch(cityImgUrl).then(function(response){
    return response.json();
  }).then(function(detailsImages){
    console.log(detailsImages["photos"][0]["image"]["mobile"]);
    item.cityImageMobile = detailsImages["photos"][0]["image"]["mobile"];
    console.log(detailsImages["photos"][0]["image"]["web"]);
    item.cityImageWeb = detailsImages["photos"][0]["image"]["web"];
  })

}

// We create a function that add each city Object fetch from the API to the cityList Array
function add(city){
  cityList.push(city);
}

// We load the initial list of data (ie. the level 1)
loadListLevel1();

console.log(cityList[49]);    // This will return undefined as the data is not fully fetch from the API
setTimeout(function(){        // To prevent this we would need to create implement AJAX or set a timer
  console.log(cityList[49])
}, 1200);

setTimeout(function(){        // To prevent this we would need to create implement AJAX or set a timer
  cityList.forEach((item, i) => {
    // console.log(item);
    loadListLevel2(item);
  });
  // console.log(loadListLevel2())
}, 1500);

setTimeout(function(){        // To prevent this we would need to create implement AJAX or set a timer
  cityList.forEach((item, i) => {
    // console.log(item);
    loadListLevel3Images(item);
  });
}, 2500);
