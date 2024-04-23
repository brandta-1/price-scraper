from http.server import HTTPServer, BaseHTTPRequestHandler
from scrapeContainer import scrapeContainer
from scrapeReward import scrapeReward
from scrapeRare import scrapeRare
from urllib.parse import urlparse, unquote
from time import sleep
import json

HOST = "localhost"
PORT = 8000

class priceScraper(BaseHTTPRequestHandler):

    def do_POST(self):

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        print("recieved request")
        content_length = int(self.headers.get('content-length', 0))
        post_data = self.rfile.read(content_length)
        post_unicode = post_data.decode('utf-8')
        post_json = json.loads(post_unicode)

        # post_res = scrapeRare(post_json['url'])
        
        # if(post_json['type'] == 'container'):
            # post_res = scrapeContainer(post_json['url'])
         
        # if(post_json['type'] == 'reward'):
            # post_res = scrapeReward(post_json['url'],post_json['name'])
        if self.path == '/api/produceDashboard':
            sleep(0.55)
            post_res = {"teamsCount": 313, "largestTeamSize": 7, "teamswithOver4Members": 8 }
        print(post_res)
        post_res = json.dumps(post_res)    
        self.wfile.write(post_res.encode('utf-8'))

server = HTTPServer((HOST, PORT), priceScraper)
print("Server running on: ", PORT)
server.serve_forever()
server.server_close()
print("Server stopped")
