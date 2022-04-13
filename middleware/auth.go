package middleware

import (
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/umbracle/ethgo"
	"github.com/umbracle/ethgo/abi"
	"github.com/umbracle/ethgo/contract"
	"github.com/umbracle/ethgo/jsonrpc"
)

var rpc_endpoint = os.Getenv("RPC_ENDPOINT")
var contract_address = os.Getenv("CONTRACT_ADDRESS")
var sign_message = os.Getenv("SIGN_MESSAGE")

func VerifySig(message []byte, from, sigHex string) bool {
	sig := hexutil.MustDecode(sigHex)
	fmt.Println(sigHex)
	fmt.Println(sig)

	msg := accounts.TextHash(message)
	fmt.Println(msg)
	sig[crypto.RecoveryIDOffset] -= 27 // Transform yellow paper V from 27/28 to 0/1

	recovered, err := crypto.SigToPub(msg, sig)
	if err != nil {
		return false
	}

	recoveredAddr := crypto.PubkeyToAddress(*recovered)
	fmt.Println(recoveredAddr.Hex())
	fmt.Println(from)

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

	addr := ethgo.HexToAddress(contract_address)

	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		panic(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("hasRole", ethgo.Latest, crypto.Keccak256Hash([]byte("OP_ROLE")), account)
	if err != nil {
		panic(err)
	}

	// nonce, err := client.Eth().GetNonce(addr, ethgo.Latest)
	// fmt.Println(crypto.Keccak256([]byte("1")))

	// message := []byte("1")

	// return VerifySig([]byte("1"), account, signature) && res["0"].(bool)
	return res["0"].(bool)
}

func HolderAuth(account, signature string) bool {

	var functions = []string{
		"function balanceOf(address owner) view returns (uint256)",
	}

	abiContract, err := abi.NewABIFromList(functions)
	if err != nil {
		panic(err)
	}

	addr := ethgo.HexToAddress(contract_address)

	client, err := jsonrpc.NewClient(rpc_endpoint)
	if err != nil {
		panic(err)
	}

	c := contract.NewContract(addr, abiContract, client)
	res, err := c.Call("balanceOf", ethgo.Latest, account)
	if err != nil {
		panic(err)
	}

	// nonce, err := client.Eth().GetNonce(addr, ethgo.Latest)

	// message := crypto.Keccak256Hash([]byte(strconv.FormatUint(nonce, 18))).Bytes()
	// return VerifySig(message, account, signature) && res["0"].(*big.Int).Cmp(big.NewInt(1)) == 0
	return res["0"].(*big.Int).Cmp(big.NewInt(1)) == 0
}

func Login(c *fiber.Ctx) error {
	account := c.FormValue("account")
	signature := c.FormValue("signature")

	msg := "sign in with:\n" + account
	// // Throws Unauthorized error
	if !VerifySig([]byte(msg), account, signature) {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// Create the Claims
	claims := jwt.MapClaims{
		"account":   account,
		"signature": signature,
		"role":      "public",
		"exp":       time.Now().Add(time.Hour).Unix(),
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	// cookie := new(fiber.Cookie)
	// cookie.Name = "jwt-session"
	// cookie.Value = t
	// cookie.Expires = time.Now().Add(24 * time.Hour)

	// // Set cookie
	// c.Cookie(cookie)

	fmt.Println(t)

	cookie := fiber.Cookie{
		Name:     "access_token",
		Value:    t,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
		Secure:   true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"access_token": t,
		// "refresh_token": tokens["refresh_token"],
		"token_type": "bearer",
	})

	// return c.JSON(fiber.Map{"token": t})
}
