import { Contract, providers } from 'ethers';
// A Human-Readable ABI; for interacting with the contract, we
// must include any fragment we wish to use
const rolesABI = [
    // View-Only Functions
    'function isOP(address _adr) public view returns (bool)',
    'function isOPCO(address _adr) public view returns (bool)',
    'function isCitizen(address _adr) public view returns (bool)',
];

const badgeAddress = process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS : '0x0'; // FIXME: Add fallbacks! OR handle it properly
const rpcUrl = process.env.RPC_ENDPOINT ? process.env.RPC_ENDPOINT: 'google.com'; 
const provider = new providers.JsonRpcProvider(rpcUrl);

const badgeContract = new Contract(badgeAddress, rolesABI, provider);

const isOP = async (address: string): Promise<boolean> => {
    try {
        const isOp = await badgeContract.isOP(address);
        return isOp;
    } catch(error) {
        return false;
    }
}

const isOPCO = async (address: string): Promise<boolean> => {
    try {
        const isOp = await badgeContract.isOPCO(address);
        return isOp;
    } catch(error) {
        return false;
    }
}

const isCitizen = async (address: string): Promise<boolean> => {
    try {
        const isOp = await badgeContract.isCitizen(address);
        return isOp;
    } catch(error) {
        return false;
    }
}

export const getRole = async (address: string): Promise<string> => {
    if (await isOP(address)) {
        return "OP_ROLE";
    } else if (await isOPCO(address)) {
        return "OPCO_ROLE";
    } else if (await isCitizen(address)) {
        return "CITIZEN_ROLE";
    } else { 
        return "PUBLIC";
    }
}
