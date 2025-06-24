require('dotenv').config()
const fs = require('fs');


if (!process.env.OPENAI_API_KEY){
    console.error("请设置环境变量 OPENAI_API_KEY");
    process.exit(1);
}

const targetLanguages = [
    {
        "name": "zh-CN",
        "label": "简体中文",
    }
]

async function doTranslate(message, language) {
    const response = await fetch(process.env.OPENAI_API_BASE + "/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(			{
            "model": process.env.OPENAI_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "你是一个翻译助手，你的任务是将英文文本翻译成指定的语言。请将以下英文文本翻译成" + language + "：" + '\n' + '限制：不要输出与翻译无关的任何内容，仅做翻译任务'
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
        }),
    });

    const data = await response.json();

    if (data.error){
        throw new Error("翻译失败: ", data.error.message);
    }

    return data.choices[0].message.content
}

function putObjectValue(obj, key, value) {
    const keys = key.split('##');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) {
            current[k] = {};
        }
        current = current[k];
    }

    current[keys[keys.length - 1]] = value;
}

async function translate(waitTranslateList, targetObject, targetLanguage) {
    let promises = [];
    let doNum = 0;
    let concurrentNum = process.env.OPENAI_API_CONCURRENT || 2;

    for (let i = 0; i < waitTranslateList.length; i++) {
        let item = waitTranslateList[i];

        promises.push(doTranslate(item.message, targetLanguage).then(mesasge => {
            console.log("翻译 key", item.key, "为", targetLanguage, ":", mesasge);
            putObjectValue(targetObject, item.key, mesasge)
        }).catch(e => {
            console.log("翻译失败", item.key, ":", e);
        }).finally(() => {
            doNum++;
            console.log("剩余翻译数量", waitTranslateList.length - doNum);
        }))

        if (promises.length > concurrentNum){
            await Promise.all(promises);
            // 睡眠1s
            await new Promise(resolve => setTimeout(resolve, 1000));

            promises = [];
        }
    }

    if (promises.length > 0){
        await Promise.all(promises);
    }
}

// 收集需要翻译的key和message
function collectMessages(oldSourceLanguages, newSourceLanguages, targetLanguages, parentKey = '', waitTranslateList=[]){
    for (const key in newSourceLanguages) {
        let currentKey = parentKey ? parentKey + "##" + key : key;
        if (newSourceLanguages[key] instanceof Object) {
            collectMessages(oldSourceLanguages[key]  || {}, newSourceLanguages[key], targetLanguages[key] || {}, currentKey, waitTranslateList);
        } else {
            if (targetLanguages[key] === undefined
                || oldSourceLanguages[key] === undefined
                || oldSourceLanguages[key] !== newSourceLanguages[key]) {
                waitTranslateList.push({
                    key: currentKey,
                    message: newSourceLanguages[key]
                })
            }
        }
    }
}


async function run(){
    const oldEnLanguages = require("./en.json");
    const newEnLanguages = await fetch("https://ghfast.top/https://raw.githubusercontent.com/n8n-io/n8n/master/packages/frontend/editor-ui/src/plugins/i18n/locales/en.json")
        .then(res => res.json())

    for (const targetLanguage of targetLanguages) {
        let targetLanguages = {};
        let fileName = `../languages/${targetLanguage.name}.json`;
        if (fs.existsSync(fileName)){
            targetLanguages = JSON.parse(fs.readFileSync(fileName, "utf8"))
        }
        const waitTranslateList = []
        collectMessages(oldEnLanguages, newEnLanguages , targetLanguages, "", waitTranslateList)
        await translate(waitTranslateList, targetLanguages, targetLanguage.label);
        // 最后使用 enLanguages的key  排序 targetLanguages key
        const sortedTargetLanguages = {};
        for (const key in newEnLanguages) {
            if (targetLanguages[key] !== undefined) {
                sortedTargetLanguages[key] = targetLanguages[key];
            }
        }
        // 将翻译后的语言写入文件
        fs.writeFileSync(fileName, JSON.stringify(sortedTargetLanguages, null, 4));
    }
    fs.writeFileSync("./en.json", JSON.stringify(newEnLanguages, null, 4));
}

run();
