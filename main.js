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