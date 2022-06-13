// alert('Hello World!');


// We define the cityList that will gather the data for each city collected from the API
let cityList = [];
// We define the endpoint to collect the first level of data for each city
let apiDataLevel1Url = 'https://api.teleport.org/api/urban_areas/';


// We create the function that will fetch the data from the API
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
        name: item.name,
        detailsUrl: item.href
      }
      add(city);
    })

  }).catch(function(e){
    console.error(e);
  })
}

// We create a function that add each city Object fetch from the API to the cityList Array
function add(city){
  cityList.push(city);
}

console.log(loadListLevel1());

console.log(cityList[49]);    // This will return undefined as the data is not fully fetch from the API
setTimeout(function(){        // To prevent this we would need to create implement AJAX or set a timer
  console.log(cityList[49])
}, 1500);
