async function fetchData() {
  try {
    const response = await fetch(
      "https://api.mobilize.us/v1/organizations/33177/events?timeslot_start=gte_now&visibility=PUBLIC"
    );
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

//creating async block
(async () => {
  let data = await fetchData();
  const displayData = document.getElementById("display-data");
  function renderData(objects) {
    displayData.innerHTML = "";
    objects.forEach((element) => {
      let start_date = Math.min(
        ...element.timeslots.map((timeslots) => timeslots.start_date)
      );
      let end_date = Math.max(
        ...element.timeslots.map((timeslots) => timeslots.end_date)
      );
      const timestamp = start_date;
      const timestamp1 = end_date;
      start_date = moment.unix(timestamp).format("YYYY-MM-DD HH:mm");
      end_date = moment.unix(timestamp1).format("YYYY-MM-DD HH:mm");
      if (element.is_virtual) {
        template = `
  <div class="card col-sm-12 col-md-6 col-lg-4 card-border mb-4">
            <img class="card-img-top" src="${element.featured_image_url}" alt="Card image cap">
            <div class="card-body">
                <p>(${start_date}) (${end_date})</p>
                <h3 class="card-title title-bold">${element.title}</h3>
                <p class="card-text">${element.event_type}</p>
                <p>VIRTUAL</p>
                <a href="${element.browser_url}" class="btn btn-color">see details</a>
            </div>
        </div>
  `;
        displayData.innerHTML += template;
      } else {
        template = `
  <div class="card col-sm-12 col-md-6 col-lg-4 card-border mb-4">
            <img class="card-img-top" src="${element.featured_image_url}" alt="Card image cap">
            <div class="card-body">
                <p>(${start_date}) (${end_date})</p>
                <h3 class="card-title title-bold">${element.title}</h3>
                <p class="card-text">${element.event_type}</p>
                <p class="card-text">${element.location.venue}-
                ${element.location.locality}-
                ${element.location.region}-
               ${element.location.postal_code}</p>
                <a href="${element.browser_url}" class="btn btn-color">see details</a>
            </div>
        </div>
  `;
        displayData.innerHTML += template;
      }
    });
  }

  const itemsPerPage = 3;
  // the current page number
  let currentPage = 1;
  // Create page numbers
  const pageNumbers = document.getElementById("page-numbers");
  function numOfPages() {
    pageNumbers.innerHTML = "";
    // Get the cards
    const cards = document.getElementsByClassName("card");
    // calculate the number of pages required
    const totalPages = Math.ceil(cards.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("span");
      pageNumber.setAttribute("class", "numbers");
      pageNumber.innerHTML = i;
      pageNumber.addEventListener("click", function () {
        currentPage = i;
        showPage();
      });
      pageNumbers.appendChild(pageNumber);
    }
  }

  // Show only the cards for the current page
  function showPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const cards = document.getElementsByClassName("card");
    for (let i = 0; i < cards.length; i++) {
      if (i >= startIndex && i < endIndex) {
        cards[i].style.display = "block";
      } else {
        cards[i].style.display = "none";
      }
    }
    // show the active page number
    const pageNumbers = document.getElementById("page-numbers");
    for (let i = 0; i < pageNumbers.children.length; i++) {
      if (i + 1 === currentPage) {
        pageNumbers.children[i].classList.add("active");
      } else {
        pageNumbers.children[i].classList.remove("active");
      }
    }
  }

  var objects = data.data;

  renderData(objects);
  numOfPages();
  showPage();

  var check = document.querySelector(".check-input");
  var zipCode = document.querySelector(".zip-input");
  var filterPara = document.querySelector(".filter-para");
  let filterBtn = document.querySelector(".filterBtn");
  zipCode.addEventListener("change", function () {
    if (zipCode !== null) {
      if (check.checked) {
        check.checked = false;
        // console.log(check.checked);
      }
    }
  });

  check.addEventListener("change", function () {
    if (check.checked) {
      if (zipCode !== "") {
        zipCode.value = null;
      }
    }
  });

  filterBtn.addEventListener("click", function () {
    if (zipCode.value !== null && zipCode.value !== "") {
      filteredCards = objects.filter(
        (card) => card.location.postal_code === zipCode.value
      );
      if (filteredCards.length === 0) {
        filterPara.innerHTML =
          "Sorry, we did not find any events near you! Don't worry, you can always participate in one of the virtual events below. ";
        renderData(objects);
        numOfPages();
        showPage();
      } else {
        filterPara.innerHTML = "";
        renderData(filteredCards);
        numOfPages();
        showPage();
      }
    }
    if (check.checked) {
      filteredCards = objects.filter((card) => card.is_virtual === true);
      renderData(filteredCards);
      numOfPages();
      showPage();
    }
  });
  document
    .querySelector(".clear-filter")
    .addEventListener("click", function () {
      check.checked = false;
      zipCode.value = null;
      filterPara.innerHTML = "";
      renderData(objects);
      numOfPages();
      showPage();
    });
})();
