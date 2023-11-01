import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

function StakingApp() {
    const [account, setAccount] = useState(null);
    const [stakingContract, setStakingContract] = useState(null);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [reward, setReward] = useState(0);
    const [inputAmount, setInputAmount] = useState('');
    const web3 = new Web3(window.ethereum);
    
    useEffect(() => {
      const web3 = new Web3(window.ethereum);

      async function loadWeb3() {
          if (window.ethereum) {
              await window.ethereum.enable();
              const accounts = await web3.eth.getAccounts();
              setAccount(accounts[0]);

              const stakingContractAddress = '0x1b6acc00d925835f1167D370C6bb9cfDD81CE1C8'; //select yours
              const abi = [
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "_tokenAddress",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_stakingPeriod",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_totalRewards",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "constructor"
                },
                {
                  "anonymous": false,
                  "inputs": [],
                  "name": "Paused",
                  "type": "event"
                },
                {
                  "anonymous": false,
                  "inputs": [
                    {
                      "indexed": true,
                      "internalType": "address",
                      "name": "user",
                      "type": "address"
                    },
                    {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "reward",
                      "type": "uint256"
                    }
                  ],
                  "name": "RewardsDistributed",
                  "type": "event"
                },
                {
                  "anonymous": false,
                  "inputs": [
                    {
                      "indexed": true,
                      "internalType": "address",
                      "name": "user",
                      "type": "address"
                    },
                    {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "amount",
                      "type": "uint256"
                    }
                  ],
                  "name": "Staked",
                  "type": "event"
                },
                {
                  "anonymous": false,
                  "inputs": [],
                  "name": "Unpaused",
                  "type": "event"
                },
                {
                  "anonymous": false,
                  "inputs": [
                    {
                      "indexed": true,
                      "internalType": "address",
                      "name": "user",
                      "type": "address"
                    },
                    {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "amount",
                      "type": "uint256"
                    }
                  ],
                  "name": "Withdrawn",
                  "type": "event"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "_user",
                      "type": "address"
                    }
                  ],
                  "name": "calculateRewards",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "isPaused",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "owner",
                  "outputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "pause",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "_amount",
                      "type": "uint256"
                    }
                  ],
                  "name": "stake",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "name": "stakedBalances",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "stakingPeriod",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "name": "stakingStartTimes",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "token",
                  "outputs": [
                    {
                      "internalType": "contract IERC20",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "totalRewards",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "unpause",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "withdraw",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
              ];
              
              const contract = new web3.eth.Contract(abi, stakingContractAddress);
              setStakingContract(contract);

              contract.events.Staked({}, (error, event) => {
                  if (error) console.error("Error in Staked event:", error);
                  else {
                      console.log("Staked event:", event);
                  }
              });
          } else if (window.web3) {
              window.web3 = new Web3(window.web3.currentProvider);
          } else {
              window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
          }
      }

      loadWeb3();
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            if (stakingContract && account) {
                try {
                    const amount = await stakingContract.methods.stakedBalances(account).call();
                    setStakedAmount(web3.utils.fromWei(amount, 'ether'));
                    const userReward = await stakingContract.methods.calculateRewards(account).call();
                    setReward(web3.utils.fromWei(userReward, 'ether'));
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        }

        fetchUserData();
    }, [account, stakingContract]);

    async function handleStake(amount) {
        try {
            const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
            await stakingContract.methods.stake(weiAmount).send({ from: account });
        } catch (error) {
            console.error("Error in handleStake:", error);
            alert("Error staking. See console for details.");
        }
    }

    async function handleCustomStake() {
        if (inputAmount && !isNaN(inputAmount) && parseFloat(inputAmount) > 0) {
            await handleStake(inputAmount);
            setInputAmount('');  // Clear the input field after staking
        } else {
            alert("Please enter a valid amount!");
        }
    }

    async function handleWithdraw() {
        try {
            await stakingContract.methods.withdraw().send({ from: account });
        } catch (error) {
            console.error("Error in handleWithdraw:", error);
            alert("Error withdrawing. See console for details.");
        }
    }

    return (
        <div className="App">
            <h2>Staking App</h2>
            <p>Account: {account}</p>
            <p>Staked Amount: {stakedAmount} ETH</p>
            <p>Reward: {reward} ETH</p>

            <input
                type="text"
                value={inputAmount}
                onChange={e => setInputAmount(e.target.value)}
                placeholder="Enter staking amount in ETH"
            />
            <button onClick={handleCustomStake}>Stake Entered Amount</button>
            <button onClick={handleWithdraw}>Withdraw</button>
        </div>
    );
}

export default StakingApp;
