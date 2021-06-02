'use strict';

// 1. Controle de entrada.
//     1. Armazenar Nome do Cliente, placa do veículo, data e Horário. OK
//     2. Gerar comprovante de entrada. OK
// 2. Controle de saída.
//     1. Saída do veiculo OK
//     2. Calculo do valor a pagar OK
// 3. Cadastro de preços.
//     1. Primeira hora OK
//     2. Demais horas OK

const date = new Date();
const dateTime = {
    'day': date.getDate(),
    'mounth': date.getMonth() + 1,
    'year': date.getFullYear(),
    'hours': date.getHours(),
    'minutes': date.getMinutes()
}

const openModalPrices = () => document.querySelector('#modal-Prices').classList.add('active');
const closeModalPrices = () => document.querySelector('#modal-Prices').classList.remove('active');

const openModalReceipt = () => document.querySelector('#modal-receipt').classList.add('active');
const closeModalReceipt = () => document.querySelector('#modal-receipt').classList.remove('active');

const openModalExit = () => document.querySelector('#modal-exit').classList.add('active');
const closeModalExit = () => document.querySelector('#modal-exit').classList.remove('active');

const openModalEdit = () => document.querySelector('#modal-edit').classList.add('active');
const closeModalEdit = () => document.querySelector('#modal-edit').classList.remove('active');

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? [];
const setDB = (db) => localStorage.setItem('db', JSON.stringify(db));

const readDBPrice = () => JSON.parse(localStorage.getItem('price')) ?? [];
const setDBPrice = (dbPrice) => localStorage.setItem('price', JSON.stringify(dbPrice));

const insertIntoDB = (car) => {
    const db = readDB();
    db.push(car);
    setDB(db);
}

const insertIntoDBPrices = (price) => {
    const dbPrice = readDBPrice()
    dbPrice.push(price)
    setDBPrice(dbPrice)
}

const getDateNow = () => {
    const dateNow = dateTime['mounth'] > 9 ?
        dateTime['day'] + '/' + dateTime['mounth'] + '/' + dateTime['year']
        :
        dateTime['day'] + '/0' + dateTime['mounth'] + '/' + dateTime['year'];

    return dateNow;
}

const getHoursNow = () => {
    const timeNow = dateTime['hours'] + ':' + dateTime['minutes'];

    return timeNow;
}

const clearTable = () => {
    const recordCar = document.querySelector('#tableCars tbody');
    while (recordCar.firstChild) {
        recordCar.removeChild(recordCar.lastChild);
    }
}

const clearInputs = () => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}


const createRow = (car, index) => {
    const tableCars = document.querySelector('#tableCars tbody')
    const newTr = document.createElement('tr');
    // console.log(client);
    newTr.innerHTML = `                
        <td>${car.nome}</td>
        <td>${car.placa}</td>
        <td>${car.data}</td>
        <td>${car.hora}</td>
        <td>
            <button data-index="${index}" id="button-receipt" class="button green" type="button">Comp.</button>
            <button data-index="${index}" id="button-edit" class="button blue" type="button">Editar</button>
            <button data-index="${index}" id="button-exit" class="button red" type="button">Saída</button>
        </td>`;
    tableCars.appendChild(newTr);
}

// onclick="javascript:window.location.href='comprovante.html'"

const updateTable = () => {
    clearTable()
    const db = readDB();
    db.forEach(createRow)
}

const saveCar = () => {
    const newCar = {
        nome: document.querySelector('#nome').value,
        placa: document.querySelector('#placa').value,
        data: getDateNow(),
        hora: getHoursNow()
    }
    insertIntoDB(newCar);
    clearInputs();
    updateTable();
}

const savePrice = () => {
    const newPrice = {
        primeiraHora: document.querySelector('#primeira-hora').value,
        demaisHoras: document.querySelector('#demais-horas').value
    }
    insertIntoDBPrices(newPrice);
    clearInputs();
    closeModalPrices();
}

