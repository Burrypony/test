/*******************************************Ver: 09-08-2021 - fix to open order - New total fields***************************************************/
//                                  Pepperi plugin interface
/**********************************************************************************************/
//  1. The namespace of the header must be "customConfigBody".
//  3. The header must implement those functions:
//     * initPlugin - This method is to get the option object with the declared interface:
//          - JsURLs: the path of the script files.
//          - cssURLs: the path of the css files.
//          - more...
//     * onPluginLoad(context) - This method is called when the plugin is ready for use (external files are loaded).
//          - params: context object .
//     * navigateTo - (Optional) The event for the navigation the data need to be like this:
//          - detail: {
//              path: 'HomePage' - (the path is the url that you want).
//          }
//     * logout - (Optional) The event for the logout the name of the event have to be 'logout':
//
/**********************************************************************************************/
var customConfigBody = {};
(function () {
    this.caruselInterval;
    this.caruselInterValTime = 3; // sec
    this.context;
    this.jsonFilePath = '';
    this.cssFilePath = '';
    this.accountUUID;
    this.typeName;
    this.clientApiPath = 'https://webapp.pepperi.com/V16_20/WebApp_154/ClientApi/clientapi.js';
    this.catalogName = '';
    this.slides;
    this.speed = 7000; // 5 seconds
    this.slideDesc;
    this.indicators;
    this.switcher;
    this.clickedLists;
    this.bridgeObj;
    this.previousUUID = "";
    this.requestID = "";
    this.dateOfLastTransaction;
    this.accounts = [];


    this.startup = async function (parentContext, storage) {

        customConfigBody.pepStorage = storage

        await customConfigBody.appendConfigFiles(customConfigBody.pepStorage);
        customConfigBody.onPluginLoad(parentContext);

    };

    if (window.location.href.indexOf('sandbox') === -1) {
        //prod file path
        /*        this.jsonFilePath = 'https://www.blackmail.ski/pepperi/customConfigBodyConfig.js';
                this.cssFilePath = 'https://www.blackmail.ski/pepperi/customConfigBody.css';*/

    }

    //this.clientApiPath = 'http://localhost:4300/assets/ClientAPI/ClientApi.js';// Open it for debug only

    this.setHtml = function () {
        this.slideIndex = 1;

        var str =
            `
            <div id='validate_popup' class="display_none">
            <div class="popup_header">
                <div class="popup_name">Information</div>
            </div>
            <hr style="margin-bottom:15px">
        
            <div class="popup_body">You currently have an open order. To continue with this order, click No. To start a new
                order, click Yes.</div>
            <hr style="margin-top:15px">
            <div class="popup_bottom"><button onclick="customConfigBody.navToPreviousOrder()">No</button><button
                    style="background:rgb(7, 7, 63); color:#fff"
                    onclick="customConfigBody.createOrderAfterValidation()">Yes</button></div>
        </div>
        <div id="wrapp" class="wrapper">
            <div id="carousal-content">
                <div id="carousel" class="carousel">
                    <div id="slides" class="slides"></div>
                    <div id="indicators" class="indicators"></div>
                    <button onclick="customConfigBody.playerClick();" class="pause" id="player">
        
                    </button>
                </div>
        
            </div>
            <aside id="sidebar">
                <div id="response-menu" class="response-menu">
        
                    <button onclick="customConfigBody.openCloseMenu();" class="dropbtn" id="btn">Open menu</button>
        
                </div>
                <div id="sidebar-sm" class="sidebar-menu">
                    <div id="CurrCart" class="baselist">
        
        
        
        
                        <div class="sidebar-box">
                            <div>Orden abierta</div>
                            <ul class="leaders" id="currTransactionFields">
                                <li>
                                    <span class="dimmed">Catalogo</span>
                                    <span id="curCatalog" class="bold"></span>
                                </li>
                                <li>
                                    <span class="dimmed">Total</span>
                                    <span id="curTotal" class="bold"></span>
                                </li>
                                <li>
                                    <span class="dimmed">Fecha</span>
                                    <span id="curFecha" class="bold"></span>
                                </li>
        
                            </ul>
                            <button class="order-button" id="transactionTotal1"
                                onclick="customConfigBody.NavigateToActiveCart()">
                                <p id="qty1" style="display: none"></p><span id="totalText">Ir al carrito</span>
                            </button>
                        </div>
                    </div>
                    <hr style="display: none;">

                    <div id="store-selector" style="display:none">                  
                    </div>

                    <div class="nav-buttons" style="display: none; justify-content: space-between;">
                        <button class="rep-button" onclick="customConfigBody.createNewReplenishment()">Replenish</button>
        
                    </div>
                    <hr>
        
                    <div class="credit">
                        <div>
                            <p>Linea de Crédito</p>
                            <p id="credit-line"></p>
                        </div>
                        <img src="https://storage.pepperi.com/PreSales/NewFoodDemoImg/credit.svg">
                    </div>
                    <div class="credit">
                        <div>
                            <p>Crédito Utilizado %</p>
                            <p id="credit-utilizatio"></p>
                        </div>
                        <img src="https://storage.pepperi.com/PreSales/NewFoodDemoImg/credit.svg">
                    </div>
                    <div class="credit redirectButton"
                        onclick="customConfigHeader.createNewActivity('','','activities/details/{{UUID}}',true, 'Payment')">
                        <div>
                            <p>Cuentas por pagar</p>
                            <p id="credit-cuentas"></p>
                        </div>
                        <img src="https://storage.pepperi.com/PreSales/NewFoodDemoImg/credit.svg">
                    </div>
        
        
                    <div class="balance" style="display:none !important"
                        onclick="customConfigHeader.createNewActivity('','','activities/details/{{UUID}}',true, 'Payment')">
                        <div>
                            <p>Facturas por pagar</p>
                            <!--  <p id="balance-line"></p>-->
                        </div>
                        <img src="https://storage.pepperi.com/PreSales/NewFoodDemoImg/invoice.svg">
                    </div>

                    <div id="accountInfo">
                        <p>Vendedor:</p>
                        <a id="customer-name" href=""></a>
                        <p>Telefono:</p>
                        <a id="account-phone" href=""></a>
                    </div>

                    <div id="overSide" style="
                                right: 0;
                                position: absolute;
                                background: transparent;
                                background-color: black;
                                opacity: 50%;
                                width: 100%;
                                height: 170%;
                                margin-top: 48px;
                                left: 0;">
                    </div>
                </div>
        
        
            </aside>
        
        
            <div id="categories">
                <div id="box1" class="box box1">        
                </div>
                <div class="box box2" id="box2">
                </div>
        
        
        
            </div>
        </div>
    `
        document.getElementById('custom_body_id').innerHTML = str;
    };

    this.initPlugin = function () {
        var options = {
            JsURLs: [this.clientApiPath, this.jsonFilePath],
            cssURLs: [this.cssFilePath]
        };
        return options;
    };


    this.onPluginLoad = function (context) {

        this.context = context;


        var data = JSON.parse(context.pluginData);
        console.log('cont', data)
        if (data) {
            this.transactionName = data.typeName || '';
            this.accountUUID = data.accountUUID || '';
        }
        console.log('this.accountUUID', this.accountUUID)
        this.setHtml();
        this.getAccountInternalID();
        this.buildHTML(customHomepage.configFile.BigLinks, customHomepage.configFile.SmallLinks, customHomepage.configFile.CaruselData);
        this.getAgingCurrency()
        this.getTransactionStatus(this.accountUUID);
    };


    this.getAccountInternalID = function () {

        var bridgeObject = {
            fields: ["Name", "InternalID", "UUID", "TSACreditlimit", "TSATotalDebtAging", "TSASalesRepPhone", "TSASalesRepName", "TSASalesRepEmail"],

            responseCallback: 'customConfigBody.setAccountInternalID'
        };
        pepperi.api.accounts.search(bridgeObject);
    }


    this.setAccountInternalID = function (data) {
        console.log('acc', data)

        var self = this;
        var el;

        if (data.objects) {
            el = data.objects
        } else {
            el = data
        }

        this.AccountInternalID = el.filter(element => {
            return element.UUID.replace(/-/g, '') == self.accountUUID
        })[0].InternalID;
        var AccountCredit = el.filter(element => {
            return element.UUID.replace(/-/g, '') == self.accountUUID
        })[0].TSACreditlimit;
        var TotalDebtAging = el.filter(element => {
            return element.UUID.replace(/-/g, '') == self.accountUUID
        })[0].TSATotalDebtAging;

        var name = el.filter(element => {
            return element.UUID.replace(/-/g, '') == self.accountUUID
        })[0].TSASalesRepName;

        var phone = el.filter(element => {
            return element.UUID.replace(/-/g, '') == self.accountUUID
        })[0].TSASalesRepPhone;

        var email = el.filter(element => {
            return element.UUID.replace(/-/g, '') == self.accountUUID
        })[0].TSASalesRepEmail;


        document.getElementById("credit-line").innerHTML = AccountCredit ? '$' + AccountCredit.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '$0.00';
        //document.getElementById("credit-utilizatio").innerHTML=AccountCredit?'(Value '+(100*TotalDebtAging/AccountCredit).toFixed(2)+ '%)':'(Value 00.00%)' 
        document.getElementById("credit-utilizatio").innerHTML = AccountCredit ? '' + (100 * TotalDebtAging / AccountCredit).toFixed(2) + '%' : '0.00%';
        document.getElementById("credit-cuentas").innerHTML = TotalDebtAging ? '$' + TotalDebtAging.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '$0.00';
        document.getElementById("credit-cuentas").style.color = (+TotalDebtAging > +AccountCredit) ? 'red' : 'black';
        document.getElementById("customer-name").textContent = name;
        document.getElementById("customer-name").href = `mailto:${email}`;
        document.getElementById("account-phone").textContent = phone;
        document.getElementById("account-phone").href = `tel:${phone}`;
        this.getUDTAccount();

    }


    this.getTransactionStatus = function (acuuid) {
        var currentTransactionUUID = customConfigBody.getSessionStorage('LastOpenTransactionUUID');

        // else{
        //     document.getElementById("transactionTotal1").onclick = "customConfigBody.NavigateToActiveCart()"
        //     document.getElementById("transactionTotal1").style.background = "rgb(250, 250, 250);"
        // }
        var orderid = customConfigBody.getSessionStorage("OrderID");
        if (currentTransactionUUID && orderid && currentTransactionUUID != orderid) {
            customConfigBody.setSessionStorage("LastOpenTransactionUUID", orderid);
            currentTransactionUUID = orderid
        }

        var fields = [
            'Status', 'UUID', 'TSATotalOrderCases', 'TSAPPMTaxSumTotalPriceAfter', 'CatalogID', 'Currency', 'CatalogExternalID', 'GrandTotal', 'CreationDateTime', 'QuantitiesTotal', 'ActionDateTime'
        ];
        //if (!currenTransUUID){
        var filter = {
            Operation: "AND",
            LeftNode: {
                Operation: "AND",
                LeftNode: {
                    ApiName: "Type",
                    Operation: "IsEqual",
                    Values: ["Sales Order"],
                },
                RightNode: {
                    ApiName: "AccountUUID",
                    Operation: "IsEqual",
                    Values: [acuuid + ""],
                },
            },
            RightNode: {
                Operation: "AND",
                LeftNode: {
                    ApiName: "TotalItemsCount",
                    Operation: ">",
                    Values: ['0'],
                },
                RightNode: {
                    ApiName: "CreationDateTime",
                    Operation: "InTheLast",
                    Values: ["4", "Years"],
                },
            },
        };
        var sorting = [{
            Field: "CreationDateTime",
            Ascending: false
        }];
        console.log('filter', filter)

        customConfigBody.getTransactions(
            fields,
            filter,
            sorting,
            "customConfigBody.getExitTransactionCallback"
        );
        // }
        /* else {
        
  
          var filter = {
            ExpressionId: 1,
            ApiName: "UUID",
            Operation: "IsEqual",
            Values: [currenTransUUID],
          };
          customConfigBody.getTransactions(
            fields,
            filter,
            [],
            "customConfigBody.getExitTransactionCallback"
          );
        }*/

    };
    this.getTransactionCallback = function (res) {
        console.log('trans', res)
        if (res.success && res) {
            if (res.objects[0].Status == 1 || res.objects[0].Status == 1000)
                this.setQuantitiesTotal(res.objects[0].TSATotalOrderCases)
            this.setCurrentTransaction(res.objects[0].UUID, res.objects[0].TSAPPMTaxSumTotalPriceAfter, res.objects[0].Currency, res.objects[0].CatalogExternalID, res.objects[0].CreationDateTime);



        }
    }
    this.getTransactions = function (fields, filter, sortBy, callBack) {

        var bridgeObject = {
            fields: fields,
            filter: filter,
            sorting: sortBy,
            responseCallback: callBack
        };
        pepperi.api.transactions.search(bridgeObject);
    };



    this.openCloseMenu = function () {
        const over = document.getElementById("overSide");
        const e = document.getElementById("sidebar-sm");
        const btn = document.getElementById("btn");
        if (e.style.display == 'block') {
            e.style.display = 'none';
            over.style.display = 'none'
            btn.innerText = 'Open Menu'
        } else {
            over.style.display = 'block'
            e.style.display = 'block';
            btn.innerText = 'Close Menu'
        }
    };

    this.createNewOrder = function (in_transactionName = null, deepLink = null, catalog = null, currSt) {
        let isNew = customConfigBody.getSessionStorage(currSt);
        console.log('isNew', currSt + ':' + isNew)
        var bridgeObject = {
            references: {
                account: {
                    UUID: this.accountUUID
                },
                catalog: {
                    UUID: catalog
                }
            },
            type: {
                Name: !in_transactionName ? this.transactionName : in_transactionName
            },

            responseCallback: 'customConfigBody.createNewOrderCallback',
            requestID: deepLink

        };
        if (!isNew) {
            pepperi.app.transactions.add(bridgeObject);
        } else {
            document.getElementById("wrapp").classList.toggle("display_none");
            document.getElementById("validate_popup").classList.toggle("display_none");
            document.getElementById("validate_popup").classList.toggle("display_popup");
            this.bridgeObj = bridgeObject;
            this.previousUUID = isNew
            this.requestID = Links[deepLink]
            console.log('isNew', this.previousUUID)
        }
    };

    this.createOrderAfterValidation = function () {
        console.log('createOrderAfterValidation');
        pepperi.app.transactions.add(this.bridgeObj);
    }

    this.navToPreviousOrder = function () {
        console.log('navToPreviousOrder', this.previousUUID);
        customConfigBody.setUUIDandNav(this.requestID, null, null, this.previousUUID)
    }

    this.setSessionStorage = function (paramName, data) {
        sessionStorage.setItem(paramName, data);
    };

    this.getSessionStorage = function (paramName) {
        return sessionStorage.getItem(paramName);
    };

    this.createNewOrderCallback = function (res) {
        console.log('createNewOrderCalb--', res);

        if (res && res.success) {
            customConfigBody.setSessionStorage('LastOpenTransactionUUID', res.id);

            var uuid = res.id;

            if (res.requestID) {
                var requestID = res.requestID.replace('{{UUID}}', uuid.replace(/-/g, ''));
                customConfigBody.navigation(requestID);
            }
        }

    };



    this.navigationCallback = function (res) {
        if (res && res.success) {
            var uuid = res.id || '-1';
            if (uuid != '-1') {
                customConfigBody.navigation('/Transactions/Cart/' + uuid.replace(/-/g, ''));
            }
        }
    };


    this.getAgingCurrency = function () {

        pepperi.api.activities.search({
            fields: ["TSA130Days", "TSA31to60Days", "TSA6190Days"],
            filter: {
                Operation: "AND",
                LeftNode: {
                    ApiName: "Type",
                    Operation: "IsEqual",
                    Values: ["Aging Line"]
                },
                RightNode: {
                    ApiName: "Status",
                    Operation: "IsEqual",
                    Values: ["2", "19"]
                }
            },
            pageSize: 10000000,
            page: 1,
            responseCallback: "customConfigBody.getAgingCurrencyCallback"

        });

    };

    this.getAgingCurrencyCallback = function (data) {

        var firstMonth = 0;
        var secondMonth = 0;
        var thirdMonth = 0;
        var total = 0;

        for (var i = 0; i < data.objects.length; i++) {
            firstMonth += data.objects[i].TSA130Days;
            secondMonth += data.objects[i].TSA31to60Days;
            thirdMonth += data.objects[i].TSA6190Days;
        }
        total = firstMonth + secondMonth + thirdMonth;

        // var totalElem = document.getElementById('balance-line');
        // totalElem.innerHTML ='$ '+total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    }

    this.createNewReplenishment = function () {

        var bridgeObject = {
            references: {
                account: {
                    UUID: this.accountUUID
                },
                catalog: {
                    UUID: "af13721e-0924-4371-9e4b-38a4f425a693"
                }
            },
            type: {
                Name: 'Replenishment'
            },

            responseCallback: 'customConfigBody.createNewReplenishmentCallback',
            requestID: 'Transactions/Cart/{{UUID}}'
        };


        pepperi.app.transactions.add(bridgeObject);
    };


    this.createNewReplenishmentCallback = function (res) {
        if (res && res.success) {
            var uuid = res.id;
            if (res.requestID) {
                var requestID = res.requestID.replace('{{UUID}}', uuid.replace(/-/g, ''));
                customConfigBody.navigation(requestID);
            }
        }

    };




    this.setCurrentTransaction = function (StorageName, uuid, grandTotal, currrency, catalog, orTime) {
        customConfigBody.setSessionStorage(StorageName, uuid);
        let paramDate = new Date(orTime)

        if (!this.dateOfLastTransaction) {
            this.dateOfLastTransaction = paramDate;
            customConfigBody.setSessionStorage("LastOpenTransactionUUID", uuid)
        } else if (this.dateOfLastTransaction < paramDate || this.dateOfLastTransaction == paramDate) {
            this.dateOfLastTransaction = paramDate;
            customConfigBody.setSessionStorage("LastOpenTransactionUUID", uuid);
        }
        var uuidLast = customConfigBody.getSessionStorage("LastOpenTransactionUUID");
        var total = (grandTotal) ?
            Number(grandTotal)
            .toFixed(2)
            .toString() :
            '0.00';

        if (uuidLast == uuid) {
            var totalElem = document.getElementById('totalText');


            if (grandTotal != 0 || totalElem) {
                // totalElem.innerHTML =currrency+total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

                if (grandTotal == 0) {
                    totalElem.innerHTML = 'Ir al carrito';

                }
            }
            document.getElementById('CurrCart').style.display = 'block'
            document.getElementById("curTotal").innerHTML = grandTotal ? currrency + Number(grandTotal).toFixed(2).toString() : '$0.00'
            document.getElementById("curCatalog").innerHTML = catalog == 'Bebidas y Provisiones' ? 'Bebidas' : 'Refrigerados'
            document.getElementById("curFecha").innerHTML = new Date(Date.parse(orTime)).toLocaleDateString("en-US")
        }
    };



    this.setUUIDandNav = function (

        deepLink,
        isAlwaysNewOrder = false,
        excel = false,
        pruuid
    ) {

        excel ? this.setSessionStorage("UploadBranch", "UploadExcel") : this.setSessionStorage("UploadBranch", "");
        var uuid = pruuid ? pruuid : customConfigBody.getSessionStorage("LastOpenTransactionUUID");

        if (uuid && uuid !== "undefined" && !isAlwaysNewOrder) {
            deepLink = deepLink.replace("{{UUID}}", uuid.replace(/-/g, ""));

            customConfigBody.navigation(deepLink);
        } else {
            //  customConfigBody.createNewOrder(in_transactionName,deepLink);
        }
    };

    customConfigBody.NavigateToActiveCart = function () {


        var uuid = customConfigBody.getSessionStorage('LastOpenTransactionUUID');
        if (uuid) {
            customConfigBody.navigation('/Transactions/Cart/' + uuid.replace(/-/g, ""));
        }
    };

    this.navigation = function (path) {

        var eventData = {
            detail: {
                path: path
            }
        };

        var event = new CustomEvent('navigateTo', eventData);


        if (document.createEvent) {
            window.dispatchEvent(event);
        } else {
            window.fireEvent('on' + event.eventType, event);
        }
    };


    this.logout = function () {
        var event = new CustomEvent('logout');

        if (document.createEvent) {
            window.dispatchEvent(event);
        } else {
            window.fireEvent('on' + event.eventType, event);
        }
    };


    this.buildHTML = function (BigLinks, SmallLinks, CaruselData) {
        let biglinks = ''

        BigLinks.forEach(el => {
            biglinks += `<div class="item1"
                        onclick="customConfigBody.${el.actionType}('${el.transactionName}','${el.deepLink.replace(/"/g, '%22')}','${el.catalogUUID}','${el.currentCatalog}')"
                        style="background-image: url(${el.img});">
                        <div class="overlay_b1">
                            ${el.title}
                        </div>
                    </div>`
        })

        document.getElementById('box1').innerHTML = biglinks;

        let smalllinks = ''

        SmallLinks.forEach(el => {
            smalllinks += ` <div class="item3"
            onclick="customConfigBody.${el.actionType}('${el.transactionName}','${el.deepLink.replace(/"/g, '%22')}','${el.catalogUUID}','${el.currentCatalog}')"
            style="background-image: url(${el.img}); ">
            <div class="overlay">${el.title}</div>
        </div>`
        })

        document.getElementById('box2').innerHTML = smalllinks;


        let htmlStr = '';

        let indicatorsStr = '';

        this.CaruselData = CaruselData;



        var idx = 0;
        var value = CaruselData[idx];


        htmlStr +=
            `<div class="slide" onclick="customConfigBody.createNewOrder('Sales Order','${value.deepLink.replace(/"/g, '%22')}','03fb4da1-7931-4ffb-b689-79d48de8f3cf','LastBebidasTransUUID')"  data-state="active" style="background-image: url('${value.imageURL}'), linear-gradient(45deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)"></div>
           
                        <div class="slide-text">
                        <button id="shop_now" onclick="customConfigBody.createNewOrder(null,'/Transactions/scope_items/{{UUID}}?CurrentTab=%22%7B%5C%22DynamicFilter%5C%22:%5C%22Item.MainCategory%5C%22,%5C%22Value%5C%22:%5C%22Bakery%5C%22,%5C%22Parent%5C%22:%5C%22%7B%5C%5C%5C%22JsonFilter%5C%5C%5C%22:%5C%5C%5C%224cb18aba-1986-43a0-a5d1-f53433c6a589%5C%5C%5C%22%7D%5C%22%7D%22&ViewType=%7B%22Key%22:%22OrderCenterView3%22,%22Value%22:%22Medium%22%7D&TopPadding=0&SearchAll=false',true,true)"></button>
                        <p class="title">${value.title}</p>
                        <p class="desc">${value.description}</p>
                    </div>`;

        for (const [idx1, value] of CaruselData.entries()) {
            indicatorsStr += idx1 === 0 ?
                `<input class="indicator" name="indicator" data-slide="${idx1}" data-time="${value.time}"  data-state="active" onclick="customConfigBody.setSessionStorage('savedIDX', this.getAttribute('data-slide'));customConfigBody.switchSlide(true)" checked type="radio"/>` :
                `<input class="indicator" name="indicator" data-slide="${idx1}" data-time="${value.time}" onclick="customConfigBody.setSessionStorage('savedIDX', this.getAttribute('data-slide'));customConfigBody.switchSlide(true)" type="radio"/>`;
        }


        document.getElementById('slides').innerHTML = htmlStr;
        document.getElementById('indicators').innerHTML = indicatorsStr;
        var carousel = document.getElementById('carousel');
        if (carousel) {
            this.slides = carousel.querySelectorAll('.slide');
            this.slideDesc = carousel.querySelectorAll('.slide-text');
            this.indicators = carousel.querySelectorAll('.indicator');
        }

        customConfigBody.setSessionStorage('savedIDX', 0);
        this.speed = value.time
        customConfigBody.switchSlide();
        customConfigBody.getAccounts();

    };


    this.carouselHide = function (num) {
        this.indicators[num].setAttribute('data-state', '');

    }

    this.carouselShow = function (num) {
        this.indicators[num].checked = true;
        this.indicators[num].setAttribute('data-state', 'active');
        this.slides[num].setAttribute('data-state', 'active');

    }

    this.setSlide = function (slide) {
        for (var i = 0; i < this.indicators.length; i++) {
            this.indicators[i].setAttribute('data-state', '');

            this.carouselHide(i);
        }

        this.indicators[slide].setAttribute('data-state', 'active');


    }



    this.getCurrentSlide = function () {
        var inp = document.getElementsByName('indicator');
        for (var i = 0; i < inp.length; i++) {
            if (inp[i].dataset.state == 'active') {
                return inp[i].dataset.slide - 1;
            }
        }
    }



    this.playerClick = function () {
        var btn = document.getElementById('player');
        var btnClass = btn.className
        if (btnClass == 'play') {
            btn.className = 'pause'
            customConfigBody.switchSlide();
        } else {
            btn.className = 'play'
            clearTimeout(this.switcher);

        }
    }


    this.switchSlide = function (isCurrent) {
        clearTimeout(this.switcher);
        let htmlStr = '';
        let buttonFill = '';


        let indicatorsStr = '';

        var idx;
        var value;

        idx = +sessionStorage.getItem('savedIDX') < this.CaruselData.length ? +sessionStorage.getItem('savedIDX') : 0;


        value = this.CaruselData[idx];
        customConfigBody.setSessionStorage('savedIDX', +sessionStorage.getItem('savedIDX') + 1 < this.CaruselData.length ? +sessionStorage.getItem('savedIDX') + 1 : 0);

        htmlStr +=

            `<div class="slide" onclick="customConfigBody.createNewOrder('Sales Order','${value.deepLink.replace(/"/g, '%22')}','03fb4da1-7931-4ffb-b689-79d48de8f3cf','LastBebidasTransUUID')"  data-state="active" style="background-image: url('${value.imageURL}'), linear-gradient(45deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)"></div>
                  
                    <div class="slide-text">
                    <button id="shop_now" onclick="customConfigBody.createNewOrder(null,'/Transactions/scope_items/{{UUID}}?CurrentTab=%22%7B%5C%22DynamicFilter%5C%22:%5C%22Item.MainCategory%5C%22,%5C%22Value%5C%22:%5C%22Bakery%5C%22,%5C%22Parent%5C%22:%5C%22%7B%5C%5C%5C%22JsonFilter%5C%5C%5C%22:%5C%5C%5C%224cb18aba-1986-43a0-a5d1-f53433c6a589%5C%5C%5C%22%7D%5C%22%7D%22&ViewType=%7B%22Key%22:%22OrderCenterView3%22,%22Value%22:%22Medium%22%7D&TopPadding=0&SearchAll=false',true,true)">${value.button}</button>

                    <p class="title">${value.title}</p>
                    <p class="desc">${value.description}</p>
                </div>`;
        buttonFill += `${value.button}`;

        for (const [idx1, value] of this.CaruselData.entries()) {
            indicatorsStr += idx == idx1 ?
                `<input class="indicator" name="indicator" data-slide="${idx1}" data-time="${value.time}" data-state="active" onclick="customConfigBody.setSessionStorage('savedIDX', this.getAttribute('data-slide'));customConfigBody.switchSlide(true)" checked type="radio"/>` :
                `<input class="indicator" name="indicator" data-slide="${idx1}" data-time="${value.time}" onclick="customConfigBody.setSessionStorage('savedIDX', this.getAttribute('data-slide'));customConfigBody.switchSlide(true)" type="radio"/>`;
        }


        document.getElementById('shop_now') ? document.getElementById('shop_now').innerHTML = buttonFill : '';
        document.getElementById('slides') ? document.getElementById('slides').innerHTML = htmlStr : '';
        document.getElementById('indicators') ? document.getElementById('indicators').innerHTML = indicatorsStr : '';
        document.querySelectorAll('.slide-text')[0] ? document.querySelectorAll('.slide-text')[0].style.opacity = 1 : '';
        var carousel = document.getElementById('carousel');
        if (carousel) {
            this.slides = carousel.querySelectorAll('.slide');
            this.slideDesc = carousel.querySelectorAll('.slide-text');
            this.indicators = carousel.querySelectorAll('.indicator');
        }
        this.speed = value.time
        this.switcher = setTimeout(function () {
            customConfigBody.switchSlide();
        }, this.speed);

    }


    this.openCloseMenu = function () {
        const e = document.getElementById("sidebar-sm");
        const btn = document.getElementById("btn");
        if (e.style.display == 'block') {
            e.style.display = 'none';
            btn.innerText = 'Open Menu'
        } else {
            e.style.display = 'block';
            btn.innerText = 'Close Menu'
        }
    };


    this.getUDTLists = function (list) {

        this.clickedLists = list;

        list = list.replace('&amp;', '&')

        var account = this.AccountInternalID;
        pepperi.api.userDefinedTables.getList({
            table: "List Items",
            mainKey: account + '~' + list,
            responseCallback: 'customConfigBody.updateTransactionScopeFromList'
        });

    };


    this.getUDTAccount = function () {
        var account = this.AccountInternalID;

        pepperi.api.userDefinedTables.get({
            table: "Homepage Lists",
            mainKey: account + '',
            secondaryKey: '1',
            responseCallback: 'customConfigBody.updateTransactionScopeFromAccount'

        });
    };



    this.updateTransactionScopeFromAccount = function (data) {

        if (data.success) {

            document.getElementById('list1').innerHTML = data.value.split('~')[0];
            document.getElementById('list2').innerHTML = data.value.split('~')[1];
            document.getElementById('list3').innerHTML = data.value.split('~')[2];
            document.getElementById('food_list').style.display = "block";
        }


    };



    this.getExitTransactionCallback = function (res) {
        console.log('exitClb', res)
        var StorageName;
        var transaction = res.objects[0];
        if (res.objects[0]) {
            customHomepage.configFile.CatalogsSettings.forEach(function myFunction(el) {
                if (el.Catalog == transaction.CatalogID) StorageName = el.SSelement;
            });
        }
        if (res && res.objects && res.objects.length && (res.objects[0].Status == 1 || res.objects[0].Status == 1000)) {

            //STATUS =  IN CREATION

            this.setQuantitiesTotal(transaction.TSATotalOrderCases)
            this.setCurrentTransaction(StorageName, transaction.UUID, transaction.TSAPPMTaxSumTotalPriceAfter, transaction.Currency, transaction.CatalogExternalID, transaction.CreationDateTime);

        } else {
            document.getElementById("transactionTotal1").onclick = ''
            document.getElementById("transactionTotal1").style.background = "rgba(10, 10, 10, 0.08)"
            document.getElementById("curTotal").innerHTML = '$0.00'
            document.getElementById("curCatalog").innerHTML = ''
            document.getElementById("curFecha").innerHTML = ''
            document.getElementById('qty1').style.display = 'none';
            //document.getElementById('CurrCart').style.display='none';
            this.dateOfLastTransaction = ''
            sessionStorage.removeItem(StorageName);
            // customConfigBody.createNewOrder();
        }
    };
    this.setQuantitiesTotal = function (TSATotalOrderCases) {

        var quantity1 = document.getElementById('qty1');

        if (TSATotalOrderCases != 0 && TSATotalOrderCases <= 999) {
            console.log("qty", TSATotalOrderCases)
            quantity1.style.display = 'inline-block';
            quantity1.innerHTML = +TSATotalOrderCases.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,");
        } else {
            quantity1.style.display = 'none';

        }
    }

    this.updateTransactionScopeFromList = function (data) {


        var bridgeArray = []
        for (let i = 0; i < data.objects.length; i++) {
            var tmpObj = {};
            tmpObj.item = {
                ExternalID: data.objects[i].secondaryKey
            }
            tmpObj.UnitsQuantity = data.objects[i].value
            bridgeArray.push(tmpObj)
        }

        pepperi.app.transactionScopeItems.update({
            transaction: {
                UUID: customConfigBody.getSessionStorage('LastOpenTransactionUUID')
            },
            objects: bridgeArray,
            responseCallback: 'customConfigBody.togglePopup'
        });
    };

    this.createNewActivityAging = function () {
        var bridgeObject = {
            references: {
                account: {
                    UUID: this.accountUUID
                },
            },
            type: {
                Name: "Aging Line"
            },
            responseCallback: "customConfigBody.createNewActivityCallback",
            requestID: 'list/all_activities?listTabName=%5BGL%23ea471fa6-f4e0-495a-85c7-5685229f3c8b%5DListView&listView=1&ListTitle=Aging&TopPadding=0'

        };

        pepperi.app.activities.add(bridgeObject);


    };
    this.createNewActivityCallback = function (res) {

        if (res && res.success) {
            let uuid = res.id;
            if (res.requestID) {
                var requestID = res.requestID.replace('{{UUID}}', uuid.replace(/-/g, ''));
                customConfigHeader.navigation(requestID);
            }
        }
    };


    this.togglePopup = function (data) {

        // Get the modal
        var modal = document.getElementById("popup");

        // Get the button that opens the modal
        var btn = document.getElementById("add");

        modal.style.display = "block";


        var modal = document.getElementById("popup");
        this.getTransactionStatus();
        setTimeout(function () {
            modal.style.display = "none";

        }, 1500)
    }

    customConfigBody.getAccounts = function () {
        console.log("callbackName ->>>>", );
        var bridgeObject = {
            fields: ["Name", "UUID", "ExternalID"],
            filter: {
                Operation: "AND",
                RightNode: {
                    ApiName: "ParentExternalID",
                    Operation: "IsEqual",
                    Values: [""],
                },
                LeftNode: {
                    ApiName: "Hidden",
                    Operation: "IsEqual",
                    Values: ["false"],
                },
            },
            responseCallback: "customConfigBody.setAccountDD"
        };
        pepperi.api.accounts.search(bridgeObject);
    };

    customConfigBody.setAccountDD = function (data) {
        console.log("accounts", data)
        if (!data.success || data.count == 0) return;
        customConfigBody.accounts = data.objects;
        customConfigBody.buildAccountsDropDown(customConfigBody.accounts);
    };
    customConfigBody.setActiveDropdown = function (uuid, name) {
        document.getElementById("selected-account").innerHTML = name
        document.querySelector('li.active-dropdown-item') ? document.querySelector('li.active-dropdown-item').classList.remove("active-dropdown-item") : null;
        document.getElementById(uuid).classList.add("active-dropdown-item");
        customConfigBody.setSessionStorage("accountUUID", uuid);
        customConfigBody.accountUUID = uuid.replace(/-/g, '')
        var bridgeObject = {
            fields: ["Name", "InternalID", "UUID", "TSACreditlimit", "TSATotalDebtAging", "TSASalesRepPhone", "TSASalesRepName", "TSASalesRepEmail"],
            filter: {
                ApiName: "UUID",
                Operation: "IsEqual",
                Values: [uuid],
            },
            responseCallback: 'customConfigBody.setAccountInternalID'
        };
        pepperi.api.accounts.search(bridgeObject);
        this.getTransactionStatus(this.accountUUID);
        document.getElementById("account-name").innerHTML = name
    }
    customConfigBody.buildAccountsDropDown = function (thisAccounts) {
        let ddElement = document.getElementById("store-selector");
        let html = "";
        accounts = thisAccounts
        if (thisAccounts.length == 1) {
            document.getElementById("store-selector").style.display = "none"
        } else {
            document.getElementById("store-selector").style.display = "flex"
            document.getElementById("store-selector").classList.add("sidebar-box")
            document.getElementById("store-selector").classList.add("sidebar-gap")
        }

        html += `<label class="title-1-xs sidebar-gap" for="order-for">Order for:</label>
              <div class="custom-input-dropdown" onclick="customConfigBody.openStoreSelect()">
                <p role="label" id="selected-account">Select a store</p>
                <ul class="dropdown-content-fit" id="select-menu" role="select">`

        let accountUUID = '';
        let accountName = '';

        accounts.forEach((element) => {

            html += `<li onclick="customConfigBody.setActiveDropdown('${element.UUID}','${element.Name}(${element.ExternalID})'); customConfigBody.findTransactionForSelectedAccount('${element.UUID}')" id="${element.UUID}">${element.Name}(${element.ExternalID})</li>`;

            // if ((customConfigBody.getSessionStorage("accountUUID") && customConfigBody.getSessionStorage("accountUUID") != '' && element.UUID == customConfigBody.getSessionStorage("accountUUID"))) {
            //     html += `<label class="title-1-xs sidebar-gap" for="order-for">Order for:</label>
            //   <div class="custom-input-dropdown" onclick="customConfigBody.openStoreSelect()">
            //     <p role="label" id="selected-account">${element.Name + `(${element.ExternalID})`}</p>
            //     <ul class="dropdown-content-fit" id="select-menu" role="select">
            //     <li class="active-dropdown-item" onclick="customConfigBody.setActiveDropdown('${element.UUID}','${element.Name}(${element.ExternalID})'); customConfigBody.findTransactionForSelectedAccount('${element.UUID}')" id="${element.UUID}">${element.Name}(${element.ExternalID})</li>
            //     </ul>
            //     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            //         <path fill-rule="evenodd"
            //             d="M5.80032148,9.28674354 L11.2542824,13.2027583 C11.6661309,13.585083 12.3338691,13.585083 12.7457176,13.2027583 L18.1996785,9.28674354 C18.611527,8.90441882 19.2792652,8.90441882 19.6911137,9.28674354 C20.1029621,9.66906826 20.1029621,10.2889391 19.6911137,10.6712638 L13.4914351,16.4265129 C12.6677383,17.1911624 11.3322617,17.1911624 10.5085649,16.4265129 L4.30888633,10.6712638 C3.89703789,10.2889391 3.89703789,9.66906826 4.30888633,9.28674354 C4.72073478,8.90441882 5.38847303,8.90441882 5.80032148,9.28674354 Z" />
            //     </svg>
            //   </div>`;
            //     ddElement.innerHTML = html;
            //     customConfigBody.setSessionStorage("accountUUID", element.UUID);
            // } else {}
            if (customConfigBody.getSessionStorage("accountUUID") && customConfigBody.getSessionStorage("accountUUID") != '' && element.UUID == customConfigBody.getSessionStorage("accountUUID")) {
                accountUUID = element.UUID
                accountName = element.Name
            }
        });

        html += `</ul>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill-rule="evenodd"
                  d="M5.80032148,9.28674354 L11.2542824,13.2027583 C11.6661309,13.585083 12.3338691,13.585083 12.7457176,13.2027583 L18.1996785,9.28674354 C18.611527,8.90441882 19.2792652,8.90441882 19.6911137,9.28674354 C20.1029621,9.66906826 20.1029621,10.2889391 19.6911137,10.6712638 L13.4914351,16.4265129 C12.6677383,17.1911624 11.3322617,17.1911624 10.5085649,16.4265129 L4.30888633,10.6712638 C3.89703789,10.2889391 3.89703789,9.66906826 4.30888633,9.28674354 C4.72073478,8.90441882 5.38847303,8.90441882 5.80032148,9.28674354 Z" />
          </svg>

        </div>`
        ddElement.innerHTML = html;

        if (accountName != '' && accountUUID != '') {
            customConfigBody.setActiveDropdown(accountUUID, accountName)
        }

        if (!customConfigBody.getSessionStorage("accountUUID") || customConfigBody.getSessionStorage("accountUUID") == '')
            var name = `${customConfigBody.accounts[0].Name}(${customConfigBody.accounts[0].UUID})`
            
            customConfigBody.setActiveDropdown(customConfigBody.accounts[0].UUID, name)

    };

    customConfigBody.openStoreSelect = function () {
        document.getElementById('select-menu').classList.toggle('show');
    }

    customConfigHeader.appendConfigFiles = async function (storage) {
        return await new Promise((resolve) => {
            var uploadedFiles = 0;
            var filePaths = [
                "dynamicHP/header/header.css"
            ];

            // var filteredStorage = storage.filter(({
            //     Title
            // }) => {
            //     return filePaths.includes(Title)
            // })

            file = document.createElement("link");
            file.rel = "stylesheet";
            file.type = "text/css"
            file.href = 'https://burrypony.github.io/test/css/style.css';

            document.getElementsByTagName("head")[0].appendChild(file)

            file.onload = function () {
                uploadedFiles++;
                if (uploadedFiles == filePaths.length) {
                    resolve(uploadedFiles)
                }
            };

            // filteredStorage.forEach(el => {
            //     var file = '';
            //     if (el["URL"].includes('.js')) {
            //         file = document.createElement("script");
            //         file.src = el["URL"];
            //     } else if (el["URL"].includes('.css')) {
            //         file = document.createElement("link");
            //         file.rel = "stylesheet";
            //         file.type = "text/css"
            //         file.href = el["URL"];
            //     }
            //     document.getElementsByTagName("head")[0].appendChild(file);

            //     file.onload = function () {
            //         uploadedFiles++;
            //         if (uploadedFiles == filePaths.length) {
            //             resolve(uploadedFiles)
            //         }
            //     };
            // })
        })
    }


}.apply(customConfigBody));