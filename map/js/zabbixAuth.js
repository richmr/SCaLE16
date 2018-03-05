/*
Copyright 2018 Michael R Rich (mike@tofet.net)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

username = "mrich";
password = "bob1234sam";
zabhost = "http://scalezab.com/zabbix/";
apilink = "api_jsonrpc.php";

server = new $.jqzabbix({
    url: zabhost+apilink,  // URL of Zabbix API
    username: username,   // Zabbix login user name
    password: password,  // Zabbix login password
    basicauth: false,    // If you use basic authentication, set true for this option
    busername: '',       // User name for basic authentication
    bpassword: '',       // Password for basic authentication
    timeout: 5000,       // Request timeout (milli second)
    limit: 1000,         // Max data number for one request
});

function zabtest1() {
	server.getApiVersion(null, zabbixAPICheckSuccess, null);
	server.userLogin(null, zabbixAuthResponseSuccess, zabbixAuthResponseFail);
}
