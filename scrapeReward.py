import json
import re 
import requests
import html
from bs4 import BeautifulSoup

def scrapeReward(rewardURL, rewardName):

    headers = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }

    url = rewardURL
    print('scrapeReward running')
    rewardPage = BeautifulSoup(requests.get(url, headers=headers).text, 'html.parser')
    priceChart = rewardPage.find("tbody")
    prices = priceChart.find_all("a",{"class": "market-button-skin"})

    res = []
    for price in prices:
        encodedName = re.search("[^/]+(?=\/$|$)",price.get("href")).group()
        name = encodedName.replace("%20", " ").replace("%7C", "|").replace("%E2%84%A2","").replace(rewardName,"").replace(" %28", "%28")
        marketPrice = price.string
       
        # print(name, " ", marketPrice)
        
        res.append({"name": name, "price": marketPrice})

    #print('\n\n\n',testDict)    
    return res
    # print(priceChart,"\n\n\n")
    # print(prices[0])