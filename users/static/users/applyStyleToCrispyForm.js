function styleInputFields(){
    let inputFields = document.getElementsByTagName("INPUT");
    for(let i=0; i<inputFields.length; i++){
        let inputField = inputFields[i]
        inputField.classList.add("ui button")
    }
}