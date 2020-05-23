function closeMessages(){
    setTimeout(()=>{
        let messages = document.getElementsByClassName("ui positive message");
        if (messages.length > 0){
            for(var i =0; i<messages.length; i++){
                let message = messages.item(i)
                message.remove();
            }
        }
        
    },
    3000)
}