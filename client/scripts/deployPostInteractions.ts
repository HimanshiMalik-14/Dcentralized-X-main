async function deployPostInteractions() {
    const postTweetAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const initialCommentCounter = 100000;

    const PostInteractions = await hre.ethers.getContractFactory("PostInteractions");

    const postInteractions = await PostInteractions.deploy(postTweetAddress, initialCommentCounter);

    await postInteractions.deployed();

    console.log(`PostInteractions deployed to: ${postInteractions.address}`);
}

deployPostInteractions()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});