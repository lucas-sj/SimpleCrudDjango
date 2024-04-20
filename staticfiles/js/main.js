const addButton = document.querySelector("#addPerson");
const searchPersonButton = document.querySelector("#searchPerson");
const searchPersonDialog = document.querySelector("#btSearchPerson");
const editPersonButton = document.querySelector("#editPerson");
const removePerson = document.querySelector("#removePerson");
const newPerson = document.querySelector("#newPerson")

const idPersonInput = document.querySelector("#idPerson");
const nameInput = document.querySelector("#name");
const lastNameInput = document.querySelector("#lastName");
const ageInput = document.querySelector("#age")
const txtPerson = document.querySelector("#txtPerson")

newPerson.addEventListener("click", (event) =>{
    event.preventDefault();
    clearFields();
})

removePerson.addEventListener("click", (event) => {
    event.preventDefault();
    const id = idPersonInput.value.trim();
    if (id !== "") {
        $.ajax({
            url: `/person/remove_person/${id}`,
            type: 'DELETE',
            contentType: 'application/json',
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function(response) {
                showAlert("success", response.message);
                clearFields();
            },
            error: function(xhr, status, error) {
                showAlert("error", 'Erro ao remover a pessoa: '+error)
            }
        });
    } else {
        showAlert("error", "Nenhuma pessoa selecionada!");
    }
});

addButton.addEventListener("click", (event) => {
    event.preventDefault();
    const id = idPersonInput.value.trim();
    const nome = nameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const age = ageInput.value.trim();
    if (nome === "") {
        showAlert("error", "O campo de nome não pode estar vazio.");
    } else {
        savePerson(id, nome, lastName, age);
    }
});

searchPersonButton.addEventListener("click", (event) =>{
    event.preventDefault();

    openModalSearch()
    $("#dialog").dialog( "open" );
});

searchPersonDialog.addEventListener("click", (event) => {
    event.preventDefault();
    const person = $("#txtPerson").val().trim();

    if (person !== "") {
        $.ajax({
            type: 'GET',
            url: `/person/search_person?person=${person}`,
            contentType: 'application/json',
            success: function (data) {
                $("#resultTable").html(data);
                $("#dialog").dialog( "close" );
            },
            error: function (error) {
                console.error('Erro:', error);
            }
        });
    } else {
        showAlert("error", "O campo de busca não pode ser vazio")
    }
});

function editPerson(elemento) {
    const idPerson = elemento.getAttribute('data-idPerson');
    const namePerson = elemento.getAttribute('data-namePerson');
    const lastNamePerson = elemento.getAttribute('data-lastNamePerson');
    const agePerson = elemento.getAttribute('data-agePerson');

    if (idPerson && namePerson && lastNamePerson && agePerson) {
        idPersonInput.value = idPerson;
        nameInput.value = namePerson;
        lastNameInput.value = lastNamePerson;
        ageInput.value = agePerson;
    } else {
        console.error('Elemento não possui atributos data-* definidos.');
    }
}

function showAlert(type, text) {
    const alerta = document.getElementById("customAlert");
    const conteudoAlerta = document.getElementById("contentAlert");

    conteudoAlerta.textContent = text;

    if (type === "error") {
        alerta.classList.remove("alertSuccess");
        alerta.classList.add("alertError");
    } else if (type === "success") {
        alerta.classList.remove("alertError");
        alerta.classList.add("alertSuccess");
    }

    alerta.style.display = "block";
    setTimeout(() => {
        alerta.style.display = "none";
    }, 3000);
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function savePerson(id, name, lastname, age) {
    if (name === "" || lastName === "" || isNaN(age)) {
        showAlert("error", "Por favor, preencha todos os campos corretamente.");
        return;
    }
    var dados = {
        id_person: id,
        name: name,
        last_name: lastname,
        age: age
    };

    $.ajax({
        type: 'POST',
        url: "/person/save_person",
        data: dados,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            if (response.success) {
                showAlert("success", response.message);
            } else {
                showAlert("error", response.message);
            }
            clearFields()
        },
        error: function (error) {
            showAlert("error", "Ocorreu um erro ao salvar a pessoa.");
        }
    });
}


function openModalSearch(elemento) {
    $( "#dialog" ).dialog({
        autoOpen: false,
        position: { my: "left top", at: "left bottom", of: "#searchPerson" },
        draggable: false,
        show: {
            effect: "fold",
            duration: 500
        },
        hide: {
            effect: "fold",
            duration: 300
        }
    });
}

function clearFields() {
    idPersonInput.value = '';
    nameInput.value = '';
    lastNameInput.value = '';
    ageInput.value = '';
}