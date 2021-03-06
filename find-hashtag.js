const fs = require('fs')
const { screenName } = require('./config')
const { getTweets, renderTweet, findTweetIn } = require('./lib')

const [_0, _1, HASHTAG] = process.argv

const tweets = getTweets()
const tagTweets = tweets
  .filter(t => t.entities && t.entities.hashtags.find(h => h.text === HASHTAG))
  .reduce((carry, t, i, all) => {
    const prevId = t.in_reply_to_status_id_str
    if (prevId && !findTweetIn(all, prevId)) {
      const prevTweet = findTweetIn(tweets, prevId)
      if (prevTweet) {
        carry.push(prevTweet)
      }
    }

    carry.push(t)
    return carry
  }, [])

const render = () => {
  let md = `*(archived tweets with the #${HASHTAG} hashtag)*\n\n`
  md += tagTweets.map(t => renderTweet(t, screenName, true, true)).join('\n\n<!-- -->\n')
  fs.writeFileSync(`./hashtags/${HASHTAG}.md`, md)
}

render()