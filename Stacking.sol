// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Staking {
    address public owner;
    IERC20 public token;
    uint public stakingPeriod;
    uint public totalRewards;
    bool public isPaused = false;

    mapping(address => uint) public stakedBalances;
    mapping(address => uint) public stakingStartTimes;

    event Staked(address indexed user, uint amount);
    event RewardsDistributed(address indexed user, uint reward);
    event Withdrawn(address indexed user, uint amount);
    event Paused();
    event Unpaused();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Paused");
        _;
    }

    constructor(address _tokenAddress, uint _stakingPeriod, uint _totalRewards) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
        stakingPeriod = _stakingPeriod;
        totalRewards = _totalRewards;
    }

    function stake(uint _amount) external whenNotPaused {
        require(_amount > 0, "Cannot stake zero tokens");
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        stakedBalances[msg.sender] += _amount;
        stakingStartTimes[msg.sender] = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    function calculateRewards(address _user) public view returns (uint) {
        uint timeStaked = block.timestamp - stakingStartTimes[_user];
        uint effectiveTimeStaked = timeStaked > stakingPeriod ? stakingPeriod : timeStaked;
        return (stakedBalances[_user] * effectiveTimeStaked * totalRewards) / stakingPeriod;
    }

    function distributeRewardForUser(address _user) internal {
        uint reward = calculateRewards(_user);
        stakedBalances[_user] += reward;
        emit RewardsDistributed(_user, reward);
    }

    function withdraw() external {
        distributeRewardForUser(msg.sender);

        uint amount = stakedBalances[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        stakedBalances[msg.sender] = 0;
        stakingStartTimes[msg.sender] = 0;

        token.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function pause() external onlyOwner {
        isPaused = true;
        emit Paused();
    }

    function unpause() external onlyOwner {
        isPaused = false;
        emit Unpaused();
    }
}
