async function sendMessage() {
    const token = localStorage.getItem("jwtToken");
    const message = document.getElementById("message").value;
    const contact = document.getElementById("contact").value;

    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        body: JSON.stringify({ contact: contact, message: message }), // Stringify the body
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
            "Authorization": token
        }
    });

    // Handle the response
    const data = await response.json();
    console.log(data);

    

    
}

async function receiveMessage(){
    const token = localStorage.getItem("jwtToken");
    const messageHolder = document.getElementById("messageReceive");

    const response = await fetch("http://localhost:3000/chat",{
        method: "GET",
        
        headers: {
            "Content-Type": "application/json", // Set content type to JSON
            "Authorization": token
        }

    });
    const data = await response.json();
    console.log(data.msg[0]);

    messageHolder.innerHTML= data.msg[0];
    

        
    

}

async function signUp(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
        const response = await fetch("http://localhost:3000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        });
 
        const data = await response.json();
        
       
        if (response.ok) {
          // Save token or any necessary data
          localStorage.setItem("jwtToken", data.token);
    
          // Redirect to chatbox
          window.location.href = "chatApp/chatbox.html"; // Replace with your chatbox page URL
        } else {
          console.error("Signup failed:", data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
      
}

setInterval(receiveMessage, 3000); // Fetch new messages every 5 seconds
