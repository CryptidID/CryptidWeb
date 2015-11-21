package test

import (
	"./pkg/libcryptid"

	"fmt"
	"crypto/x509"
	"encoding/pem"
	"io/ioutil"
	"log"

	"crypto/rsa"
)

func main() {
	fmt.Print("STARTING TESTS BRO\n")

	// Init mock data

	//Load private key from disk
	pemData, err := ioutil.ReadFile("./pkg/private.key")
	if err != nil {
			log.Fatalf("read key file: %s", err)
	}

	// Extract the PEM-encoded data block
	block, _ := pem.Decode(pemData)
	if block == nil {
			log.Fatalf("bad key data: %s", "not PEM-encoded")
	}
	if got, want := block.Type, "RSA PRIVATE KEY"; got != want {
			log.Fatalf("unknown key type %q, want %q", got, want)
	}

	// Decode the RSA private key
	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
			log.Fatalf("bad private key: %s", err)
	}

	// Public key shit
	pemBytes, err2 := ioutil.ReadFile("./pkg/public.key")
	 if err2 != nil {
	   return
	 }
	 block2, _ := pem.Decode(pemBytes)
	 if block == nil {
	   return
	 }
	 key, err4 := x509.ParsePKIXPublicKey(block2.Bytes)
	 if err4 != nil {
	   return
	 }
	 pub, ok := key.(*rsa.PublicKey)
	 if !ok {
	   return
	 }

	password := "0207Tiger 123"
	packed, _ := ioutil.ReadFile("C:\\Users\\Steven\\Desktop\\Masley-Joseph-Steven.cid")
	c, uid := libcryptid.Unpack(packed, password, *pub)

	// Print packed data
	//data := c.Pack(password, *priv)
	priv = priv
	fmt.Print("dcs = ", c.DCS, "\n")
	fmt.Printf("Length: %d bytes\n", len(uid))
}
