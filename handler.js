'use strict';

const twitter = require('./src/twitter');
const scheduler = require('./src/scheduler');
const env = process.env;

module.exports.scheduleTweets = async (event, context) => {
    if (env.SCREEN_NAME_TO_COPY === '') {
        return {message: 'ERROR: No screen name set.', event};
    }

    return twitter.fetchTweets(env.SCREEN_NAME_TO_COPY, parseInt(env.MONTHS_AGO_TO_COPY), parseInt(env.DAYS_TO_SCHEDULE))
        .then(scheduler.scheduleTweets)
        .then(tweets => ({message: `Scheduled ${tweets.length} tweets`, event}))
        .catch(e => ({message: e.toString(), event}));
};


module.exports.sendReplicaTweet = async (event, context) => {
    return twitter.sendTweet(event)
        .then({ message: 'Sent tweet successfully', event });
};
