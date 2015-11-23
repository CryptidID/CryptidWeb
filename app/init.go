package app

import "github.com/revel/revel"
import "net/http"
import "io"
import "regexp"
import "github.com/tdewolff/minify"
import "github.com/tdewolff/minify/css"
import "github.com/tdewolff/minify/html"
import "github.com/tdewolff/minify/js"
import "github.com/tdewolff/minify/svg"
import "github.com/tdewolff/minify/json"
import "github.com/tdewolff/minify/xml"

func init() {
	// Filters is the default set of global filters.
	revel.Filters = []revel.Filter{
		revel.PanicFilter,             // Recover from panics and display an error page instead.
		revel.RouterFilter,            // Use the routing table to select the right Action
		revel.FilterConfiguringFilter, // A hook for adding or removing per-Action filters.
		revel.ParamsFilter,            // Parse parameters into Controller.Params.
		revel.SessionFilter,           // Restore and write the session cookie.
		revel.FlashFilter,             // Restore and write the flash cookie.
		revel.ValidationFilter,        // Restore kept validation errors and save new ones from cookie.
		revel.I18nFilter,              // Resolve the requested language
		HeaderFilter,                  // Add some security based headers
		revel.InterceptorFilter,       // Run interceptors around the action.
		revel.CompressFilter,          // Compress the result.
		revel.ActionInvoker,           // Invoke the action.
		MinifyFilter,
	}

	// register startup functions with OnAppStart
	// ( order dependent )
	// revel.OnAppStart(InitDB)
	// revel.OnAppStart(FillCache)
}

// TODO turn this into revel.HeaderFilter
// should probably also have a filter for CSRF
// not sure if it can go in the same filter or not
var HeaderFilter = func(c *revel.Controller, fc []revel.Filter) {
	// Add some common security headers
	c.Response.Out.Header().Add("X-Frame-Options", "SAMEORIGIN")
	c.Response.Out.Header().Add("X-XSS-Protection", "1; mode=block")
	c.Response.Out.Header().Add("X-Content-Type-Options", "nosniff")

	fc[0](c, fc[1:]) // Execute the next filter stage.
}

type MinifyResponseWriter struct {
    http.ResponseWriter
    io.Writer
}

func (f MinifyResponseWriter) Write(b []byte) (int, error) {
    return f.Writer.Write(b)
}

func MinifyFilter(c *revel.Controller, fc []revel.Filter) {
    pr, pw := io.Pipe()
    go func(w io.Writer) {
        m := minify.New()
        m.AddFunc("text/css", css.Minify)
        m.AddFunc("text/html", html.Minify)
        m.AddFunc("text/javascript", js.Minify)
        m.AddFunc("image/svg+xml", svg.Minify)
        m.AddFuncRegexp(regexp.MustCompile("[/+]json$"), json.Minify)
        m.AddFuncRegexp(regexp.MustCompile("[/+]xml$"), xml.Minify)

        if err := m.Minify("mimetype", w, pr); err != nil {
            panic(err)
        }
    }(c.Response.Out)
    c.Response.Out = MinifyResponseWriter{c.Response.Out, pw}
}
