package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"

	"github.com/saurabhmittal16/filecryptor"
)

type request struct {
	Path string `json:"path"`
	Password string `json:"password"`
}

func root(w http.ResponseWriter, r *http.Request) {
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

func main() {
	port := 8081

	http.HandleFunc("/", root)
	fmt.Printf("Service running at port: %d\n", port)
	log.Fatal(http.ListenAndServe(":8081", nil))
}