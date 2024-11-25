let SHEET_ID = '1YjK5RUVi64E04B-v76ChTenS1sWToAECQiw6OqKWCLc';
let SHEET_TITLE = 'Menu';
let SHEET_RANGE = 'A:G'

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);

function fetchMenu(divID) {
    fetch(FULL_URL)
    .then(res => res.text())
    .then(rep => {        
        let data = JSON.parse(rep.substr(47).slice(0,-2));

        let card_container = document.getElementById(divID);
        let num_row = data.table.rows.length;

        for (let i = 0; i < num_row; i++){
            let NewCard = document.createElement('div');
            NewCard.id = ("card" + i);
            NewCard.className = "cards";

            // Add click event listener
            NewCard.addEventListener('click', () => showFoodid(i, data, dat));

            let food_name = document.createElement('h1');
            food_name.textContent = data.table.rows[i].c[1].v || "Unamed Food";

            let price = document.createElement('p');
            price.textContent = data.table.rows[i].c[3].v || "Price not Available";

            let detail = document.createElement('p');
            detail.textContent = data.table.rows[i].c[5].v || "No Details";

            let picture = document.createElement("img");
            let imageUrl = 'sources/images/chickenlollipop.jpg';
            picture.src = imageUrl;

            //append elements to the new card
            NewCard.appendChild(picture);
            NewCard.appendChild(food_name);
            NewCard.appendChild(price);
            NewCard.appendChild(detail);

            //append new card to card container
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