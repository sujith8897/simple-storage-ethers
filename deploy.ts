import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

// deployed contract address: 0xFF0Ef9cA92A8800504EC70b5f2AADFc6279898A8

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying...");
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);

    let currentNumber = await contract.retrieve();
    console.log("Current number:", currentNumber.toString());
    const transactionResponse = await contract.store("48");
    await transactionResponse.wait(1);
    currentNumber = await contract.retrieve();
    console.log("Updated number:", currentNumber.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })