package libcryptid

import (
	"gopkg.in/vmihailenco/msgpack.v2"
	"crypto/rsa"
	"crypto/sha512"
	"log"
)

type Candidate struct {
	DCS, DAC, DAD, DBD, DBB, DAY, DAU, DAG, DAI, DAJ, DAK, DCG string
	DBC int
	//IMAGE, FINGERPRINT
	ZAA, ZAB []byte
}

func VerifySignature(packed []byte, pubKey rsa.PublicKey) bool {
	sig := packed[len(packed) - 512:]
	data := packed[:len(packed) - 512]
	return RSAVerify(pubKey, data, sig)
}

func (c Candidate) Pack(password string, privKey rsa.PrivateKey) []byte {
	// Pack IDData with messagepack
	data, err := msgpack.Marshal(&c)
	if err != nil {
		panic(err)
	}

	// Encrypt packed data with provided password
	data, err = AESEncrypt(password, data)
	if err != nil {
		panic(err)
	}

	// Generate a unique ID by hashing the encrypted IDData
	uid := sha512.Sum512(data)

	// Append the uid to the front of encrypted data
	data = append(uid[:], data[:]...)

	// Sign the data and append the RSA signature to the end
	sig, err := RSASign(privKey, data)
	if err != nil {
		panic(err)
	}

	data = append(data[:], sig[:]...)

	return data
}

func Unpack(packed []byte, password string, pubKey rsa.PublicKey) (Candidate, []byte) {
	// Check if the RSA signature is valid
	if(!VerifySignature(packed, pubKey)) {
		log.Fatalf("Couldn't verify signature")
		return Candidate{}, nil
	}

	// Extract the UID for later
	uid := packed[:64]

	// Decrypt candidate data
	data, err := AESDecrypt(password, packed[64:len(packed) - 512])
	if(data == nil || err != nil) {
		log.Fatalf("Couldn't decrypt data; check password")
		return Candidate{}, nil
	}

	// Deserialize the candidate and return candidate, uid
	var c Candidate
	err = msgpack.Unmarshal(data, &c)
	if err != nil {
		panic(err)
		return Candidate{}, nil
	}

	return Candidate{}, uid
}

//MESSAGE PACK
var (
	_ msgpack.CustomEncoder = &Candidate{}
	_ msgpack.CustomDecoder = &Candidate{}
)

func (c *Candidate) EncodeMsgpack(enc *msgpack.Encoder) error {
	return enc.Encode(c.DCS, c.DAC, c.DAD, c.DBD, c.DBB, c.DBC, c.DAY, c.DAU, c.DAG, c.DAI, c.DAJ, c.DAK, c.DCG, c.ZAA, c.ZAB)
}

func (c *Candidate) DecodeMsgpack(dec *msgpack.Decoder) error {
	return dec.Decode(&c.DCS, &c.DAC, &c.DAD, &c.DBD, &c.DBB, &c.DBC, &c.DAY, &c.DAU, &c.DAG, &c.DAI, &c.DAJ, &c.DAK, &c.DCG, &c.ZAA, &c.ZAB)
}
