'use strict';

// 1. Controle de entrada.
//     1. Armazenar Nome do Cliente, placa do veículo, data e Horário. OK
//     2. Gerar comprovante de entrada. OK
// 2. Controle de saída.
//     1. Saída do veiculo OK
//     2. Calculo do valor a pagar
// 3. Cadastro de preços.
//     1. Primeira hora
//     2. Demais horas

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

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? [];

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db));

const insertIntoDB = (car) => {
    const db = readDB();
    db.push(car);
    setDB(db);
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
    input[4].value = 20;
}


const getButtons = (event) => {
    const button = event.target;
    if (button.id == "button-receipt") {
        const index = button.dataset.index;
        openModalReceipt();
        setReceipt(index);
    }
    if (button.id == "button-exit") {
        const index = button.dataset.index;
        console.log(index);
        openModalExit();
        setExit(index);
    }

}
const clearInputs = () => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
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

document.querySelector('#salvar').addEventListener('click', saveCar);
updateTable();