const saveCarEdited = () => {
    const newCar = {
        nome: document.querySelector('#nome-edited').value,
        placa: document.querySelector('#placa-edited').value,
        data: document.querySelector('#data').value,
        hora: document.querySelector('#hora').value
    }
    insertIntoDB(newCar);
    clearInputs();
    closeModalEdit();
    updateTable();
}

const calcExit = (index) => {
    const db = readDB();
    const dbPrices = readDBPrice();
    const lastIndex = dbPrices.length - 1;

    const valueOfFirsteHours = dbPrices[lastIndex]["primeiraHora"];
    const valueOfMoreHours = dbPrices[lastIndex]["demaisHoras"];

    const entryTime = db[index].hora.substr(0, 2);
    let exitTime = getHoursNow().substr(0, 2);
    let valueOfBePay = 0

    if (exitTime == '0:') {
        exitTime = 24;
        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {
            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {
            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            const valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
            console.log(valueOfBePay);
        } else {
            valueOfBePay = valueOfFirsteHours;
        }

    } else {
        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {
            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {
            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
        } else {
            valueOfBePay = valueOfFirsteHours;
        }
    }
    return valueOfBePay;
}


const deleteCar = (index) =>{
    const db = readDB()
    const resp = confirm(`Ao confirmar os dado de ${db[index].nome} serão apagados`);
    
    if(resp){
        db.splice(index, 1)
        setDB(db);
        updateTable();
    }
}

const setReceipt = (index) => {
    const db = readDB();
    const input = Array.from(document.querySelectorAll('#form-receipt input'));
    input[0].value = db[index].nome;
    input[1].value = db[index].placa;
    input[2].value = db[index].data;
    input[3].value = db[index].hora;
}

const setExit = (index) => {
    const db = readDB();
    const input = Array.from(document.querySelectorAll('#form-exit input'));
    input[0].value = db[index].nome;
    input[1].value = db[index].placa;
    input[2].value = db[index].hora;
    input[3].value = getHoursNow();
    input[4].value = calcExit(index);
    deleteCar(index);
}

const editCar = (index) =>{

    const db = readDB();
    document.querySelector('#nome-edited').value = db[index].nome;
    document.querySelector('#placa-edited').value = db[index].placa;
    document.querySelector('#data').value = db[index].data;
    document.querySelector('#hora').value = db[index].hora;
    deleteCar(index);
}

const getButtons = (event) => {
    const button = event.target;
    if (button.id == "button-receipt") {
        const index = button.dataset.index;
        openModalReceipt();
        setReceipt(index);
    }else if (button.id == "button-exit") {
        const index = button.dataset.index;
        openModalExit();
        setExit(index);
    }else if(button.id == "button-edit"){
        const index = button.dataset.index;
        openModalEdit();
        editCar(index);
    }

}

const printRecipt = () => {
    window.print();
}

// MODAL DE PREÇOS
document.querySelector('#precos').addEventListener('click', () => { openModalPrices(); clearInputs() });
document.querySelector('#close-prices').addEventListener('click', () => { closeModalPrices(); clearInputs() });
document.querySelector('#cancelar-prices').addEventListener('click', () => { closeModalPrices(); clearInputs() });
// *****************
// SELETOR DOS BOTÕES
document.querySelector('#tableCars').addEventListener('click', getButtons);
// ******************
//MODAL COMPROVANTE
document.querySelector('#close-receipt').addEventListener('click', () => { closeModalReceipt(); clearInputs() });
document.querySelector('#cancelar-receipt').addEventListener('click', () => { closeModalReceipt(); clearInputs() });
//MODAL SAÍDA
document.querySelector('#close-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });
document.querySelector('#cancelar-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });
//MODAL EDITAR
document.querySelector('#close-edit').addEventListener('click', () => { closeModalEdit(); clearInputs() });
document.querySelector('#cancelar-edit').addEventListener('click', () => { closeModalEdit(); clearInputs() });
//SALVAR CARRO
document.querySelector('#salvar').addEventListener('click', saveCar);
//SALVAR PREÇO
document.querySelector('#salvarPreco').addEventListener('click', savePrice);
//SALVAR EDITAR
document.querySelector('#editar').addEventListener('click', saveCarEdited);
updateTable();