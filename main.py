from http.server import HTTPServer, BaseHTTPRequestHandler
from scrapePrices import scrapePrices
from urllib.parse import urlparse, unquote
import json

HOST = "localhost"
PORT = 8000

class priceScraper(BaseHTTPRequestHandler):

    def do_POST(self):

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        content_length = int(self.headers.get('content-length', 0))
        post_data = self.rfile.read(content_length)
        post_unicode = post_data.decode('utf-8')
        post_json = json.loads(post_unicode)
        
        post_res = scrapePrices(post_json['url'])
        print(post_res)
        post_res = json.dumps(post_res)

        self.wfile.write(post_res.encode('utf-8'))

server = HTTPServer((HOST, PORT), priceScraper)
print("Server running on: ", PORT)
server.serve_forever()
server.server_close()
print("Server stopped")
