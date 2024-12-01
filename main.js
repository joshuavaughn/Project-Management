let SHEET_ID = '1YjK5RUVi64E04B-v76ChTenS1sWToAECQiw6OqKWCLc';
let SHEET_TITLE = 'Menu';
let SHEET_RANGE = 'A:G'

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);

let sheetData = null;

function fetchData() {
    return fetch(FULL_URL)
        .then(res => res.text())
        .then(rep => {
            sheetData = JSON.parse(rep.substr(47).slice(0, -2));
            console.log("Data fetched successfully:", sheetData);
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        });
}

function searchMenu() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    const allCards = document.querySelectorAll(".cards");

    allCards.forEach(card => {
        const foodName = card.querySelector(".food-name").textContent.toLowerCase();

        if (foodName.includes(searchTerm)) {
            card.style.display = "block"; // Show the card if it matches
        } else {
            card.style.display = "none"; // Hide the card if it doesn't match
        }
    });
}

async function fetchMenu() {
    if (!sheetData) {
        await fetchData();
    }

    if (!sheetData) {
        console.error("Failed to load data.");
        return;
    }

    const categories = {
        seafood: "card-container-seafood",
        pork: "card-container-pork",
        chicken: "card-container-chicken",
        pancit: "card-container-pancit"
    };

    for (let i = 0; i < sheetData.table.rows.length; i++) {
        const row = sheetData.table.rows[i];
        const category = row.c[4].v.toLowerCase();
        const containerId = categories[category];
        if (!containerId) continue;

        const cardContainer = document.getElementById(containerId);
        const card = document.createElement("div");
        card.className = "cards";

        card.addEventListener('click', () => {
            localStorage.setItem("index", i); 
            window.location.href = "/order.html";
        });

        const foodName = document.createElement("div");
        foodName.className = "food-name";
        foodName.textContent = row.c[1].v || "Unnamed Food";

        const detail = document.createElement("p");
        detail.className = "text-box";
        detail.textContent = row.c[5].v || "Detail not Available";

        const picture = document.createElement("img");
        picture.src = "sources/images/chickenlollipop.jpg"; // Placeholder image
        picture.alt = row.c[1].v || "Food Image";

        card.appendChild(picture);
        card.appendChild(foodName);
        card.appendChild(detail);

        cardContainer.appendChild(card);
    }
}

async function setOrderPage() {
    // Retrieve the value stored in "index"
    let storedIndex = localStorage.getItem("index");

    // Log it to the console
    console.log("Stored index:", storedIndex);


    if (!sheetData) {
        await fetchData(); // Ensure data is fetched before proceeding
    }

    if (!sheetData) {
        console.error("Failed to load data.");
        return;
    }

    console.log("sheetdata:", sheetData);

    //food title
    document.getElementById("foodName").innerHTML = sheetData.table.rows[storedIndex].c[1].v;
    document.getElementById("price").innerHTML = `${sheetData.table.rows[storedIndex].c[3].v} 
    <span id="pertub">${sheetData.table.rows[storedIndex].c[5].v}</span>`;


    const heavy = document.getElementById('heavy');
    const light = document.getElementById('light');

    //options
    if ("light" == sheetData.table.rows[storedIndex].c[2].v) {
        heavy.style.display = 'none';
    }
    else if ("heavy" == sheetData.table.rows[storedIndex].c[2].v) {
        light.style.display = 'none';
    }
}

// Function to select a bundle
function selectBundle(bundle) {
    if ("light-1") {
        alert(`you ordered: ${bundle}`);
        localStorage.setItem("bundle", bundle); // Set "index" when this card is clicked
        window.location.href = "/bundle.html";
    }
    else if ("light-2") {
        alert(`you ordered: ${bundle}`);
        localStorage.setItem("bundle", bundle); // Set "index" when this card is clicked
        window.location.href = "/bundle.html";
    }
    else if ("heavy-1") {
        alert(`you ordered: ${bundle}`);
        localStorage.setItem("bundle", bundle); // Set "index" when this card is clicked
        window.location.href = "/bundle.html";
    }
    else if ("heavy-2") {
        alert(`you ordered: ${bundle}`);
        localStorage.setItem("bundle", bundle); // Set "index" when this card is clicked
        window.location.href = "/bundle.html";
    }
}

// ******** Bundle Page ******** //
function setBundlePage() {
    const bundle = localStorage.getItem("bundle");

    const heavy = document.getElementById('heavy');
    const light = document.getElementById('light');

    if (bundle == "light-1") {
        heavy.style.display = 'none';
        fetchCheckboxes("light", "light-checklist", 3);
    }
    else if (bundle == "light-2" ) {
        fetchCheckboxes("light", "light-checklist", 2);
        fetchCheckboxes("heavy", "heavy-checklist", 1);
    }
    else if (bundle == "heavy-1" ) {
        light.style.display = 'none';
        fetchCheckboxes("heavy", "heavy-checklist", 2);
    }
    else if (bundle == "heavy-2" ) {
        fetchCheckboxes("light", "light-checklist", 2);
        fetchCheckboxes("heavy", "heavy-checklist", 1);
    }
    else {
        console.log('"theBundle" is invalid');
    }

    console.log('your in the bundle function');
}

let light_limit = -1;
let heavy_limit = -1;

