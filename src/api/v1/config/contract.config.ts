import { providers, Contract } from "ethers";

const provider = new providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
const mainnetProvider = new providers.JsonRpcProvider(
    process.env.MAINNET_RPC_ENDPOINT,
);
const badgeAddress = process.env.CONTRACT_ADDRESS
    ? process.env.CONTRACT_ADDRESS
    : '0'; // Fallback ?
const opcoTuple =
    '(address co, address[] citizens, uint256 supply, uint256 minted)';
const citizenTuple =
    '(address citizen, address opco, bool minted, address delegate, uint256 delegations)';
const badgeAbi = [
    'event OPsAdded(address indexed _sender)',
    'event OPCOsAdded(address indexed _op, uint256 indexed _lastCursor, address[] _opcos)', // s?
    'event CitizensAdded(address indexed _opco, uint256 indexed _lastCursor, address[] _citizens)', // s?
    'event CitizenRemoved(address indexed _opco, address indexed _removed)',
    'event Minted(address indexed _minter, address indexed _opco)',
    'event Burned(address _burner)',

    `function getCitizens(uint256 cursor, uint256 count) view public returns (${citizenTuple}[] memory, uint256 newCursor)`,
    `function getCitizen(address _adr) public view returns (${citizenTuple} memory)`,
    `function getOPCOs(uint256 cursor, uint256 count) view public returns(${opcoTuple}[] memory, uint256 newCursor)`,
    `function getOPCO(address _adr) view public returns(${opcoTuple} memory)`,
];

export const badgeContract = new Contract(
    badgeAddress,
    badgeAbi,
    provider,
);