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
