// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Minimal interfaces for demonstration
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract SynVault {
    IERC20 public baseAsset; // The primary asset users deposit (e.g. mETH on Mantle)
    address public owner;
    address public aiAgent; // The AI agent that finds yield options

    // Tracking user principal for simplified accounting
    mapping(address => uint256) public userBalances;
    uint256 public totalDeposits;

    // Track active Yield positions (e.g., Agni Finance LP tokens, Lendle receipt tokens)
    address[] public activePositions;
    mapping(address => bool) public isPositionTracked;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event YieldStrategyExecuted(address indexed target, uint256 value, bytes data);
    event PositionTracked(address indexed tokenAddress);
    event ProtocolApproved(address indexed token, address indexed protocol, uint256 amount);
    event AgentUpdated(address newAgent);

    constructor(address _baseAsset, address _aiAgent) {
        owner = msg.sender;
        baseAsset = IERC20(_baseAsset);
        aiAgent = _aiAgent;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAgentOrOwner() {
        require(msg.sender == aiAgent || msg.sender == owner, "Not authorized");
        _;
    }

    // Users deposit their base asset into Syn-A
    function deposit(uint256 amount) external {
        require(amount > 0, "Deposit must be > 0");
        require(baseAsset.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        userBalances[msg.sender] += amount;
        totalDeposits += amount;
        emit Deposited(msg.sender, amount);
    }

    // Users withdraw their base asset
    // (In a full vault, this uses an exchange rate based on totalAssets() vs totalSupply() of a vault share token)
    function withdraw(uint256 amount) external {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] -= amount;
        totalDeposits -= amount;

        require(baseAsset.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    // -------------------------------------------------------------
    // AI AGENT EXECUTIONS & PORTFOLIO MANAGEMENT
    // -------------------------------------------------------------

    // The AI Agent evaluates market conditions and dynamically routes funds across Mantle protocols
    function executeStrategy(address targetContract, uint256 value, bytes calldata data) external onlyAgentOrOwner {
        (bool success, ) = targetContract.call{value: value}(data);
        require(success, "Strategy execution failed");
        
        emit YieldStrategyExecuted(targetContract, value, data);
    }

    // Allow the Agent to approve Vault assets for usage by Mantle DeFi protocols (Routers, Staking)
    function approveProtocol(address token, address protocol, uint256 amount) external onlyAgentOrOwner {
        require(IERC20(token).approve(protocol, amount), "Approval failed");
        emit ProtocolApproved(token, protocol, amount);
    }

    // Track new Yield-bearing/LP Tokens returned from strategies
    function trackPosition(address tokenAddress) external onlyAgentOrOwner {
        require(!isPositionTracked[tokenAddress], "Already tracking");
        isPositionTracked[tokenAddress] = true;
        activePositions.push(tokenAddress);
        emit PositionTracked(tokenAddress);
    }

    // Optional: Return total tracked assets across multiple pools
    function getTrackedPositions() external view returns (address[] memory) {
        return activePositions;
    }

    // Emergency withdrawal in case of compromised strategy or migrating to a V2
    function emergencyWithdraw(address tokenAddress, uint256 amount) external onlyOwner {
        require(IERC20(tokenAddress).transfer(owner, amount), "Emergency withdraw failed");
    }

    // Update the AI agent's authorized address
    function setAiAgent(address _newAgent) external onlyOwner {
        aiAgent = _newAgent;
        emit AgentUpdated(_newAgent);
    }
    
    // Allow vault to hold native MNT / ETH
    receive() external payable {}
}
