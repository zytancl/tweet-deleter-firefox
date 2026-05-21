Tweet Deleter (Firefox)

    Helps with deleting tweets.

Note From The Forker

    This is a fork of https://github.com/ketrewq/tweet-deleter to port into Firefox, as it was made only for Chrome and Edge.

    To be frank, this extension doesn't work well, unlike what the original creator had said. Based on my personal experience, this only works for tweets up to less than a month (and/or less than 100 tweets). This is only ideal if you just want to quickly delete your recent tweets.

    If you wish to delete every tweets (and more), use this userscript instead, it works amazingly well because it requires you to upload your Twitter archive and deletes everything you want:
    https://github.com/lucahammer/tweetXer

    Additionally, because the extension is made only in Korean, I added a toggle where it comes in English too.

    If you are facing any issues, contact the original creator instead because all I'm responsible for is just converting to Firefox and Firefox-based browsers.

Precautions

    Due to the characteristics of Twitter tweet loading, you may need to run it multiple times to delete everything.

    Tweets from before April 2025 may not be deleted due to Twitter API's own updates. (Not tested, but there were reports that they were deleted)

    1.3 Update removed the date filter that was not working.

    Original code source: https://github.com/Lyfhael/DeleteTweets

Installation method

All responsibility for using this software rests with the user.

Attached is a kind guide from those who are grateful.

https://x.com/SUNAEOJISANG/status/1936707317405528150

    Click the green button on the right side on GitHub, and click “Download ZIP” below.

    Unzip the downloaded ZIP file.

    In Firefox (and Firefox-based browsers), go to "about:debugging", "This (Firefox/Zen/Waterfox/etc.)", and click on "Load Temporary Add-on...".
    
    Finally, select the manifest.json from the unzipped folder.

Usage

    Go to the reply (Your Profile > Reply) tab.
    
    Wait until all replies are loaded, then click the extension button.

    Leave it as is. Press F12 to check progress in developer tools (console).

Contributing

    Not working / This could be improved / Accidentally deleted -> Feedback is also welcome!

    This is a beta testing stage at the PoC level. The filtering feature may have errors. Please proceed with some risk.

    Feel free to open issues, contribute, or contact via Twitter DM @booleanistic. (original creator)
