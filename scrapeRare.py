import json
import re 
import requests
import html
from bs4 import BeautifulSoup

def scrapeRare(caseURL):
    headers = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    url = caseURL
    casePage = BeautifulSoup(requests.get(url, headers=headers).text, 'html.parser')
    raresURLBox = casePage.find("div", {"class": "well result-box nomargin"})
    raresURL = raresURLBox.find("a").get("href")
   
    rarePage = BeautifulSoup(requests.get(raresURL, headers=headers).text, 'html.parser')
    skins = rarePage.find_all("div", {"class": "well result-box nomargin"})
    
    links = []
    knife = raresURL.find("Knives")
   
    for skin in skins:
        aTag = skin.find_all("a")
        if(aTag is not None and len(aTag) > 0):
            #TODO this will need to be reconfigured for scraping stickers
            if(knife >= 0):
                links.append(aTag[3].get("href"))
            else:
                links.append(aTag[0].get("href"))

    links.pop(0)    
    return links
 