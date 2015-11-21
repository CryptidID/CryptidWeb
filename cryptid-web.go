package main
// /http://www.alexedwards.net/blog/form-validation-and-processing

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"html/template"
	"log"
	"./pkg/factom"
	"strconv"
	"encoding/base64"
	"encoding/hex"
	// "os"
	// "net/url"
	// "regexp" // Used in data cleaning
	// "strings" // Used in data cleaning
)

type FormData struct {
  ChainID string
  Password string
  Errors  map[string]string
}

type Message struct {
	message string
}

var IndexHTML []byte

func init() {
    IndexHTML, _ = ioutil.ReadFile("index.html")
}


func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
    http.HandleFunc("/", indexHandler)
    err := http.ListenAndServe(":9090", nil) // setting listening port
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Println("method:", r.Method) //get request method
	var siteMessage Message
	siteMessage.message = "show up"
    if r.Method == "GET" {
		var sherrifTmpl = template.New("index.html")
		template.Must(sherrifTmpl.ParseFiles("index.html")).ExecuteTemplate(w, "index.html", "")
    } else {
        r.ParseForm()

        fmt.Println("chainid:", r.Form["chainIDBase64"])
        fmt.Println("password:", r.Form["password"])
		formData := &FormData{
			ChainID: r.FormValue("chainIDBase64"),
			Password: r.FormValue("password"),
		}

		l, _ := base64.StdEncoding.DecodeString(formData.ChainID)
		var y = hex.EncodeToString(l)
		x, err := factom.GetAllChainEntries(y)
		fmt.Println(y)
		// var x *factom.Entry
		// var err error
		// x, err = factom.GetEntry(formData.ChainID)
		if err != nil {
			siteMessage.message = "Error in getting chain entries"
		} else {
			//siteMessage.message = string(x[0].Content[:len(x[0].Content)])
			//siteMessage.message = string(x.Content[:len(x.Content)])
			siteMessage.message = "Success " + strconv.Itoa(len(x))
		}
		//fmt.Println(string(x.Content[:len(x.Content)]))
		//fmt.Println(string(x[0].Content[:len(x[0].Content)]))
		var sherrifTmpl = template.New("index.html")
		template.Must(sherrifTmpl.ParseFiles("index.html")).ExecuteTemplate(w, "index.html", siteMessage)
    }
}
