'use strict';

const date = new Date();
const dateTime = {
    'day'    : date.getDate(),
    'mounth'  : date.getMonth() + 1,
    'year'   : date.getFullYear(),
    'hours'  : date.getHours(),
    'minutes': date.getMinutes()
}

date

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
            <button data-index="${index}" id="button-receipt" class="button green" type="button" onclick="javascript:window.location.href='comprovante.html'">Comp.</button>
            <button data-index="${index}" id="button-edit" class="button blue" type="button">Editar</button>
            <button data-index="${index}" id="button-exit" class="button red" type="button" onclick="javascript:window.location.href='comprovanteSaida.html'">Saída</button>
        </td>`;
    tableCars.appendChild(newTr);
}

// onclick="javascript:window.location.href='comprovante.html'"

const updateTable = () =>{
    clearTable()
    const db = readDB();
    db.forEach(createRow)
}

const saveCar = () =>{
    const nweCar = {
        nome  : document.querySelector('#nome').value,
        placa : document.querySelector('#placa').value,
        data  : getDateNow(),
        hora  : getHoursNow()
    }
    insertIntoDB(nweCar);
    clearInputs();
    updateTable();
}

const setReceipt = (index) =>{
    const db = readDB();
    const input = Array.from(document.querySelectorAll('#form-receipt input'));
    input[0].value = db[index].nome;
    input[1].value = db[index].placa;
    input[2].value = db[index].data;
    input[3].value = db[index].hora;
}

const getButtons = (event) =>{
    const button = event.target;
    if(button.id == "button-receipt"){
        const index = button.dataset.index;
        return index;
    }

}

const clearInputs = () =>{
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}

const printRecipt = () =>{
    window.print();
}

