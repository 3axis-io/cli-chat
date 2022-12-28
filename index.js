// User and lib mappings
const userConnections = {};
const lib = {
    twitter: require('./lib/twitter.js')
}

// Handle socket events per-user
const cliChat = require('sockjs').createServer();
let nextUserId = 0;
cliChat.on('connection', conn => {
    //Connected
    const userId = 'user' + ++nextUserId;
    userConnections[userId] = conn;
    tellAll({userId: 'System', value: userId + ' joined.'})
    conn.write(JSON.stringify({type : 'assignUserId', data: userId}));

    //On disconnect
    conn.on('close', () => {
        delete userConnections[userId];
        tellAll({userId: 'System', value: userId + ' left.'});
    });

    //Incoming messages and commands
    conn.on('data', data => {
        const payload = JSON.parse(data);
        switch (payload.type) {
            case 'message':
                tellAll(payload.data);
                break;
            case 'command':
                const args = payload.data.value.split(' ');
                if (args.length !== 3) {
                    tellUser(userId, {userId: 'System', value: `3 arguments are required`});
                    return;
                }
                const module = lib[args[0]];
                if (!lib) {
                    tellUser(userId, {userId: 'System', value: `library ${args[0]} doesn't exist`});
                    return;
                }
                const method = module[args[1]];
                if (!method) {
                    tellUser(userId, {userId: 'System', value: `method ${args[0]}.${args[1]} doesn't exist`});
                    return;
                }
                method(args[2]);
                break;
        }
    });
});

// Outgoing
function tellUser(userId, obj) {
    userConnections[userId].write(JSON.stringify({
        type: 'message',
        data: obj
    }));
}
function tellAll(obj) {
    for (const userId in userConnections) {
        tellUser(userId, obj);
    }
}


// Server setup
const server = require('http').createServer();
const node_static = require('node-static');
const static_directory = new node_static.Server(__dirname + '/public');

server.addListener('request', (req, res) => {static_directory.serve(req, res)});
cliChat.installHandlers(server, {prefix:'/cli-chat'});
server.listen(8000, '0.0.0.0');