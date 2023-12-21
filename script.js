let firstName = document.getElementById("first_name")
let secondName = document.getElementById("second_name")
let email = document.getElementById("email")
let productName = document.getElementById("product_name")
let price = document.getElementById("price")
let amount = document.getElementById("amount")
let selectedCurrency = document.querySelector('input[name="currency"]:checked')


let validateName = (name) => {
    // Regulární výraz pro ověření, zda je jméno složené pouze z písmen
    let regex = /^[A-Za-zÁ-Žá-ž]+$/;
    return regex.test(name);
}

let validateEmail = (email) => {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

let changePrice = (event) => {
    price = event.target.value;
    price = parseFloat(price)
}

let changeAmount = (event) => {
    amount = event.target.value
    amount = parseInt(amount)
}

let changeCurrency = (event) => {
    selectedCurrency = event.target
}

let changeTotalPrice = (event) => {
    event.preventDefault()

    // Kontrola, zda jsou hodnoty platné
    if (isNaN(price) || price <= 0 || isNaN(amount) || amount <= 0) {
        // Skryje shrnutí objednávky a celkovou cenu
        document.getElementById("recap").textContent = "";
        document.getElementById("total_price").textContent = "";
        document.getElementById("total_price_dph").textContent = "";
        document.getElementById("euro").textContent = "";
        document.getElementById("summary").textContent = "";
        return;
    }


    let totalPrice = price*amount
    document.getElementById("recap").textContent = "Shrnutí objednávky:"
    document.getElementById("recap").style.borderBottom = "2px solid white"
    document.getElementById("product").textContent = `Produkt: ${productName.value}`
    document.getElementById("product_amount").textContent = `Počet kusů: ${amount} ks`
    document.getElementById("total_price").textContent = "Celková cena bez DPH: " + totalPrice.toFixed(2) + " Kč"
    document.getElementById("total_price_dph").textContent = "Celková cena včetně DPH: " + ((totalPrice + (21 * (totalPrice / 100))).toFixed(2)) + " Kč."
    
    let url = "https://data.kurzy.cz/json/meny/b[6]cb[vypsat].js"

    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error('Chyba při načítání dat.');
        }
        return response.text();
    })
    .then(data => {
        // Extrahujeme data z funkce vypsat()
        const start = data.indexOf('({') + 1;
        const end = data.lastIndexOf('})') + 1;
        const jsonData = data.slice(start, end);

        // Zpracujeme JSON data
        const parsedData = JSON.parse(jsonData);

        // Získáme hodnotu středního kurzu eura
        const currency = parsedData.kurzy[selectedCurrency.value].dev_stred;;
        // const currency = parsedData.kurzy.EUR.dev_stred;
        const priceInCurrency = ((totalPrice + (21 * (totalPrice / 100))) / currency).toFixed(2);
        // Vypíšeme hodnotu středního kurzu
        if (selectedCurrency.value == "EUR") {
            document.getElementById("euro").textContent = `Celková cena v eurech: ${priceInCurrency} eur (aktuální kurz eura: ${currency})`
            document.getElementById("euro").style.borderBottom = "2px solid white"
            document.getElementById("summary").textContent = "Pokud je vše v pořádku, klikněte na 'Odeslat objednávku'"
        } else if (selectedCurrency.value == "USD") {
            document.getElementById("euro").textContent = `Celková cena v dolarech: ${priceInCurrency} dolarů (aktuální kurz dolaru: ${currency})`
            document.getElementById("euro").style.borderBottom = "2px solid white"
            document.getElementById("summary").textContent = "Pokud je vše v pořádku, klikněte na 'Odeslat objednávku'"
        } else if (selectedCurrency.value == "GBP") {
            document.getElementById("euro").textContent = `Celková cena v librách: ${priceInCurrency} liber (aktuální kurz libry: ${currency})`
            document.getElementById("euro").style.borderBottom = "2px solid white"
            document.getElementById("summary").textContent = "Pokud je vše v pořádku, klikněte na 'Odeslat objednávku'"
        }

        let submitBtn = document.getElementById("submitBtn");

        // Zobrazení tlačítka po výpočtu celkové ceny
        submitBtn.style.display = "block";
        
    })
    .catch(error => {
        console.error('Chyba:', error);
    });
} 
        
let sendOrder = (event) => {
    event.preventDefault()

    if (firstName.value == "") {
        alert("Vyplňte prosím jméno.")
        return
    } else if (!validateName(firstName.value)) {
        alert("Jméno musí být složené pouze z písmen.")
        return
    } else if (secondName.value == "") {
        alert("Vyplňte prosím příjmení.")
        return
    }  else if (!validateName(secondName.value)) {
        alert("Příjmení musí být složené pouze z písmen.")
        return
    } else if (!validateEmail(email.value)) {
        alert("Zadejte prosím platný email")
        return
    } else if (productName.value == "") {
        alert("Vyplňte prosím název produktu.")
        return
    } else if (price.value == "" || price <= 0) {
        alert("Zadejte cenu produktu. Cena musí být větší než 0 Kč.")
        return
    } else if (amount.value == "" || amount/1 != amount) {
        alert("Zadejte počet kusů. Počet kusů musí být celé číslo.")
        return
    } else if (amount <= 0.99) {
        alert("Počet kusů musí být minimálně 1.")
        return
    }

    // Uložení informací 
    sessionStorage.setItem("first_name", firstName.value);
    sessionStorage.setItem("second_name", secondName.value);
    sessionStorage.setItem("email", email.value);
    sessionStorage.setItem("product_name", productName.value);
    sessionStorage.setItem("price", String(price));
    sessionStorage.setItem("amount", String(amount));

    window.location.href = "potvrzeni.html";

}