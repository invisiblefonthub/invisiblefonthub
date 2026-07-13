"use strict";

/*==================================
Invisible Font Hub
Production JavaScript
==================================*/

/*==================================
Selectors
==================================*/

const menuButton=document.getElementById("menuButton");

const mobileMenu=document.getElementById("mobileMenu");

const textInput=document.getElementById("textInput");

const fontInput=document.getElementById("fontInput");

const generateButton=document.getElementById("generateButton");

const fontResults=document.getElementById("fontResults");

const toast=document.getElementById("toast");

const copyAllFonts=document.getElementById("copyAllFonts");

const clearText=document.getElementById("clearText");

const copyInvisible=document.getElementById("copyInvisible");

const copyDouble=document.getElementById("copyDouble");

const copyTriple=document.getElementById("copyTriple");

const invisiblePreview=document.getElementById("invisiblePreview");

/*==================================
Invisible Characters
==================================*/

const invisible={

single:"ㅤ",

double:"ㅤㅤ",

triple:"ㅤㅤㅤ"

};

/*==================================
Font Database
==================================*/

const fonts=[

{

name:"Bold",

convert:text=>text

},

{

name:"Uppercase",

convert:text=>text.toUpperCase()

},

{

name:"Lowercase",

convert:text=>text.toLowerCase()

},

{

name:"Reverse",

convert:text=>text.split("").reverse().join("")

},

{

name:"Wide",

convert:text=>text.split("").join(" ")

}

];

/*==================================
Toast
==================================*/

function showToast(message){

toast.textContent=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2200);

}

/*==================================
Clipboard
==================================*/

async function copyText(value){

try{

await navigator.clipboard.writeText(value);

showToast("Copied Successfully");

}

catch{

showToast("Copy Failed");

}

}

/*==================================
Generate Fonts
==================================*/

function renderFonts(text){

fontResults.innerHTML="";

if(text.trim()===""){

return;

}

fonts.forEach(font=>{

const row=document.createElement("div");

row.className="font-item";

const preview=document.createElement("div");

preview.className="font-preview";

preview.textContent=font.convert(text);

const button=document.createElement("button");

button.className="copy-btn";

button.textContent="Copy";

button.addEventListener("click",()=>{

copyText(font.convert(text));

});

row.append(preview);

row.append(button);

fontResults.append(row);

});

}

/*==================================
Generate Button
==================================*/

generateButton.addEventListener("click",()=>{

const value=textInput.value.trim();

fontInput.value=value;

renderFonts(value);

});

/*==================================
Live Preview
==================================*/

fontInput.addEventListener("input",()=>{

textInput.value=fontInput.value;

renderFonts(fontInput.value);

});

/*==================================
Clear Text
==================================*/

clearText.addEventListener("click",()=>{

textInput.value="";

fontInput.value="";

fontResults.innerHTML="";

textInput.focus();

});

/*==================================
Copy All Fonts
==================================*/

copyAllFonts.addEventListener("click",()=>{

const value=fontInput.value.trim();

if(value===""){

showToast("Enter Some Text");

return;

}

let output="";

fonts.forEach(font=>{

output+=font.convert(value)+"\n";

});

copyText(output);

});

/*==================================
Invisible Character Buttons
==================================*/

copyInvisible.addEventListener("click",()=>{

copyText(invisible.single);

invisiblePreview.textContent=invisible.single;

});

copyDouble.addEventListener("click",()=>{

copyText(invisible.double);

invisiblePreview.textContent=invisible.double;

});

copyTriple.addEventListener("click",()=>{

copyText(invisible.triple);

invisiblePreview.textContent=invisible.triple;

});

/*==================================
Category Tabs
==================================*/

const tabs=document.querySelectorAll(".tab");

tabs.forEach(tab=>{

tab.addEventListener("click",()=>{

tabs.forEach(item=>item.classList.remove("active"));

tab.classList.add("active");

});

});

/*==================================
Mobile Menu
==================================*/

menuButton.addEventListener("click",()=>{

mobileMenu.classList.toggle("show");

});

/*==================================
Close Mobile Menu
==================================*/

mobileMenu.querySelectorAll("a").forEach(link=>{

link.addEventListener("click",()=>{

mobileMenu.classList.remove("show");

});

});

/*==================================
Smooth Scroll
==================================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

link.addEventListener("click",event=>{

const target=document.querySelector(link.getAttribute("href"));

if(!target){

return;

}

event.preventDefault();

target.scrollIntoView({

behavior:"smooth",

block:"start"

});

});

});

/*==================================
Auto Focus
==================================*/

window.addEventListener("load",()=>{

textInput.focus();

});

/*==================================
Unicode Symbols
==================================*/

const symbolGrid=document.getElementById("symbolGrid");

const symbolData=[

"★","☆","✦","✧","✪","✯","✰","✮",

"❤","♡","♥","❥","❣","💕","💖","💙",

"✓","✔","✕","✖","➜","➤","➥","➔",

"☠","☢","☣","⚡","🔥","❄","☯","☘",

"♛","♚","♕","♔","♜","♞","♝","♟",

"∞","§","※","✿","❀","✾","✽","✦"

];

function renderSymbols(){

if(!symbolGrid){

return;

}

symbolGrid.innerHTML="";

symbolData.forEach(symbol=>{

const item=document.createElement("div");

item.className="symbol-item";

item.textContent=symbol;

item.addEventListener("click",()=>{

copyText(symbol);

});

symbolGrid.appendChild(item);

});

}

/*==================================
Nickname Generator
==================================*/

const nicknameResults=document.getElementById("nicknameResults");

const nicknameStyle=document.getElementById("nicknameStyle");

const generateNickname=document.getElementById("generateNickname");

const nicknameDatabase={

pro:["亗LEGEND亗","『PRO』KING","乂MASTER乂","⚡HUNTER⚡"],

legend:["『LEGEND』","༒LEGEND༒","★LEGEND★","♛LEGEND♛"],

killer:["KILLERメ","☠KILLER☠","⚔KILLER⚔","◥KILLER◤"],

royal:["♛ROYAL♛","么ROYAL么","『ROYAL』","👑ROYAL"],

cute:["♡CUTIE♡","✿ANGEL✿","❀CUTE❀","♥BABY♥"],

dark:["DARKツ","☠DARK☠","◥SHADOW◤","⚡DARK⚡"]

};

function generateNicknames(){

if(!nicknameResults){

return;

}

nicknameResults.innerHTML="";

const style=nicknameStyle.value;

nicknameDatabase[style].forEach(name=>{

const row=document.createElement("div");

row.className="nickname-item";

const text=document.createElement("div");

text.className="font-preview";

text.textContent=name;

const button=document.createElement("button");

button.className="copy-btn";

button.textContent="Copy";

button.addEventListener("click",()=>{

copyText(name);

});

row.append(text);

row.append(button);

nicknameResults.appendChild(row);

});

}

if(generateNickname){

generateNickname.addEventListener("click",generateNicknames);

}

/*==================================
Initialization
==================================*/

renderSymbols();

generateNicknames();

renderFonts("");

console.log("Invisible Font Hub Loaded Successfully");
