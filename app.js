const amountFrom = document.getElementById("amountFrom");
const amountTo = document.getElementById("amountTo");

let from = "RUB";
let to = "USD";
let rates = { RUB: 1, USD: 0.011, EUR: 0.010, GBP: 0.0088 };

async function loadRates() {
    try {
        const res = await fetch("https://api.exchangerate.host/latest?base=RUB&symbols=USD,EUR,GBP,RUB");
        const data = await res.json();

        if (data && data.rates) {
            rates = {};
            for (const key in data.rates) {
                rates[key] = Number(data.rates[key]);
            }
        }

        calculateFrom(); 
    } catch (err) {
        console.error("Valyuta kursları yüklənmədi:", err);
        calculateFrom();
    }
}
function calculateFrom() {
    const value = parseFloat(amountFrom.value);
    if (!value || rates[to] === undefined || rates[from] === undefined) {
        amountTo.value = "";
        return;
    }
    amountTo.value = (value * (rates[to] / rates[from])).toFixed(2);
}
function calculateTo() {
    const value = parseFloat(amountTo.value);
    if (!value || rates[to] === undefined || rates[from] === undefined) {
        amountFrom.value = "";
        return;
    }
    amountFrom.value = (value * (rates[from] / rates[to])).toFixed(2);
}
function setupCurrency(selector, type) {
    const buttons = document.querySelectorAll(`#${selector} div`);
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (type === "from") from = btn.dataset.cur;
            else to = btn.dataset.cur;

            calculateFrom();
        });
    });
    buttons[0].classList.add("active");
}

setupCurrency("fromCurrency", "from");
setupCurrency("toCurrency", "to");

amountFrom.addEventListener("input", calculateFrom);
amountTo.addEventListener("input", calculateTo);

window.addEventListener("load", loadRates);
