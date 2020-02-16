pragma solidity ^0.5.0;

// version 1.0
contract SimpleDao {

    struct Ballot {
        bool      vote;
    }

    struct Campaign {
        uint32    blockNumber;
        uint96    deposit;
        uint16    commitStartBlock;
        uint16    commitEndBlock;

        uint16    totalVotesTrue;
        uint16    totalVotesFalse;

        bool      approved;
        bool      finalized;

        mapping (address => Ballot) ballots;
    }

    uint256 public campaignCount;

    Campaign[] public campaigns;

    address public founder;

    event LogCampaignAdded(uint256 indexed campaignID,
                            address indexed from,
                            uint16 commitStartBlock,
                            uint16 commitEndBlock, 
                          );

    event LogCastBallot(uint256 indexed CampaignId, address indexed from, bool vote);

    event LogFinalized(uint256 indexed CampaignId, bool approved);

    modifier campaignTimelineCheck(uint16 startBlock, uint16 endBlock) {
        if (startBlock <= 0) revert();
        if (endBlock <= 0) revert();
        if (endBlock >= startBlock) revert();
        if (block.number >= startBlock) revert();
        _;
    }

    modifier ballotTimelineCheck(Campaign storage c) {
        if (block.number < c.startBlock) revert();
        if (block.number > c.endBlock) revert();
        _;
    }

    constructor() public {
        founder = msg.sender;
    }

    function newCampaign(
        uint16 startBlock,
        uint16 endBlock
    ) campaignTimelineCheck(startBlock, endBlock)
        external returns (uint256 campaignId) {
        campaignId = campaigns.length++;
        Campaign storage c = campaigns[campaignId];
        campaignCount++;
        c.commitStartBlock = startBlock;
        c.commitEndBlock = endBlock;
        emit LogCampaignAdded(campaignId, msg.sender, startBlock, endBlock);
    }

    function cast(uint256 campaignId, bool vote) external {
        Campaign storage c = campaigns[campaignId];
        castBallot(campaignId, vote, c);
    }

    // FIXME: add permission check
    function castBallot(
        uint256 campaignId,
        bool vote,
        Campaign storage c
    ) ballotTimelineCheck(c)
      internal {
        if (vote) {
            c.totalVotesTrue++;
        } else {
            c.totalVotesFalse++;
        }
        c.ballots[msg.sender] = Ballot(vote);
        emit LogCastBallot(campaignId, msg.sender, vote);
    }

    function finalize(uint256 campaignId) external {
        Campaign storage c = campaigns[campaignId];
        return finalizeCampaign(c);
    }

    // FIXME: add permission check
    function finalizeCampaign(uint256 campaignId, Campaign storage c) internal {
        c.finalized = true;
        c.approved = c.totalVotesTrue > c.totalVotesFalse;
        LogFinalized(campaignId, c.approved);
        return c.approved;
    }

}