import json
import re 
import requests
from bs4 import BeautifulSoup

def scrapePrices(caseURL):

    headers = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }

    url = caseURL

    case = BeautifulSoup(requests.get(url, headers=headers).text, 'html.parser')
    skins = case.find_all("div", {"class": "well result-box nomargin"})
    links = []

    for skin in skins:
        aTag = skin.find_all("a")
        if(aTag is not None and len(aTag) > 0):
            #TODO this will need to be reconfigured for scraping stickers
            links.append(aTag[3].get("href"))

    links.pop(0)    
    return links