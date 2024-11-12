let elForm = document.querySelector('.add-form') as HTMLFormElement;
let elInput = document.querySelector('.input-value') as HTMLInputElement;
let elList = document.querySelector('.list-todos') as HTMLUListElement;
let elModalOuter = document.querySelector('.modal-outer') as HTMLDivElement;
let elModalInner = document.querySelector('.modal-inner') as HTMLDivElement;


// type todos
type TodoType = {
    id?: number
    title: string
};

// Close the modal when the user clicks start
elModalOuter.addEventListener('click', (e: Event) => closeModal(e))
function closeModal(e: Event) {
    (e.target as HTMLDivElement).id == 'wrapper' ? elModalOuter.classList.add('hidden') : "";
}
// close Modal End

//  Add todos function start
function postData(data: TodoType): void {
    fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    fetchData();
};
elForm?.addEventListener('submit', function (e: Event): void {
    e.preventDefault();
    const data: TodoType = {
        title: elInput.value,
    }
    postData(data);
    elInput.value = '';

});
//  Add todos function end

// Update part start
function updateFetch(data: TodoType): void {
    fetch(`http://localhost:3000/todos/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    fetchData();
};
function handleSubmitUpdate(e:Event, id:number): void {
    const data: TodoType = {
        id,
        title: (e.target as HTMLFormElement).todo.value,
    }
    updateFetch(data)
    elModalOuter.classList.add("hidden")
}
// Update part end

// delete part start
function deleteData(id: number): void {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
    })
    fetchData();
};
function handleUpdate(item: TodoType): void {
    elModalOuter.classList.remove('hidden');
    elModalInner.innerHTML = `
        <form id="update-form" autocomplete="off" class="flex flex-col gap-4">
            <p class="text-white text-[20px]">Update Todo</p>
            <input name="todo" type="text" class="text-[20px] bg-[#070F2B] text-white outline-none rounded-lg px-3 py-2 border border-[#00000022] " placeholder="Update Todo" value="${item.title}">
            <button type="submit" class="text-md font-semibold text-white hover:opacity-70 duration-300 px-5 py-2 bg-blue-500 rounded-lg">Update</button>
        </form>
        `;

    const updateForm = document.getElementById("update-form") as HTMLFormElement;
    updateForm.addEventListener("submit", (e) => handleSubmitUpdate(e, item.id!));
}
//  Delete part end

// Render the todos start
function renderTodos(data: TodoType[], list: Element | null): void {
    (list as HTMLUListElement).innerHTML = '';
    data.length > 0 ? data.forEach((item: TodoType, index: number) => {
        let elItem = document.createElement("li") as HTMLLIElement
        elItem.className = 'rounded-lg text-white p-4 flex items-center justify-between w-full bg-[#021526]';
        elItem.innerHTML = `
        <div class="flex ">
            <h3 class="text-lg font-bold">${index + 1}. ${item.title}</h3>
        </div>
        <div class="flex items-center space-x-4">
            <button class="update-btn text-md hover:opacity-70 duration-300 px-5 py-2 bg-blue-500 rounded-lg">Update</button>
            <button class="text-md delete-btn hover:opacity-70 duration-300 px-5 py-2 bg-red-500 rounded-lg">Delete</button>
        </div>
        `
        list?.append(elItem)
        const deleteButton = elItem.querySelector('.delete-btn') as HTMLButtonElement;
        deleteButton.addEventListener('click', (): void => deleteData(item.id!));
        const updateBtn = elItem.querySelector('.update-btn') as HTMLButtonElement;
        updateBtn.addEventListener('click', (): void => handleUpdate(item));
    })
        :
        (list as HTMLUListElement).innerHTML = `<li class="text-[25px] text-center mt-[80px] text-white font-bold">No Todo</li>`
};

async function fetchData() {
    try {
        const response: any = await fetch('http://localhost:3000/todos');
        const data: TodoType[] = await response.json();
        renderTodos(data, elList);
    } catch (error) {
        console.error('Error:', error);
    }
};
fetchData();
// Render end