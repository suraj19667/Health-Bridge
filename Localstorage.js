let sendData=()=>{

    let inpname=document.querySelector("#fullname").value
    let inpemail=document.querySelector("#email").value
    let inppass=document.querySelector("#password").value
    let cnfpass=document.querySelector("#confirm").value

    localStorage.setItem("Name",inpname)
    localStorage.setItem("Email",inpemail)
    localStorage.setItem("Password",inppass)
    localStorage.setItem("Confirm_Pass",cnfpass)


    location.href="Login.html"
    return false

}

let Login=()=>{
    let username=document.querySelector("#username").value
    let Password=document.querySelector("#password").value

    let user=localStorage.getItem("Email")
    let pass=localStorage.getItem("Password")

    if(user==username && pass==Password){

        location.href="index.html"
    }
    else{
        alert("Please Enter Valid Username and Password")
    
    }

    return false
}

