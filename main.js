let SHEET_ID = '1YjK5RUVi64E04B-v76ChTenS1sWToAECQiw6OqKWCLc';
let SHEET_TITLE = 'Menu';
let SHEET_RANGE = 'A:G'

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);

function fetchMenu(divID) {
    fetch(FULL_URL)
        .then(res => res.text())
        .then(rep => {        
            let data = JSON.parse(rep.substr(47).slice(0, -2));
            let card_container = document.getElementById(divID);

            // Explicitly set grid layout on the container
            card_container.style.display = 'grid';
            card_container.style.gridTemplateColumns = 'repeat(2, 1fr)';
            card_container.style.gap = '20px';

            let num_row = data.table.rows.length;

            for (let i = 0; i < num_row; i++) {
                let NewCard = document.createElement('div');
                NewCard.id = "card" + i;
                NewCard.className = "cards";

                NewCard.addEventListener('click', () => showFoodid(i, data));

                let food_name = document.createElement('div');
                food_name.className = "food-name";
                food_name.textContent = data.table.rows[i].c[1].v || "Unnamed Food";

                let price = document.createElement('p');
                price.textContent = data.table.rows[i].c[3].v || "Price not Available";
                price.type = "text";
                price.className = "text-box";
                price.placeholder = "Price";
                price.value = data.table.rows[i].c[3].v || "0.00";

                let detail = document.createElement('p');
                detail.textContent = data.table.rows[i].c[5].v || "No Details";
                detail.className = "text-box";

                let picture = document.createElement("img");
                picture.src = 'sources/images/chickenlollipop.jpg'; 
                picture.alt = data.table.rows[i].c[1].v || "Food Image";

                let orderButton = document.createElement("button");
                orderButton.className = "order-button";
                orderButton.textContent = "Order Now";

                NewCard.appendChild(picture);
                NewCard.appendChild(food_name);
                NewCard.appendChild(price);
                NewCard.appendChild(detail);
                NewCard.appendChild(orderButton);

                card_container.appendChild(NewCard);
            }
        });
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
    let THEFOODORDERS = [];
    console.log('Light limit:', light_limit);
    console.log('Heavy limit:', heavy_limit);
    console.log('Div ID:', divID);

    // Handle light category
    if (light_limit > -1) {
        const lightCheckboxes = document.querySelectorAll(`input[type="checkbox"][name="light"]`);
        let checkedLightCheckboxes = Array.from(lightCheckboxes).filter(cb => cb.checked);
        const lightFoodOrders = [];
        
        checkedLightCheckboxes.forEach(cb => {
            const quantityInput = cb.parentElement.querySelector('input[type="number"]'); // Find the corresponding quantity input
            const quantity = parseInt(quantityInput.value, 10) || 0; // Parse the quantity (default to 0 if invalid)

            // Add the checkbox value to the array `quantity` times
            for (let i = 0; i < quantity; i++) {
                lightFoodOrders.push(cb.value);
            }
        });

        const lightCheckedCount = lightFoodOrders.length;

        if (lightCheckedCount < light_limit) {
            alert(`You need to select at least ${light_limit} "light" options. Currently selected: ${lightCheckedCount}`);
            checkedLightCheckboxes = [];
        } else {
            console.log(`Light selection is valid. Currently selected: ${lightCheckedCount}`);
            console.log('Selected Values:', lightFoodOrders);
            THEFOODORDERS = THEFOODORDERS.concat(lightFoodOrders);
        }
    }
    
    // Handle light category
    if (heavy_limit > -1) {
        const heavyCheckboxes = document.querySelectorAll(`input[type="checkbox"][name="heavy"]`);
        let checkedHeavyCheckboxes = Array.from(heavyCheckboxes).filter(cb => cb.checked);
        const heavyFoodOrders = [];
        
        checkedHeavyCheckboxes.forEach(cb => {
            const HeavyquantityInput = cb.parentElement.querySelector('input[type="number"]'); // Find the corresponding quantity input
            const quantity = parseInt(HeavyquantityInput.value, 10) || 0; // Parse the quantity (default to 0 if invalid)

            // Add the checkbox value to the array `quantity` times
            for (let i = 0; i < quantity; i++) {
                heavyFoodOrders.push(cb.value);
            }
        });

        const heavyCheckedCount = heavyFoodOrders.length;

        if (heavyCheckedCount < heavy_limit) {
            alert(`You need to select at least ${heavy_limit} "heavy" options. Currently selected: ${heavyCheckedCount}`);
            checkedHeavyCheckboxes = [];
        } else {
            console.log(`Heavy selection is valid. Currently selected: ${heavyCheckedCount}`);
            console.log('Selected Values:', heavyFoodOrders);
            THEFOODORDERS = THEFOODORDERS.concat(heavyFoodOrders);
        }
    }

    console.log('Final Food Orders:', THEFOODORDERS.join(', ')); 
}
>>>>>>> 738babee068c700584a8fdf90391a58bd870756e
