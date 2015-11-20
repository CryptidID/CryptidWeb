package main
// /http://www.alexedwards.net/blog/form-validation-and-processing

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"html/template"
	"log"
	// "net/url"
	// "regexp" // Used in data cleaning
	// "strings" // Used in data cleaning
)

type FormData struct {
  FirstName string
  LastName string
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
    //http.HandleFunc("/", sayhelloName) // setting router rule
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
		var sherrifTmpl = template.New("index.html").Delims("{[{", "}]}")
		template.Must(sherrifTmpl.ParseFiles("index.html")).ExecuteTemplate(w, "index.html", siteMessage)
    } else {
        r.ParseForm()
        // logic part of log in
        fmt.Println("username:", r.Form["chainIDBase64"])
        fmt.Println("password:", r.Form["password"])
		formData := &FormData{
			FirstName: r.FormValue("chainIDBase64"),
			LastName: r.FormValue("password"),
		}
		fmt.Println(formData.FirstName + formData.LastName + siteMessage.message)
		// t, _ := template.ParseFiles("index.gtpl")
        // t.Execute(w, siteMessage)
		var sherrifTmpl = template.New("index.html").Delims("{[{", "}]}")
		template.Must(sherrifTmpl.ParseFiles("index.html")).ExecuteTemplate(w, "index.html", siteMessage.message)
    }
}
