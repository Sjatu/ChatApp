
jQuery(function ($) {
    var socket = io.connect();
    var $nickForm = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#nickName');
    var $blankSpace = $('#blankSpace');
    var $users = $('#users');
    var $messageForm = $('#send-message');
    var $messageBox = $('#message');
    var $chat = $('#chat');
    $('#chatContainer').hide();
    $nickBox.focus();
    var audio = new Audio('ting.mp3');
    var date = moment(new Date().getTime()).format('h:mm A');
    const $messages = document.querySelector('.message-container')
    const autoscroll = () => $messages.scrollTop = $messages.scrollHeight

    $nickForm.submit(function (e) {
        e.preventDefault();
        socket.emit('new user', $nickBox.val(), function (data) {
            if (data) {
                $('#nickWrap').hide(1000);
                $('#chatContainer').show(2000);
                $messageBox.focus();
            } else {
                $nickError.html('That Username is already taked, try again!')
                $nickBox.focus();
            }
        });
        $nickBox.val('');
        $messageBox.focus();
    });

    socket.on('usernames', function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += `<div class="list-group-item border-0 rounded-0" style="background-color: rgba(255,255,255,0.2);"><i class="fa text-light fa-2x fa-user float-left" aria-hidden="true"></i>
                                <h6 class="ml-3 mt-1 text-white float-left">${data[i]}</h6>
                            </div>`
        }
        $users.html(html);
        audio.play();
    });

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), function (data) {

            if (data.n == 'Admin') {
                $chat.append(`<div class="media w-50 mb-3 ml-auto ">
                                <div class="media-body ml-3">
                                    <div class="bg-danger rounded py-2 px-3 mb-2">
                                    <span class="small font-weight-bold text-white">${data.n} : </span>
                                        <p class="text-small mb-0 text-white">${data.m}</p>
                                    </div>
                                    <p class="small text-muted float-right my-0 font-italic">${date}</p>
                                </div>
                            </div>`);
                audio.play();
            } else {
                $chat.append(`<div class="media w-50 mb-3 ml-auto ">
                                <div class="media-body ml-3">
                                    <div class="rounded py-2 px-3 mb-2" style="background-color:#0984e3;">
                                    <span class="small font-weight-bold text-white">${data.n} : </span>
                                        <p class="text-small mb-0 text-white">${data.m}</p>
                                    </div>
                                    <p class="small text-muted float-right my-0 font-italic">${date}</p>
                                </div>
                            </div>`);
            }autoscroll();
        })
        $messageBox.val('');
        $messageBox.focus();
        
    });

    socket.on('new message', function (data) {
        if (data.nick == 'Admin') {
            $chat.append(`<div class="media w-50 mb-3">
                            <div class="media-body ml-3">
                                <div class="rounded py-2 px-3 mb-2" style="background-color:#c7ecee;">
                                <span class="small font-weight-bold text-muted">${data.nick} : </span>
                                    <p class="text-small mb-0 text-muted">${data.msg}</p>
                                </div>
                                <p class="small text-muted float-right my-0 font-italic">${date}</p>
                            </div>
                        </div>`);
            audio.play();
        } else {
            $chat.append(`<div class="media w-50 mb-3">
                            <div class="media-body ml-3">
                                <div class="rounded py-2 px-3 mb-2" style="background-color:#81ecec;">
                                <span class="small font-weight-bold text-muted">${data.nick} : </span>
                                    <p class="text-small mb-0 text-muted">${data.msg}</p>
                                </div>
                                <p class="small text-muted float-right my-0 font-italic">${date}</p>
                            </div>
                        </div>`);
            audio.play();autoscroll();
        }
        
    })

    socket.on('whisper', function (data) {
        if (data.nick == 'You') {
            $chat.append(`<div class="media w-50 ml-auto mb-3">
                            <div class="media-body ml-3 font-italic">
                                <div class="bg-dark rounded py-2 px-3 mb-2" style="color:#dfe6e9;">
                                <span class="small font-weight-bold"><b>${data.nick} : </b></span>
                                    <p class="text-small mb-2 font-italic">${data.msg}</p>
                                </div>
                                <p class="small text-muted float-right my-0 font-italic">${date}</p>
                            </div>
                        </div>`);
            audio.play();
        } else {
            $chat.append(`<div class="media w-50 mb-3">
                            <div class="media-body ml-3 font-italic">
                                <div class="bg-dark rounded py-2 px-3 mb-2" style="color:#dfe6e9;">
                                <span class="small font-weight-bold"><b>${data.nick} : </b></span>
                                    <p class="text-small mb-2">${data.msg}</p>
                                </div>
                                <p class="small text-muted float-right my-0 font-italic">${date}</p>
                            </div>
                        </div>`);
            audio.play();autoscroll();
        }
        
    })
})