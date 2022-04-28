package middleware

import (
	"log"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"github.com/umbracle/ethgo"
	"github.com/umbracle/ethgo/abi"
	"github.com/umbracle/ethgo/contract"
	"github.com/umbracle/ethgo/jsonrpc"
)

var rpc_endpoint string
var contract_address string
var signature_secret string

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Print("Error loading .env file")
	}
	rpc_endpoint = os.Getenv("RPC_ENDPOINT")
	contract_address = os.Getenv("CONTRACT_ADDRESS")
	signature_secret = os.Getenv("SIGNATURE_SECRET")
}

func VerifySig(message []byte, from, sigHex string) bool {
	sig, err := hexutil.Decode(sigHex)
	if err != nil {
		log.Fatal(err)
	}
	msg := accounts.TextHash(message)
	sig[crypto.RecoveryIDOffset] -= 27 // Transform yellow paper V from 27/28 to 0/1
	recovered, err := crypto.SigToPub(msg, sig)
	if err != nil {
		return false
	}
	recoveredAddr := crypto.PubkeyToAddress(*recovered)

	return from == recoveredAddr.Hex()
}

func isOp(account string) bool {
	var functions = []string{
		"function isOp(address account) public view returns (bool)",
	}
	abiContract, err := abi.NewABIFromList(functions)
	if err != nil {
		log.Fatal(err)
	}
	addr := ethgo.HexToAddress(contract_address)
	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		log.Fatal(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("isOp", ethgo.Latest, account)
	if err != nil {
		log.Fatal(err)
	}

	return res["0"].(bool)
}

func isOpCo(account string) bool {
	var functions = []string{
		"function isOpCo(address account) public view returns (bool)",
	}
	abiContract, err := abi.NewABIFromList(functions)
	if err != nil {
		log.Fatal(err)
	}
	addr := ethgo.HexToAddress(contract_address)
	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		log.Fatal(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("isOpCo", ethgo.Latest, account)
	if err != nil {
		log.Fatal(err)
	}

	return res["0"].(bool)
}

func isCitizen(account string) bool {
	var functions = []string{
		"function isCitizen(address account) public view returns (bool)",
	}
	abiContract, err := abi.NewABIFromList(functions)
	if err != nil {
		log.Fatal(err)
	}
	addr := ethgo.HexToAddress(contract_address)
	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		log.Fatal(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("isCitizen", ethgo.Latest, account)
	if err != nil {
		log.Fatal(err)
	}

	return res["0"].(bool)
}

func hasMinted(account string) bool {
	var functions = []string{
		"function balanceOf(address owner) view returns (uint256)",
	}
	abiContract, err := abi.NewABIFromList(functions)
	if err != nil {
		log.Fatal(err)

	}
	addr := ethgo.HexToAddress(contract_address)
	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		log.Fatal(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("balanceOf", ethgo.Latest, account)
	if err != nil {
		log.Fatal(err)
	}

	return res["0"].(*big.Int).Cmp(big.NewInt(1)) == 0
}

func Login(ctx *fiber.Ctx) error {
	account := ctx.FormValue("account")
	signature := ctx.FormValue("signature")
	msg := "sign in with:\n" + account
	// // Throws Unauthorized error
	if !VerifySig([]byte(msg), account, signature) {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}
	// Set Auth Role
	// NOTE: Can only be one role, and in this heirarchy!
	var role = "public"
	if isOp(account) {
		role = "OP_ROLE"
	}
	if isOpCo(account) {
		role = "OPCO_ROLE"
	}
	if isCitizen(account) {
		role = "OPCO_CITIZEN_ROLE"
	}

	// Create the Claims
	claims := jwt.MapClaims{
		"account":   account,
		"signature": signature,
		"role":      role,
		"minted":    hasMinted(account),
		"exp":       time.Now().Add(time.Hour).Unix(),
	}
	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte(signature_secret))
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{
		"access_token": t,
		"token_type":   "bearer",
	})
}
