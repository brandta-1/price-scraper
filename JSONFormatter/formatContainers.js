
const containers = require('./containers/containersRaw.json');
const floats = require('./floatData.json');

const weaponCases = require('./containers/case');
const stickerCases = require('./containers/sticker');
const autoCases = require('./containers/autograph');
const FileSystem = require('fs');

const findURL = (array,urlName) => {

    //match the reward url within the list of reward urls from a given container
    for( let i =0; i<array.length; i++){
        if(array[i].match(/[^/]+(?=\/$|$)/g)[0] == urlName ){
            return array[i]
        }
    }
}

//find the list of reward urls from a given container
const findRewardURLs = async (caseURL) => {
     return await fetch('http://localhost:8000/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: caseURL})
        }).then((res)=> res.json()).then((res)=> {return (res)})
}


//write rewards and their urls to their container
const getRewards = async (container, url) => {
    await findRewardURLs(url).then((res)=> {
        container.contains.forEach((skin,j)=> {
            newCrates[newCrates.length-1].contains.push({
                name: skin.name,
                rarity: skin.rarity,
                floatCaps: "", 
                url: findURL(res,getURLName(skin.name))
            })
        })
    });
}

//todo this needs to be regex, even though their character encoding is seemingly arbitrary
const getURLName = (nameString) => {
    return nameString
    .replaceAll(" | ", "-")
    .replaceAll(" ","-")
    .replaceAll(")","")
    .replaceAll("(","")
    .replaceAll("/","-")
    .replaceAll(".","")
    .replaceAll(",","")
    .replaceAll(",","-");
}

const newCrates=[];

const runFile = async () => {

//TODO this should be map()
    for await(const [i,crate] of Object.entries(containers)){

        //TODO: implement scraping for stickers and autograph containers
        if (crate.type != 'Case'){
            continue;
        }

        const urlName = getURLName(crate.name);
        const csgoStashURL = findURL(weaponCases,urlName);

        newCrates.push({
            name: crate.name,
            type: crate.type,
            url: csgoStashURL,
            contains: []
        })

        if(csgoStashURL != undefined){
            await getRewards(crate, csgoStashURL, i);
        }

        // console.log(JSON.stringify(newCrates,null,2))
        await sleep(3000);
    }

    for(const float in floats ){
        const floatCaps = floats[float]['float-caps'];
        let foundItem = false;

        for( let j=0; j< newCrates.length; j++){
            if(foundItem){
                break;
            }

            for( let i =0; i<newCrates[j].contains.length; i++){
                if(newCrates[j].contains[i].name === float){
                    newCrates[j].contains[i].floatCaps = floatCaps;
                    foundItem = true;
                }
            }
        }
    }

    FileSystem.writeFileSync('containersFormatted.json', JSON.stringify(newCrates,null,2));

    function sleep(ms){
        return new Promise((res)=>{
            setTimeout(()=>res(true), ms);
        });
    }
}

runFile();