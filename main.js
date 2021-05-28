'use strict';

const date = new Date();
const dateTime = {
    'day'    : date.getDate(),
    'mounth'  : date.getMonth() + 1,
    'year'   : date.getFullYear(),
    'hours'  : date.getHours(),
    'minutes': date.getMinutes()
}

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? [];

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db));

const insertIntoDB = (car) =>{
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

const getHoursNow = () =>{
    const timeNow = dateTime['hours'] + ':' + dateTime['minutes'];

    return timeNow;
}

const clearTable = () => {
    const recordCar = document.querySelector('#tableCars tbody');
    while (recordCar.firstChild) {
        recordCar.removeChild(recordCar.lastChild);
    }
}

const createRow = (car) => {
    const tableCars = document.querySelector('#tableCars tbody')
    const newTr = document.createElement('tr');
    // console.log(client);
    newTr.innerHTML = `                
        <td>${car.nome}</td>
        <td>${car.placa}</td>
        <td>${getDateNow()}</td>
        <td>${getHoursNow()}</td>
        <td>
            <button id="button-receipt" class="button green" type="button" onclick="javascript:window.location.href='comprovante.html'">Comp.</button>
            <button id="button-edit" class="button blue" type="button">Editar</button>
            <button id="button-exit" class="button red" type="button" onclick="javascript:window.location.href='comprovanteSaida.html'">Saída</button>
        </td>`;
    tableCars.appendChild(newTr);
}

const updateTable = () =>{
    clearTable()
    const db = readDB();
    db.forEach(createRow)
}

const saveCar = () =>{
    const nweCar = {
        nome  : document.querySelector('#nome').value,
        placa : document.querySelector('#placa').value
    }
    insertIntoDB(nweCar);
    clearInputs();
    updateTable();
}

const clearInputs = () =>{
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}

const printRecipt = () =>{
    window.print();
}
