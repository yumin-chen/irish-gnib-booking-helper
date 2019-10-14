// ==UserScript==
// @name         Irish GNIB Booking Helper
// @namespace    https://github.com/chen-yumin/irish-gnib-booking-helper
// @version      0.4
// @description  Auto check appointment availability on the Irish GNIB booking page.
// @author       Chen Yumin
// @match        https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/AppSelect?OpenForm
// @grant        none
// @downloadURL  https://github.com/chen-yumin/irish-gnib-booking-helper/raw/master/gnib-helper.user.js
// ==/UserScript==

{
    'use strict';

    const categories = ['All'];
    const types = ['New', 'Renewal'];
    const getAppoinmentsLink = function(cat, type) {
        const k = document.getElementById("k").value
        const p = document.getElementById("p").value
        return `https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/(getAppsNear)?readform&cat=All&sbcat=${cat}&typ=${type}&k=${k}&p=${p}`;
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
        if (!resultElements.container) {
            resultElements.container = document.createElement('div');
            resultElements.container.style.cssText = 'display: flex';
            document.getElementById("dvInputHead").appendChild(resultElements.container);
        }

        if (!resultElements[cat]) {
            resultElements[cat] = document.createElement('div');
            resultElements[cat].style.cssText = 'background: #f8f8f8; border: 1px solid #ccc; border-radius: 4px; margin-right: 16px; padding: 16px;';
            const catTitle = document.createElement('div');
            catTitle.appendChild(document.createTextNode(cat));
            catTitle.style.cssText = 'font-size: 1.8rem; font-weight:bold; color: rgb(0, 52, 128)';
            resultElements[cat].appendChild(catTitle);
            resultElements.container.appendChild(resultElements[cat]);
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

        const content = document.createElement('ul');
        content.style.cssText = 'list-style-type:none';
        if (result.slots && result.slots[0] === "empty") {
            const li = document.createElement('li')
            li.style.cssText = 'font-size: 1.3rem; color: #600';
            li.innerHTML = 'None Available.';
            content.appendChild(li);
        }
        else {
            result.slots.forEach((slot) => {
                const li = document.createElement('li')
                li.style.cssText = 'font-size: 1.3rem; color: #060';
                li.innerHTML = slot.time;
                content.appendChild(li);
            });
        }
        resultElements[cat][type].appendChild(content);
    }

    checkAvailability();
}