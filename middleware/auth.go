package middleware

import (
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/umbracle/ethgo"
	"github.com/umbracle/ethgo/abi"
	"github.com/umbracle/ethgo/contract"
	"github.com/umbracle/ethgo/jsonrpc"
)

var rpc_endpoint = os.Getenv("RPC_ENDPOINT")

func VerifySignature(from, sigHex string, msg []byte) bool {
	sig := hexutil.MustDecode(sigHex)

	msg = accounts.TextHash(msg)
	sig[crypto.RecoveryIDOffset] -= 27 // Transform yellow paper V from 27/28 to 0/1

	recovered, err := crypto.SigToPub(msg, sig)
	if err != nil {
		return false
	}

	recoveredAddr := crypto.PubkeyToAddress(*recovered)

	return from == recoveredAddr.Hex()
}

func OpAuth(account, signature string) bool {
	var functions = []string{
		"function hasRole(bytes32 role, address account) public view virtual override returns (bool)",
	}

	abiContract, err := abi.NewABIFromList(functions)
	if err != nil {
		panic(err)
	}

	addr := ethgo.HexToAddress("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")

	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		panic(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("hasRole", ethgo.Latest, crypto.Keccak256Hash([]byte("OP_ROLE")), account)
	if err != nil {
		panic(err)
	}

	return VerifySignature(account, signature, []byte("Example `personal_sign` message")) && res["0"].(bool)
}

func HolderAuth(account, signature string) bool {

	var functions = []string{
		"function balanceOf(address owner) view returns (uint256)",
	}

	abiContract, err := abi.NewABIFromList(functions)
	if err != nil {
		panic(err)
	}

	addr := ethgo.HexToAddress("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")

	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		panic(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("balanceOf", ethgo.Latest, account)
	if err != nil {
		panic(err)
	}

	return VerifySignature(account, signature, []byte("Example `personal_sign` message")) && res["0"].(*big.Int).Cmp(big.NewInt(1)) == 0
}
