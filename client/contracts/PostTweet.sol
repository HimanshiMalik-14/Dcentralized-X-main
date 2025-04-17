// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {FollowSystem} from "./FollowSystem.sol";

/**
 * @title PostTweet
 * @author Unnati Gupta
 * @dev This contract allows users to post, edit, delete and repost tweets. Supports mutable and immutable tweets and keeps track of user posts
 * @notice This contract also interacts with the FollowSystem contract to enable viewing tweets posted from the accounts whom the user has followed.
 */
contract PostTweet {
    FollowSystem public followSystem;

    constructor(address _followSystemAddress) {
        followSystem = FollowSystem(_followSystemAddress);
    }

    struct Tweet {
        uint256 id;
        string name;
        address author;
        string authorID;
        string avatar;
        string content;
        string mediaCID;
        uint256 timestamp;
        bool isRepost;
        string reposter;
        string reposterID;
        string reposterAvatar;
        bool isMutable;
    }

    Tweet[] public allTweets;
    mapping(address => Tweet[]) public userTweets;
    mapping(address => mapping(uint256 => uint256)) public repostCount;
    mapping(address => mapping(address => mapping(uint256 => bool)))
        public userReposts;

    uint256 public tweetCounter;

    event TweetPosted(
        uint256 indexed tweetId,
        address indexed author,
        string authorID,
        string name,
        string avatar,
        string content,
        string mediaCID,
        uint256 timestamp,
        bool isRepost,
        bool isMutable
    );

    /**
     * @notice Posts a new immutable tweet
     * @param _name The name of the tweet's author
     * @param _authorID The ID of the author
     * @param _avatar The avatar URL of the author
     * @param _content The content of the tweet
     * @param _mediaCID The CID of media attached to the tweet
     */
    function postTweet(
        string memory _name,
        string memory _authorID,
        string memory _avatar,
        string memory _content,
        string memory _mediaCID
    ) public {
        require(bytes(_content).length > 0, "Tweet content cannot be empty");

        Tweet memory newTweet = Tweet({
            id: tweetCounter,
            name: _name,
            author: msg.sender,
            authorID: _authorID,
            avatar: _avatar,
            content: _content,
            mediaCID: _mediaCID,
            timestamp: block.timestamp,
            isRepost: false,
            reposter: "",
            reposterID: "",
            reposterAvatar: "",
            isMutable: false
        });

        allTweets.push(newTweet);
        userTweets[msg.sender].push(newTweet);

        emit TweetPosted(
            tweetCounter,
            msg.sender,
            _authorID,
            _name,
            _avatar,
            _content,
            _mediaCID,
            block.timestamp,
            false,
            false
        );

        tweetCounter++;
    }

    /**
     * @notice Posts a new mutable tweet
     * @param _name The name of the tweet's author
     * @param _authorID The ID of the author
     * @param _avatar The avatar URL of the author
     * @param _content The content of the tweet
     * @param _mediaCID The CID of media attached to the tweet
     */
    function postMutableTweet(
        string calldata _name,
        string calldata _authorID,
        string calldata _avatar,
        string calldata _content,
        string calldata _mediaCID
    ) public {
        require(bytes(_content).length > 0, "Tweet content cannot be empty");

        Tweet memory newTweet = Tweet({
            id: tweetCounter,
            name: _name,
            author: msg.sender,
            authorID: _authorID,
            avatar: _avatar,
            content: _content,
            mediaCID: _mediaCID,
            timestamp: block.timestamp,
            isRepost: false,
            reposter: "",
            reposterID: "",
            reposterAvatar: "",
            isMutable: true
        });

        allTweets.push(newTweet);
        userTweets[msg.sender].push(newTweet);

        emit TweetPosted(
            tweetCounter,
            msg.sender,
            _authorID,
            _name,
            _avatar,
            _content,
            _mediaCID,
            block.timestamp,
            false,
            true
        );

        tweetCounter++;
    }

    /**
     * @notice Edits an existing tweet if it is mutable
     * @param tweetId The unique ID of the tweet to edit
     * @param _content The new content for the tweet
     * @param _mediaCID The new CID of media for the tweet
     */
    function editTweet(
        uint256 tweetId,
        string memory _content,
        string memory _mediaCID
    ) public {
        Tweet storage tweet = allTweets[tweetId];
        require(
            tweet.author == msg.sender,
            "Only the author of this tweet can edit"
        );
        require(tweet.isMutable, "Tweet is not mutable");

        tweet.content = _content;
        tweet.mediaCID = _mediaCID;
    }

    /**
     * @notice Deletes an existing tweet if it is mutable
     * @param tweetId The unique ID of the tweet to delete
     */
    function deleteTweet(uint256 tweetId) public {
        Tweet storage tweet = allTweets[tweetId];
        require(
            tweet.author == msg.sender,
            "Only the author of this tweet can delete"
        );
        require(tweet.isMutable, "Tweet is not mutable");

        delete allTweets[tweetId];
        delete userTweets[msg.sender][tweetId];
    }

    /**
     * @notice Reposts an existing tweet
     * @param tweetId The unique ID of the tweet to repost
     * @param _name The name of the user reposting
     * @param _authorID The ID of the user reposting
     * @param _avatar The avatar URL of the user reposting
     */
    function repostTweet(
        uint256 tweetId,
        string calldata _name,
        string calldata _authorID,
        string calldata _avatar
    ) public {
        require(tweetId < tweetCounter, "Invalid tweet ID");

        Tweet memory originalTweet = allTweets[tweetId];

        require(
            !userReposts[msg.sender][originalTweet.author][tweetId],
            "You have already reposted this tweet!"
        );

        Tweet memory newRepost = Tweet({
            id: tweetCounter,
            name: originalTweet.name,
            author: msg.sender,
            authorID: originalTweet.authorID,
            avatar: originalTweet.avatar,
            content: originalTweet.content,
            mediaCID: originalTweet.mediaCID,
            timestamp: block.timestamp,
            isRepost: true,
            reposter: _name,
            reposterID: _authorID,
            reposterAvatar: _avatar,
            isMutable: false
        });

        allTweets.push(newRepost);
        userTweets[msg.sender].push(newRepost);

        userReposts[msg.sender][originalTweet.author][tweetId] = true;
        repostCount[originalTweet.author][tweetId] += 1;

        emit TweetPosted(
            tweetCounter,
            msg.sender,
            originalTweet.authorID,
            originalTweet.name,
            originalTweet.avatar,
            originalTweet.content,
            originalTweet.mediaCID,
            block.timestamp,
            true,
            false
        );

        tweetCounter++;
    }

    /**
     * @notice Returns all tweets
     * @return Array of all tweets in the contract
     */
    function getAllTweets() public view returns (Tweet[] memory) {
        return allTweets;
    }

    /**
     * @notice Returns tweets by a specific user
     * @param _user The address of the user to get tweets for
     * @return Array of tweets by the specified user
     */
    function getTweetsByUser(
        address _user
    ) public view returns (Tweet[] memory) {
        return userTweets[_user];
    }

    /**
     * @notice Returns tweets from accounts followed by the caller
     * @return Array of tweets by followed users
     */
    function getTweetsByFollowing() public view returns (Tweet[] memory) {
        address[] memory followedPersons = followSystem.getFollowing(
            msg.sender
        );

        uint256 totalTweetCount = 0;

        for (uint256 i = 0; i < followedPersons.length; i++) {
            totalTweetCount += userTweets[followedPersons[i]].length;
        }

        Tweet[] memory allFollowedTweets = new Tweet[](totalTweetCount);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < followedPersons.length; i++) {
            Tweet[] memory tweets = userTweets[followedPersons[i]];
            for (uint256 j = 0; j < tweets.length; j++) {
                allFollowedTweets[currentIndex] = tweets[j];
                currentIndex++;
            }
        }

        return allFollowedTweets;
    }

    /**
     * @notice Checks if the user has reposted or not
     * @param user The address of the user who has reposted
     * @param author The address of the user who posted the original tweet
     * @param tweetId The unique ID of the original tweet
     * @return A boolean value based on whether the user has reposted or not
     */
    function hasUserReposted(
        address user,
        address author,
        uint256 tweetId
    ) external view returns (bool) {
        return userReposts[user][author][tweetId];
    }

    /**
     * @notice Returns the repost count of a particular tweet
     * @param author The address of the user who posted the tweet
     * @param tweetId The unique ID of the tweet
     * @return The total repost count for a specific tweet as an unsigned integer
     */
    function getTotalReposts(
        address author,
        uint256 tweetId
    ) external view returns (uint256) {
        return repostCount[author][tweetId];
    }
}