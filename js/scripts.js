// Wrap the cityList inside an IIFE

const cityRepository = (function() {
  // We define/declare loadingMessage variable that will be used in showLoadingMessage() and hideLoadingMessage()
  const loadingMessage = $('#loading-message-placeholder');
  // We define the cityList that will gather the data for each city collected from the API
  let cityList = [];
  // We define the endpoint to collect the first level of data for each city
  const apiDataLevel1Url = 'https://api.teleport.org/api/urban_areas/';

  // We create the function that will fetch the FIRST LEVEL of data from the API
  function loadListLevel1() {
    return fetch(apiDataLevel1Url)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        // console.log(json);
        // console.log(json._links);
        console.log(json['_links']['ua:item']); // Need to use the bracket notation to access ua.item oherwise it would not recognize the colon when using the dot notation

        // json["_links"]["ua:item"].forEach(function(item){
        //   console.log(item);
        // });

        json['_links']['ua:item'].forEach(function(item) {
          let city = {
            cityName: item.name,
            cityDetailsUrl: item.href
          };
          add(city);
        });
        // hideLoadingMessage();
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function getAll() {
    showLoadingMessage();
    return cityList;
  }

  // We define a function that will load the details LEVEL 2, ie. the details of each city that can be found from the cityDetailsUrl
  function loadListLevel2(item) {
    let cityUrl = item.cityDetailsUrl;
    return fetch(cityUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(details) {
        console.log(details.teleport_city_url);
        item.teleportCityUrl = details.teleport_city_url;
        console.log(details['_links']['ua:images']['href']);
        item.cityImagesUrl = details['_links']['ua:images']['href']; // Use the bracket notation to access data otherwise there is an issue with the colon in the key
        console.log(details['_links']['ua:scores']['href']);
        item.cityScoresUrl = details['_links']['ua:scores']['href']; // Use the bracket notation to access data otherwise there is an issue with the colon in the key
      })
      .catch(function(e) {
        console.log(e);
      });
  }

  // We define a function that will load the details LEVEL 3 - To extract the images for each city
  function loadListLevel3Images(item) {
    console.log('item from the loadListLevel3Images', item);
    let cityImgUrl = item.cityImagesUrl;
    console.log(cityImgUrl);

    let cityName = item.cityName;
    console.log(cityName);

    return fetch(cityImgUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(detailsImages) {
        // console.log(detailsImages["photos"][0]["image"]["mobile"]);
        item.cityImageMobile = detailsImages['photos'][0]['image']['mobile'];
        // console.log(detailsImages["photos"][0]["image"]["web"]);
        item.cityImageWeb = detailsImages['photos'][0]['image']['web'];
      });
  }

  // We define a function that will load the details LEVEL 3 - To extract the Score Summary for each city
  function loadListLevel3ScoresSummary(item) {
    let cityScoresSummaryUrl = item.cityScoresUrl;
    console.log(cityScoresSummaryUrl);

    return fetch(cityScoresSummaryUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(detailsScores) {
        // console.log(detailsScores.summary);
        item.cityScoresSummary = detailsScores.summary;
      });
  }

  // We create a function that add each city Object fetch from the API to the cityList Array
  function add(city) {
    cityList.push(city);
  }

  function addListItem(city) {
    const listCity = $('.row-city-list');

    const listItem = $(
      '<div class=" col-6 col-md-4 col-lg-3 listItem" align="center"></div>'
    );

    // Create a button and add it to the DOM

    let buttonCity = $(
      '<button type="button" class="btn btn-light card mt-2" data-toggle="modal" data-target="#ModalCenter"><img src="' +
        city.cityImageMobile +
        '" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">' +
        city.cityName +
        '</h5></div></button>'
    );
    // let buttonCity = $('<button>Test</button>');

    listItem.append(buttonCity);
    listCity.append(listItem);

    // Add an event listener to our button element
    buttonCity.on('click', function() {
      showModal(city);
    });
  }

  function showModal(city) {
    const modalBody = $('.modal-body');
    const modalTitle = $('.modal-title');
    const modalFooter = $('.modal-header');

    modalTitle.empty();
    modalBody.empty();

    let nameElement = $('<h1>' + city.cityName + '</h1>');
    const imageElement = $(
      '<img class="modal-img mx-auto d-block" style="width:100%">'
    );
    imageElement.attr('src', city.cityImageWeb);
    let summaryElement = $(
      '<div class="modal-scores-summary">' + city.cityScoresSummary + '</div>'
    );

    let buttonLinkElement = $('#link-to-city-in-teleport');
    buttonLinkElement.attr('href', city.teleportCityUrl);

    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(summaryElement);
  }

  function filterList(inputValue) {
    const list = $('.listItem');
    console.log(list);
    list.each(function() {
      let item = $(this);
      let name = item.text().toLowerCase();
      if (name.startsWith(inputValue)) {
        item.show();
      } else {
        item.hide();
      }
    });
  }

  function showLoadingMessage() {
    loadingMessage.text('LOADING... Please wait...');
    loadingMessage.prepend(
      '<img id="loading-spinner-icon" src="./img/spinner.gif" />'
    );
  }

  function hideLoadingMessage() {
    loadingMessage.empty();
  }

  // cityRepository function will return either getAll, add etc... and then trigger the appropriate function
  return {
    // getAll: getAll, // if cityRepository.getAll() is selected then this will trigger the getAll(city) function
    getAll: getAll,
    loadListLevel1: loadListLevel1,
    loadListLevel2: loadListLevel2,
    add: add, // if cityRepository.add() is selected then this will trigger the add(city) function
    loadListLevel3Images: loadListLevel3Images,
    loadListLevel3ScoresSummary: loadListLevel3ScoresSummary,
    filterList: filterList,
    addListItem: addListItem,
    // showLoadingMessage: showLoadingMessage,
    hideLoadingMessage: hideLoadingMessage
  };
})(); // End of IIFE

// // We load the initial list of data (ie. the level 1)
// loadListLevel1();

// We load the initial list of data (ie. the level 1)
// Then for each city item of the list we load the Level 2 of data
cityRepository.loadListLevel1().then(function() {
  cityRepository.getAll().forEach(item => {
    // loadListLevel2(item);
    // console.log(item);
    cityRepository.loadListLevel2(item);
  });

  return cityRepository.getAll();
});
// .then(function(listOfCities) {
//   console.log("List of cities", listOfCities);
//   listOfCities.forEach(item => {
//     // console.log(item);
//     cityRepository.loadListLevel3Images(item);
//   });
// });

setTimeout(function() {
  // We create a timer to give time to fetch all data
  cityRepository.getAll().forEach((item, i) => {
    // console.log(item);
    cityRepository.loadListLevel3Images(item);
  });
}, 2500);

setTimeout(function() {
  // We create a timer to give time to fetch all data
  cityRepository.getAll().forEach((item, i) => {
    // console.log(item);
    cityRepository.loadListLevel3ScoresSummary(item);
  });
}, 4000);

setTimeout(function() {
  // We create a timer to give time to fetch all data
  cityRepository.getAll().forEach((item, i) => {
    // console.log(item);
    cityRepository.hideLoadingMessage();
    cityRepository.addListItem(item);
  });
}, 4500);

// Search functionality
$(document).ready(function() {
  search();
});

function search() {
  $('#user-search-input').on('keyup', function() {
    let inputValue = $('#user-search-input').val();
    cityRepository.filterList(inputValue);
  });
}

$('#user-search-input').on('keypress', function(event) {
  if (event.which == '13') {
    event.preventDefault(); // stop the default behavior of the form submit.
    search();
    $('#navbarToggler').removeClass('show');
  }
});
