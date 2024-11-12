"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let elForm = document.querySelector('.add-form');
let elInput = document.querySelector('.input-value');
let elList = document.querySelector('.list-todos');
let elModalOuter = document.querySelector('.modal-outer');
let elModalInner = document.querySelector('.modal-inner');
// Close the modal when the user clicks start
elModalOuter.addEventListener('click', (e) => closeModal(e));
function closeModal(e) {
    e.target.id == 'wrapper' ? elModalOuter.classList.add('hidden') : "";
}
// close Modal End
//  Add todos function start
function postData(data) {
    fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    fetchData();
}
;
elForm === null || elForm === void 0 ? void 0 : elForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
        title: elInput.value,
    };
    postData(data);
    elInput.value = '';
});
//  Add todos function end
// Update part start
function updateFetch(data) {
    fetch(`http://localhost:3000/todos/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    fetchData();
}
;
function handleSubmitUpdate(e, id) {
    const data = {
        id,
        title: e.target.todo.value,
    };
    updateFetch(data);
    elModalOuter.classList.add("hidden");
}
// Update part end
// delete part start
function deleteData(id) {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
    });
    fetchData();
}
;
function handleUpdate(item) {
    elModalOuter.classList.remove('hidden');
    elModalInner.innerHTML = `
        <form id="update-form" autocomplete="off" class="flex flex-col gap-4">
            <p class="text-white text-[20px]">Update Todo</p>
            <input name="todo" type="text" class="text-[20px] bg-[#070F2B] text-white outline-none rounded-lg px-3 py-2 border border-[#00000022] " placeholder="Update Todo" value="${item.title}">
            <button type="submit" class="text-md font-semibold text-white hover:opacity-70 duration-300 px-5 py-2 bg-blue-500 rounded-lg">Update</button>
        </form>
        `;
    const updateForm = document.getElementById("update-form");
    updateForm.addEventListener("submit", (e) => handleSubmitUpdate(e, item.id));
}
//  Delete part end
// Render the todos start
function renderTodos(data, list) {
    list.innerHTML = '';
    data.length > 0 ? data.forEach((item, index) => {
        let elItem = document.createElement("li");
        elItem.className = 'rounded-lg text-white p-4 flex items-center justify-between w-full bg-[#021526]';
        elItem.innerHTML = `
        <div class="flex ">
            <h3 class="text-lg font-bold">${index + 1}. ${item.title}</h3>
        </div>
        <div class="flex items-center space-x-4">
            <button class="update-btn text-md hover:opacity-70 duration-300 px-5 py-2 bg-blue-500 rounded-lg">Update</button>
            <button class="text-md delete-btn hover:opacity-70 duration-300 px-5 py-2 bg-red-500 rounded-lg">Delete</button>
        </div>
        `;
        list === null || list === void 0 ? void 0 : list.append(elItem);
        const deleteButton = elItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => deleteData(item.id));
        const updateBtn = elItem.querySelector('.update-btn');
        updateBtn.addEventListener('click', () => handleUpdate(item));
    })
        :
            list.innerHTML = `<li class="text-[25px] text-center mt-[80px] text-white font-bold">No Todo</li>`;
}
;
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/todos');
            const data = yield response.json();
            renderTodos(data, elList);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
;
fetchData();
// Render end
