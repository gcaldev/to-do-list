
// This function provides us the csrftoken for the interaction with the server.
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

var title_is_valid = false;
var desc_is_valid = false;
var date_is_valid = false;
const TITLE_MAX_LENGTH = 100;
const TITLE_MIN_LENGTH = 5;
const DESC_MAX_LENGTH = 1000;
const DESC_MIN_LENGTH = 5;
document.getElementById("description_input").addEventListener("input", FormValidation);
document.getElementById("date_input").addEventListener("input", FormValidation);
document.getElementById("title_input").addEventListener("input", FormValidation);

// Validates the required inputs from the form
function FormValidation(e){
    if(e.target.name == "title_input"){
        if(e.target.value.length < TITLE_MAX_LENGTH && e.target.value.length > TITLE_MIN_LENGTH){
            title_is_valid = true;
            e.target.style.outline = "none";
        } else {
            title_is_valid = false;
            e.target.style.outline = "1px solid #DD4A48";
        }
    } else if (e.target.name == "description_input"){
        if(e.target.value.length < DESC_MAX_LENGTH && e.target.value.length > DESC_MIN_LENGTH){
            desc_is_valid = true;
            e.target.style.outline = "none";
        } else {
            desc_is_valid = false;
            e.target.style.outline = "1px solid #DD4A48";
        }
    } else if (e.target.name == "date_input"){
        if(e.target.value == ""){
            date_is_valid = false;
            e.target.style.outline = "1px solid #DD4A48";    
        } else {
            date_is_valid = true;
            e.target.style.outline = "none";    
        }
    }
}

// This function let us remove a task without refreshing the site.
$(".del-btn, #remove-task-btn").click(function(e){
    e.preventDefault(); // Prevent from refreshing.
    const task_id = $(this).val();
    $.ajax({
        type:"POST",
        url : "/taskRemove/",
        data: {
            "task_id": task_id,
            "csrfmiddlewaretoken":csrftoken
        }
    })
    clicked_task = document.getElementById("task-" + task_id);
    clicked_task.remove();
})

// This function allows us to show the user the details of the selected task without refreshing.
$(".config-btn").click(function(e){
    e.preventDefault();
    const task_id = $(this).val();
    $.ajax({
        type:"POST",
        url : "/config_task/",
        data: {
            "task_id": task_id,
            "csrfmiddlewaretoken":csrftoken
        },
        // The response of the server is a Json with the details of the task
        success: function(response) {
            OpenModal();
            document.getElementById("save-task").style.display = "none"; // Here I hide the save button because edit and delete button will be shown
            document.getElementById("buttons-container").style.display = "block";
            document.getElementById("title_input").value = response["title"];
            document.getElementById("description_input").value = response["description"];
            document.getElementById("activity_type").value = response["activity"];
            document.getElementById("date_input").value = response["date"];
            document.getElementById("remove-task-btn").value = response["id"];
            document.getElementById("edit_id").value = response["id"];
            if (response["is_done"] == true){
                document.getElementById("is_done").checked = true;
            }
            //We know that the received details are correct because they were validated before.
            title_is_valid = true;
            desc_is_valid = true;
            date_is_valid = true;
        },
    })
})

// Opens the task that the user is looking for if is posible, if not then returns false.
function SearchTask(){
    tasks = document.getElementsByClassName("uploaded-task");
    input = document.getElementById("specified_task").value;
    for(let i = 0; i < tasks.length; i++){
        if (input == tasks[i].querySelector(".task-title").innerHTML){
            tasks[i].querySelector(".config-btn").click();
            return true;
        }
    }
    return false;
}

$(".search-form").submit(function(e){
    e.preventDefault();
    if(!SearchTask()) document.getElementById("not_found_error").style.display = "block";
    else document.getElementById("not_found_error").style.display = "none";
})

window.onclick = function(e){
    let modal = document.querySelector(".modal-container");
    if(e.target == modal){
        // This means the user is clicking outside the modal window.
        CloseModal();
    }
}

// Opens the modal window with the task title received as default.
function OpenWithInput(){
    let actual_input = document.getElementById("specified_task").value;
    let title_input = document.getElementById("title_input");
    title_input.value = actual_input;
    if (actual_input.length > TITLE_MIN_LENGTH && actual_input.length < TITLE_MAX_LENGTH) title_is_valid = true;
    OpenModal();
}

function OpenModal(){
    let modal = document.querySelector(".modal-container");
    modal.style.display = "block";
}
//Closes the modal window and sets all the things that the user modified to their default status.
function CloseModal(){
    document.querySelector(".modal-container").style.display = "none";
    
    title_is_valid = false;
    desc_is_valid = false;
    date_is_valid = false;
    
    document.getElementById("title_input").style.outline = "none";
    document.getElementById("description_input").style.outline = "none";
    document.getElementById("date_input").style.outline = "none";
    
    document.getElementById("new-task-form").reset();
    if(document.getElementById("buttons-container").style.display == "block"){
        document.getElementById("buttons-container").style.display = "none";
        document.getElementById("save-task").style.display = "block";
    }
    let title_error = document.getElementById("title_error"); 
    let description_error = document.getElementById("description_error");
    let date_error = document.getElementById("date_error");
    
    if(title_error) title_error.remove();
    if(description_error) description_error.remove(); 
    if(date_error) date_error.remove();
}

//Submits the form if it is posible, else it displays the elements that are making conflicts.
function SubmitForm(){
    let valid_operation = true;
    let title_error = document.getElementById("title_error"); 
    let description_error = document.getElementById("description_error");
    let date_error = document.getElementById("date_error");
    
    if(title_error) title_error.remove();
    if(description_error) description_error.remove(); 
    if(date_error) date_error.remove();
    
    if(!title_is_valid){
        valid_operation = false;
        document.querySelector(".title_content").innerHTML += "<h3 id = 'title_error'>*Must have between 5 and 100 chars*</h3>";
        const title_elem = document.getElementById("title_input");
        title_elem.addEventListener("input", FormValidation);
    }
    if(!desc_is_valid){
        valid_operation = false;
        document.querySelector(".description_content").innerHTML += "<h3 id='description_error'>*Must have between 5 and 1000 chars*</h3>";
        const desc_elem = document.getElementById("description_input");
        desc_elem.addEventListener("input", FormValidation);
    }
    if(!date_is_valid){
        valid_operation = false;
        document.querySelector(".date-container").innerHTML += "<h3 id='date_error'>*Date is required*</h3>";
        const date_elem = document.getElementById("date_input");
        date_elem.addEventListener("input", FormValidation);
    }
    if(valid_operation) document.getElementById("new-task-form").submit();
}