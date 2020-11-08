package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"encoding/json"
	"path/filepath"

	"github.com/saurabhmittal16/filecryptor"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandStringBytes(n int) string {
    b := make([]byte, n)
    for i := range b {
        b[i] = letterBytes[rand.Intn(len(letterBytes))]
    }
    return string(b)
}

type request struct {
	Path string `json:"path"`
	Password string `json:"password"`
}

func handleEncryption(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var body request
	err := decoder.Decode(&body)

	if err != nil {
		panic(err)
	}

	encrypted_path := body.Path + ".enc"
	err = filecryptor.Encrypt(body.Password, body.Path, encrypted_path)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte("Encryption failed"))
		log.Println("Encryption failed for path: " + body.Path + ". Error message: " + err.Error())
	} else {
		w.WriteHeader(http.StatusOK)
		_, err = w.Write([]byte(encrypted_path))
		log.Println("Encryption successful for path: " + encrypted_path)
		if err != nil {
			panic(err)
		}
	}
}


func handleDecryption(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var body request
	err := decoder.Decode(&body)

	if err != nil {
		panic(err)
	}

	encrypted_path := body.Path
	decrypted_path := RandStringBytes(10) + filepath.Ext(body.Path[:len(body.Path) - 4])

	err = filecryptor.Decrypt(body.Password, encrypted_path, "../tmp/" + decrypted_path)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte("Decryption failed"))
		log.Println("Decryption failed for path: " + body.Path + ". Error message: " + err.Error())
	} else {
		w.WriteHeader(http.StatusOK)
		_, err = w.Write([]byte(decrypted_path))
		log.Println("Decryption successful for path: " + encrypted_path)
		if err != nil {
			panic(err)
		}
	}
}

func main() {
	port := 8081

	http.HandleFunc("/encrypt", handleEncryption)
	http.HandleFunc("/decrypt", handleDecryption)
	fmt.Printf("Service running at port: %d\n", port)
	log.Fatal(http.ListenAndServe(":8081", nil))
}