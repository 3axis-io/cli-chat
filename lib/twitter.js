const bearer = '';

let TwitterApi, twitterClient, client;

if (bearer) {
    TwitterApi = require('twitter-api-v2').TwitterApi;
    twitterClient = new TwitterApi(bearer);
    client = twitterClient.readOnly;
} else {
    console.log('Missing bearer token');
}


const userCache = {};

async function getUserTL(username) {
    // Get user object from cache or live
    let data;
    if (userCache[username]) {
        data = userCache[username];
    } else {
        const user = await client.v2.userByUsername(username, {
            'user.fields' : 'description,name,profile_image_url,url,username'
        });
        userCache[username] = data = user.data;
    }

    //Get tweets for user
    const tweets = await client.v2.userTimeline(data.id, {
        exclude: 'replies,retweets',
        'tweet.fields': 'attachments,created_at,id,lang,text',
    });
    // Add them to user object
    data.tweets = tweets._realData.data.map(tweet => {
        tweet.created_at = (new Date(tweet.created_at)).valueOf()
        return tweet;
    });

    //TODO: handle output
    console.log(JSON.stringify(data));
}

module.exports = {
    client,
    getUserTL
}