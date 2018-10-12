'use strict';

const {TwitterErrorResponse} = require('./errors');

const Twit = require('twit');
const t = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const checkErrors = (endpoint) => {
    return (r) => {
        if (r.data.errors) {
            throw new TwitterErrorResponse(endpoint, r.data.errors);
        }
        return r.data;
    }
};

const retweet = (id) => {
    const endpoint = `statuses/retweet/${id}`;
    return t.post(endpoint, {trim_user: true})
        .then(r => {
            if (r.data.errors) {
                throw new TwitterErrorResponse(endpoint, r.data.errors);
            }
            return r.data;
        });
};

const fetchTweets = (handle, monthsAgo, duration) => {
    let sinceDate = new Date();
    sinceDate.setMonth(sinceDate.getMonth() - monthsAgo);
    sinceDate = sinceDate.toISOString().split('T')[0];

    let tillDate = new Date(sinceDate);
    tillDate.setDate(tillDate.getDate() + duration - 1);
    tillDate = tillDate.toISOString().split('T')[0];

    const q = `from:${handle} since:${sinceDate} until:${tillDate}`;
    return t.get('search/tweets', {q, count: 100, include_rts: 1})
        .then(checkErrors('search/tweets'))
        .then(data => {
            return data.statuses.map(t => ({id: t.id_str, created_at: t.created_at}));
        })
};

module.exports = {
    retweet,
    fetchTweets
};
