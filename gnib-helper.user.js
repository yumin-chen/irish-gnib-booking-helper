// ==UserScript==
// @name         Irish GNIB Booking Helper
// @namespace    https://github.com/chen-yumin/irish-gnib-booking-helper
// @version      0.2
// @description  Auto check appointment availability on the Irish GNIB booking page.
// @author       Chen Yumin
// @match        https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/AppSelect?OpenForm
// @grant        none
// @downloadURL  https://github.com/chen-yumin/irish-gnib-booking-helper/raw/master/gnib-helper.user.js
// ==/UserScript==

{
    'use strict';

    const categories = ['Work', 'Study'];
    const types = ['New', 'Renewal'];
    const getAppoinmentsLink = function(cat, type) {
        return `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getAppsNear)?openpage&cat=${cat}&sbcat=All&typ=${type}`;
    }

    const checkAvailability = function() {
        categories.forEach((cat) => {
            types.forEach((type) => {
                fetch(getAppoinmentsLink(cat, type))
                    .then(response => {
                        response.json().then(data => formatResults(cat, type, data));
                    })
                    .catch(error => console.error('Error:', error))
            })
        })   
    }

    const resultElements = {};
    const formatResults = function(cat, type, result) {
        console.debug(result);
        console.debug(resultElements[cat]);
        if (!resultElements[cat]) {
            resultElements[cat] = document.createElement('div'); 
            resultElements[cat].style.cssText = 'display: inline-block; background: #f8f8f8; border: 1px solid #ccc; border-radius: 4px; margin-right: 16px; padding: 16px;'; 
            const catTitle = document.createElement('div');
            catTitle.appendChild(document.createTextNode(cat));
            catTitle.style.cssText = 'font-size: 1.8rem; font-weight:bold; color: rgb(0, 52, 128)';
            resultElements[cat].appendChild(catTitle);
            document.getElementById("dvInputHead").appendChild(resultElements[cat]);
            console.debug(resultElements[cat]);
        }
        if (!resultElements[cat][type]) {
            resultElements[cat][type] = document.createElement("div");
            const typeTitle = document.createElement('div');
            typeTitle.appendChild(document.createTextNode(type));
            typeTitle.style.cssText = 'font-size: 1.5rem; color: #345';
            resultElements[cat][type].appendChild(typeTitle);
            resultElements[cat].appendChild(resultElements[cat][type]);
        }
        
        const content = document.createElement('div');
        if (result.empty == 'TRUE') {
            content.style.cssText = 'font-size: 1.2rem; color: #600';
            content.appendChild(document.createTextNode('None Available.'));
        } else {
            content.style.cssText = 'font-size: 1.2rem; color: #060';
            result.slots.forEach((slot) => {
                content.appendChild(document.createTextNode(slot.time));  
            });
        }
        resultElements[cat][type].appendChild(content);  
    }

    checkAvailability();
}