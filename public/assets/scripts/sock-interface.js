const sockjs = new SockJS('/cli-chat');
let userId = 'anonymous';

Object.assign(sockjs, {
    onopen() { console.log('Connected') },
    onclose() { console.log('Disconnected') },

    //Incoming chat and server instructions
    onmessage(e) {
        const payload = JSON.parse(e.data);
        switch (payload.type) {
            case 'assignUserId':
                userId = payload.data;
                console.log('You are ' + payload.data)
                break;
            //system and user messages
            case 'message':
                console.log(payload.data.userId + ': ' + payload.data.value);
                break;
        }
    }
});

//Outgoing messages and commands
function socksend(type, value) {
    sockjs.send(JSON.stringify({type, data: {userId, value}}));
}
function msg(str) {
    socksend('message', str);
}
function cmd(str) {
    socksend('command', str);
}