function fetchCheckboxes(section, divID, number) {
    fetch(FULL_URL)
    .then(res => res.text())
    .then(rep => {
        let data = JSON.parse(rep.substr(47).slice(0, -2));

        let checkboxContainer = document.getElementById(divID);
        checkboxContainer.innerHTML = "";

        data.table.rows.forEach((row, index) => {
        let rowSection = row.c[2]?.v || ""; 
        if (rowSection.toLowerCase() === section.toLowerCase()) {
            // Create a checkbox
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = section;
            checkbox.value = row.c[0]?.v || `Option ${index}`; 
            checkbox.id = `checkbox_${index}`;

            // Create a label for the checkbox
            let label = document.createElement('label');
            label.htmlFor = `checkbox_${index}`;
            label.textContent = row.c[1]?.v || `Option ${index}`;

            // Create a quantity input
            let quantityInput = document.createElement('input');
            quantityInput.type = "number";
            quantityInput.min = "0";
            quantityInput.value = "0"; // Default quantity
            quantityInput.id = `quantity_${index}`;
            quantityInput.className = "quantity-input"; // Add a class for targeting
            quantityInput.style.display = "none"; // Hide initially

            // Toggle visibility of quantity input based on checkbox state
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    quantityInput.style.display = "inline-block"; // Show when checked
                    // Reapply jQuery Nice Number to new inputs
                    quantityInput.value = parseInt(quantityInput.value, 10) + 1;
                    $(`#${quantityInput.id}`).niceNumber();
                } else {
                    quantityInput.style.display = "none"; // Hide when unchecked
                    quantityInput.value = "0"; // Reset value
                }
            });

            // Append elements to the container
            let wrapper = document.createElement('div');
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            wrapper.appendChild(quantityInput);
            checkboxContainer.appendChild(wrapper);
        }
        });


        console.log('Checklist displayed with quantities!');

        if (section.toLowerCase() === "light") {
            light_limit = number;
        } else {
            heavy_limit = number;
        }
    })
    .catch(err => console.error("Error fetching data:", err));
}

function submitOrder(divID) {
    console.log('Light limit:', light_limit);
    console.log('Heavy limit:', heavy_limit);
    console.log('Div ID:', divID);

    let finalOrder = [];

    // Handle light category
    if (light_limit > -1) {
        const lightCheckboxes = document.querySelectorAll(`input[type="checkbox"][name="light"]`);
        //makes a array of the orders
        let checkedLightCheckboxes = Array.from(lightCheckboxes).filter(cb => cb.checked);
        const lightFoodOrders = [];
        
        //consider the quantity of each checkbox
        checkedLightCheckboxes.forEach(cb => {
            const quantityInput = cb.parentElement.querySelector('input[type="number"]'); // Find the corresponding quantity input
            const quantity = parseInt(quantityInput.value, 10) || 0; // Parse the quantity (default to 0 if invalid)

            for (let i = 0; i < quantity; i++) {
                lightFoodOrders.push(cb.value);
            }
        });

        const lightCheckedCount = lightFoodOrders.length;

        //check for the minimum limit
        if (lightCheckedCount < light_limit) {
            alert(`You need to select at least ${light_limit} "light" options. Currently selected: ${lightCheckedCount}`);
            checkedLightCheckboxes = [];
        } else {
            console.log(`Light selection is valid. Currently selected: ${lightCheckedCount}`);
            console.log('Selected Values:', lightFoodOrders);
            finalOrder = finalOrder.concat(lightFoodOrders);
            localStorage.setItem("orders", finalOrder);
            window.location.href = "/orderlist.html";
        }
    }
    
    // Handle light category
    if (heavy_limit > -1) {
        const heavyCheckboxes = document.querySelectorAll(`input[type="checkbox"][name="heavy"]`);
        //makes a array of the orders
        let checkedHeavyCheckboxes = Array.from(heavyCheckboxes).filter(cb => cb.checked);
        const heavyFoodOrders = [];
        
        //consider the quantity of each checkbox
        checkedHeavyCheckboxes.forEach(cb => {
            const HeavyquantityInput = cb.parentElement.querySelector('input[type="number"]'); // Find the corresponding quantity input
            const quantity = parseInt(HeavyquantityInput.value, 10) || 0; // Parse the quantity (default to 0 if invalid)

            // Add the checkbox value to the array `quantity` times
            for (let i = 0; i < quantity; i++) {
                heavyFoodOrders.push(cb.value);
            }
        });

        const heavyCheckedCount = heavyFoodOrders.length;

        //check for the minimum limit
        if (heavyCheckedCount < heavy_limit) {
            alert(`You need to select at least ${heavy_limit} "heavy" options. Currently selected: ${heavyCheckedCount}`);
            checkedHeavyCheckboxes = [];
        } else {
            console.log(`Heavy selection is valid. Currently selected: ${heavyCheckedCount}`);
            console.log('Selected Values:', heavyFoodOrders);
            finalOrder = finalOrder.concat(heavyFoodOrders);
            localStorage.setItem("orders", finalOrder);
            window.location.href = "/orderlist.html";
        }
    }

    console.log('Final Food Orders:', finalOrder.join(', ')); 
}

// ******** Order List Page ******** //
function setOrderListPage() {
    const order = localStorage.getItem("orders");
    console.log(order);
}

function placeOrder() {
    window.location.href = "/checkout.html";
}