const cases = require('./cases.json');
const containers = require('./containers/containersRaw.json');
const floats = require('./floatData.json');
const FileSystem = require('fs');
let newCrates = [];
const findRareURLs = async (caseURL) => {
    return await fetch('http://localhost:8000/',{
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({url: caseURL })
       }).then((res)=> res.json()).then((res)=> {return (res)})
};

const getRares = async (container, url) => {
    await findRareURLs(url).then((res)=> {
        container.contains_rare.forEach((skin,j)=> {
            newCrates[newCrates.length-1].contains_rare.push({
                name: skin.name,
                rarity: skin.rarity,
                floatCaps: "", 
                url: findURL(res,skin.name)
            })
        });
    });
}

const findURL = (array, string) => {
    returnURL = "";
    searchString = string.substring(2).replace(" |","").replace(/\s/g,"-");
    if(!searchString.includes("-")){
        searchString = searchString + "-Vanilla"
    }
    for(let i =0; i < array.length; i++){
        if(array[i].includes(searchString)){
            returnURL = array[i];
            break;
        }
    }
    return returnURL;
}

const runFile = async () => {
    let k = 0;
    
    for await(const [i,crate] of Object.entries(containers)){

        // await findRareURLs(i.url).then((res)=>{
        //     console.log("js res:", res);
        // });
        if (crate.type != 'Case'){
            continue;
        }

        newCrates.push(cases[k]);
        newCrates[k].contains_rare = [];

        await getRares(crate, cases[k].url);
        k++;  
        await sleep(3000);
    }

    for (const float in floats ){
        const floatCaps = floats[float]['float-caps'];
        for( let j=0; j< newCrates.length; j++){
            for( let i = 0; i<newCrates[j].contains_rare.length; i++){
                let testName = newCrates[j].contains_rare[i].name
                console.log(testName);
                if(testName.includes("Gloves |") || testName.includes("Wraps |")){
                    newCrates[j].contains_rare[i].floatCaps = [0.06,0.80]
                }
                testName = `\u2605 ${testName.substring(2)}`;
                if(!testName.includes("|")){
                    testName = testName + " | Vanilla"
                }
                // console.log("float name: ", float, " floatCaps: ", floatCaps, " newCrate name: ", testName)
                if(testName == float){
                    console.log("float found")
                    newCrates[j].contains_rare[i].floatCaps = floatCaps;
                }
            }
        }
    }
    FileSystem.writeFileSync('containersFormattedWithRares.json', JSON.stringify(newCrates,null,2));
    
    function sleep(ms){
        return new Promise((res)=>{
            setTimeout(()=>res(true), ms);
        });
    }
}

runFile();


    

     
  
  



