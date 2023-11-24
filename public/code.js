
(function () {
    const app = document.querySelector('.app');
    const socket = io();
    let uname;

    app.querySelector(".join-screen #join-button").addEventListener('click', function () {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }
        socket.emit('newuser', username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });
    

    app.querySelector("#exit-chat").addEventListener("click", function () {
        socket.emit('exit-chat', uname);
        app.querySelector(".chat-screen").classList.remove("active");
        app.querySelector(".join-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit('chat', {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    socket.on("update", function (message) {
        renderMessage("update", message);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        socket.emit("exituser",uname);
        window.location.href=window.location.href;

    })


    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".message");
        let el = document.createElement("div");
    
        if (type == "my") {
            el.setAttribute("class", "msg my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type == "other") {
            el.setAttribute("class", "msg other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type == "update") {
            el.setAttribute("class", "msg update");
            el.innerText = message;
        }
    
        messageContainer.appendChild(el);
    
        // Scroll to the latest message
        
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    
})();
