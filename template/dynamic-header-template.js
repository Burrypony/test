/**********************************************************************************************/
//                                  Pepperi plugin interface
/**********************************************************************************************/
//  1. The namespace of the header must be "customConfigHeader".
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
//     * favIconURL - this parameter should contain url of the favicon. if it will be empty string or null the user will get pepperi default favicon.
//     * pageTitle - this parameter should contains the string ot the page title. if it will be empty string or null the user will see pepperi default title - "Pepperi".
//      *Changed background image and logout URL 6.14.19 DZ
/**********************************************************************************************/

//hands cosm deeplink https://app.pepperi.com/Transactions/scope_items/6b0d5fbc0d484a73bb0edfc85f2edb6c?CurrentTab=%22%7B%5C%22JsonFilter%5C%22:%5C%22023bad44-a6d3-435b-928d-bab0a41b4dc6%5C%22%7D%22
//hair care deeplink https://app.pepperi.com/Transactions/scope_items/9d7d40d4554f45deac8efa7c031c9202?CurrentTab=%22%7B%5C%22JsonFilter%5C%22:%5C%22696718b2-3431-4aad-b23a-8a6d7c824ef0%5C%22%7D%22
//masks deeplink https://app.pepperi.com/Transactions/scope_items/28fdf097df8f45c0992e7c19e62516ee?CurrentTab=%22%7B%5C%22JsonFilter%5C%22:%5C%222a7c613e-1e67-4497-af60-ae8a6633487a%5C%22%7D%22
//favourites deeplink https://app.pepperi.com/Transactions/scope_items/fde56f7a4ed34083a5dcb88515246438?CurrentTab=%22%7B%5C%22JsonFilter%5C%22:%5C%22f179d451-d48a-41bb-ba9e-9dab8ee3c114%5C%22%7D%22&ViewType=%7B%22Key%22:%22OrderCenterGrid%22,%22Value%22:%22Grid%20Line%22%7D
//history https://app.pepperi.com/list/all_activities 



var customConfigHeader = {};
(function () {

    const changes = '';



    const refItem = {
        catalog: "",
        transaction: "",
        title: "",
        titleColor: "",
        imageURL: "",
        subTitle: "",
        subTitleColor: "",
        description: "",
        descriptionColor: "",
        deepLink: ''
    }


    this.context;
    this.accountUUID;
    this.transactionName;
    this.userName;
    this.userName1;
    this.pageTitle = '';
    //this.catalogName = "2020 Fall Catalog";
    this.transactionName = "";
    this.catalogs;

    this.startup = async function (parentContext, storage) {
        await customConfigHeader.appendConfigFiles(storage);
        await customConfigHeader.setHeaderSettings();
        await customConfigHeader.setHtml();
        await customConfigHeader.onPluginLoad(parentContext);
    };

    /* Set custom page title and favicon */
    this.setHeaderSettings = function () {
        if (customHeader.configFile.GeneralInfo.FaviconURL) {
            let favicon = document.getElementById('favicon')
            favicon.setAttribute('href', customHeader.configFile.GeneralInfo.FaviconURL);
        }

        if (customHeader.configFile.GeneralInfo.TabTitle) {
            document.title = customHeader.configFile.GeneralInfo.TabTitle;
        }
    }
    //this.clientApiPath = 'http://localhost:4300/assets/ClientAPI/ClientApi.js';// Open it for debug only

    this.setHtml = function () {
        var str =
            `<header id="header-section">
            <div class="chp_container-fluid">
        
                <div style="display:flex;align-items:center; width:25em">
                    <img class="chp_logo" onclick="customConfigHeader.navigation(\'HomePage\')" style="
                  
                  width: 128px;
                  margin-left: 26px;
                  
                  color: rgb(255, 255, 255);
                  font-size: 32px;
                  font-family: Montserrat-Bold;
                  font-weight: bold;
                  letter-spacing: 1.22px;
                  line-height: 40px;
                  position: inherit;"
                        src="https://storage.pepperi.com/CustomersData/VSuarez/VSuarez_Logo.png" />

                  <p id="account-name" style="margin: 0;padding-left:1em; font-weight: bold;font-size:16px;"></p>
                </div>
                <div style="display:flex;align-items:center; width:45em">
                      
                    <div class="left-mobile"
                        <div class="chp_dropdown chp_showMobile">
                            <button style="background-color: transparent;
                            border: 0px;
                            border-radius: 4px;
                            width: 40px;
                            height: 40px;
                            display: none;
                            padding-bottom: 4px;"
                            class="chp_dropdown" type="button" id="dropdownMenuButtonMobile" onclick="customConfigHeader.closeHumanMenu()" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                                <img style="background-color: transparent"
                                    src="https://storage.pepperi.com/General/Icons/open-menu-black.svg" width="20px"
                                    vertical-align="center" alt="user" />
                            </button>
        
                            <div id="dropdown-menu-mobile" class="chp_dropdown-menu-mobile chp_dropdown-menu-left"
                                aria-labelledby="dropdownMenuButton">
        
                                <div id="test-drpd" style="color: black;
                                vertical-align: middle;
                                background-color: white;
                                min-width: 160px;
                                box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
                                z-index: 1;
                                right: 4px;
                                border: 1px solid gray;
                                border-radius: 4px;
                                top: -28px;
                                padding-top: 14px;
                                padding-left: 12px;">
                                
                                </div>
        
                            </div>
        
        
        
        
                        </div>
        
                        <div class="chp_btn-group">
                            <ul id="header_btn_bar" class="chp_showDesktop" style="list-style: none;">
                            </ul>
                        </div>
        
                    </div>

                    
                    <div class="d-flex justify-content-right">
                        <div id="right_additional_menu">
                            <div class="chp_dropdown">
                                <button onclick="customConfigHeader.closeHamburgerMenu()" class="chp_right-buttons img-pos"  id="user-drop">
                                    <svg class="chp_user-img" xmlns="http://www.w3.org/2000/svg" width="18" height="20"
                                        viewBox="2 3 20 20">
                                        <path fill-opacity="1" fill-rule="evenodd" fill="black"
                                            d="M5.87300934,20 C5.31672677,18.8352719 5,17.5623379 5,16.3333333 C5,13.9259827 6.21522434,12.2548428 8.06569509,11.3364984 C7.70530908,10.3928205 7.5,9.36966701 7.5,8.4 C7.5,5.36243388 9.51471863,4 12,4 C14.4852814,4 16.5,5.36243388 16.5,8.4 C16.5,9.36966701 16.2946909,10.3928205 15.9343049,11.3364984 C17.7847757,12.2548428 19,13.9259827 19,16.3333333 C19,17.5623379 18.6832732,18.8352719 18.1269907,20 C17.7963837,20 17.3817618,20 16.883125,20 C15.7220834,20 15.7220834,19.3712729 15.8841722,19.0335104 C16.2755898,18.2178696 16.5,17.329449 16.5,16.5 C16.5,15.0183086 15.7838916,14.0593118 14.6788931,13.5264125 C13.9304475,14.4190907 13.00359,15 12,15 C10.99641,15 10.0695525,14.4190907 9.32110687,13.5264125 C8.21610842,14.0593118 7.5,15.0183086 7.5,16.5 C7.5,17.3265901 7.72286593,18.211746 8.11178644,19.0250739 C8.2747433,19.3658565 8.2747433,20 7.14578125,20 C6.64072083,20 6.21646352,20 5.87300934,20 Z M12,12.5 C13.1045695,12.5 14,10.2997114 14,8.64285714 C14,6.98600289 13.1045695,6.5 12,6.5 C10.8954305,6.5 10,6.98600289 10,8.64285714 C10,10.2997114 10.8954305,12.5 12,12.5 Z" />
                                    </svg>
                                  
                                </button>
                                <div id="myDropdown" class="chp_dropdown-content chp_dropdown-put" style="right:0">
                                    <ul>
                                    <li id='userName1'></li>
                                    <hr style="margin-top: 10px; margin-bottom: 10px;">
                                        <li class="chp_icon-pas"  onclick="customConfigHeader.changePassword()">Change Password</li>
                                        <li class="chp_icon-log" onclick="customConfigHeader.logout();">Logout</li>
                                    </ul>
                                </div>
                            </div>                
                        </div>
                    </div>
        
        
            </div>
        
        </header>
        `;

        document.getElementById('custom_header_id').innerHTML = str;
         // class="d-flex justify-content-left"
    };

    this.openInNewTab = function (url) {
        var win = window.open(url, '_blank');
        win.focus();
    };

    this.initPlugin = function () {
        var options = {
            JsURLs: [
                //this.clientApiPath
            ],
            cssURLs: [],
            favIcon: this.favIconURL,
            pageTitle: this.pageTitle
        };

        return options;
    };

    this.onPluginLoad = function (context) {
        this.context = context;
        if (context.userId == 11629407) {
            this.transactionName = 'B2B for Franchise'
        }


        const {
            userName
        } = context;
        this.userName = userName;



        var data = JSON.parse(context.pluginData);
        if (data) {
            this.transactionName = data.typeName || '';
            this.accountUUID = data.accountUUID || '';
        }

        this.getAccountStatus();
        this.getScreenSize();

    };

    this.getScreenSize = function () {
        if (window.screen.width = 576) {

            var items = document.getElementsByClassName('chp_dropdown-backdrop');
            for (i = 0; i < items.length; i++) {
                // items[i].classList.toggle('back');

                items[i].style.backgroundColor = "rgba(0,0,0,0.5)";
                // items[i].style.zIndex = "1000";

            }

        }
    };






    this.openInNewTab = function (url) {
        if (url === 'Pricelists')
            url = '';
        var win = window.open(url, '_blank');
        win.focus();
    };

    this.getAccountStatus = function () {
        var bridgeObject = {
            fields: ['Name', 'UUID'],
            sorting: [],
            responseCallback: 'customConfigHeader.getCurrentAccountCallback'
        };
        pepperi.api.accounts.search(bridgeObject);
    };

    this.getCurrentAccountCallback = function (res) {
        if (res && res.success && res.objects && res.objects.length) {
            this.accountUUID = res.objects[0].UUID;
            document.getElementById("account-name").innerHTML = res.objects[0].Name
        }

        // this.getScreenSize();
        this.getCatalogs();
    };

    this.navigation = function (path) {
        const uuid = customConfigHeader.getSessionStorage('LastOpenTransactionUUID');
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


        if (window.location.href != "https://app.pepperi.com/HomePage") {

            window.location.href = path;
        }
    };

    this.setSessionStorage = function (paramName, data) {
        sessionStorage.setItem(paramName, data);
    };

    this.getSessionStorage = function (paramName) {
        return sessionStorage.getItem(paramName);
    };

    this.logout = function () {
        var event = new CustomEvent('logout');

        if (document.createEvent) {
            window.dispatchEvent(event);
        } else {
            window.fireEvent('on' + event.eventType, event);
        }
    };

    this.changePassword = function () {
        window.location.href = 'https://idp.pepperi.com/Account/ChangePassword';
    };



    this.setUUIDandNav = function (in_catalog = null, in_transactionName = null, deepLink = null, isActivity = false) {
        let uuid = customConfigHeader.getSessionStorage('LastOpenTransactionUUID');
        if (isActivity)
            uuid = '';
        if (uuid && uuid !== "undefined") {
            deepLink = deepLink.replace('{{UUID}}', uuid.replace(/-/g, ''));
            customConfigHeader.navigation(deepLink);
        } else {
            customConfigHeader.createNewOrder(in_catalog, in_transactionName, deepLink, isActivity);
        }
    };







    this.createNewOrder = function (inCatalog = null, in_transactionName = null, deepLink = null, isActivity = false) {
        var bridgeObject = {
            references: {
                account: {
                    UUID: this.accountUUID
                },
                catalog: {
                    UUID: !inCatalog ? this.catalogName : inCatalog
                }
            },
            type: {
                Name: !in_transactionName ? this.transactionName : in_transactionName
            },
            responseCallback: "customConfigHeader.createNewOrderCallback",
            requestID: deepLink
        };
        if (isActivity) {
            delete bridgeObject.references.catalog;
            bridgeObject.type.Name = 'Service Request';
            pepperi.app.activities.add(bridgeObject);
        } else
            pepperi.app.transactions.add(bridgeObject);


    };
    this.createNewOrderCallback = function (res) {
        if (res && res.success) {

            customConfigHeader.setSessionStorage('LastOpenTransactionUUID', res.id);

            let uuid = res.id;
            if (res.requestID) {
                var requestID = res.requestID.replace('{{UUID}}', uuid.replace(/-/g, ''));
                customConfigHeader.navigation(requestID);
            }
        }
    };

    this.createNewActivity = function (inCatalog = null, in_transactionName = null, deepLink = null, isActivity = false, ActivityName = null) {
        var bridgeObject = {
            references: {
                account: {
                    UUID: this.accountUUID
                },
                catalog: {
                    UUID: !inCatalog ? this.catalogName : inCatalog
                }
            },
            type: {
                Name: !in_transactionName ? this.transactionName : in_transactionName
            },
            responseCallback: "customConfigHeader.createNewActivityCallback",
            requestID: deepLink
        };
        if (isActivity) {
            delete bridgeObject.references.catalog;
            bridgeObject.type.Name = ActivityName;
            pepperi.app.activities.add(bridgeObject);
        } else
            pepperi.app.transactions.add(bridgeObject);


    };
    this.createNewActivityCallback = function (res) {
        console.log('createNewOrderCallback res', res);
        if (res && res.success) {
            let uuid = res.id;
            if (res.requestID) {
                var requestID = res.requestID.replace('{{UUID}}', uuid.replace(/-/g, ''));
                customConfigHeader.navigation(requestID);
            }
        }
    };

    this.getCatalogs = function () {
        pepperi.api.catalogs.search({
            fields: ["UUID", "ExternalID", "Description", "ID"],
            responseCallback: 'customConfigHeader.getCatalogsCallback'
        });
    }

    this.getCatalogsCallback = function (res) {
        (res && res.objects && res.objects.length) ? this.catalogs = res.objects: false;
        this.buildHTML(customHeader.configFile.RightMenu, customHeader.configFile.DropdownList);
    }

    this.closeHamburgerMenu = function () {
        document.getElementById("dropdown-menu-mobile").classList.remove('chp_show')
    }
    this.closeHumanMenu = function () {
        document.getElementById("dropdown-menu-mobile").classList.toggle('chp_show')
    }


    this.buildHTML = function (section, dropdownList) {
        let htmlStr = '';
        let rightSideHtmlStr = '';
        const item = refItem;
       
        section.forEach(item => {
            let deepLink = item.deepLink?item.deepLink.replace(/\"/g, '%22'):'';
            let linkElement = ``;
            let subMenu = ''
            if (item.actionType === 'navigation') {
                linkElement = `<a onclick="customConfigHeader.navigation('${deepLink}')">${item.title}</a>`;
            } else if (item.actionType === 'activity') {
                linkElement = `<a onclick="customConfigHeader.createNewActivity('','','${deepLink}',true, '${item.activityName}')">${item.title}</a>`;
            } else if (item.actionType === 'transaction') {
                linkElement = `<a onclick="customConfigHeader.setUUIDandNav('','','${deepLink}')">${item.title}</a>`;
            } else if (item.actionType === 'openInNewTab') {
                linkElement = `<a onclick="customConfigHeader.openInNewTab('${deepLink}')">${item.title}</a>`;

            } else if (item.actionType === 'dropdown') {
                if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    linkElement = `<li class="chp_dropdown_2Mob" onclick="customConfigHeader.openMobDropdown(this)">${item.title}<ul>`
                    dropdownList.forEach(element => {
                        if(element.parentLink == item.title){
                            if (element.actionType === 'navigation') {
                                subMenu += `<li onclick="customConfigHeader.navigation('${element.deepLink}')">${element.title}</li>`;
                            } else if (element.actionType === 'activity') {
                                subMenu += `<li onclick="customConfigHeader.createNewActivity('','','${element.deepLink}',true, '${element.activityName}')">${element.title}</li>`;
                            } else if (element.actionType === 'transaction') {
                                subMenu += `<li onclick="customConfigHeader.setUUIDandNav('','','${element.deepLink}')">${element.title}</li>`;
                            } else if (element.actionType === 'openInNewTab') {
                                subMenu += `<li onclick="customConfigHeader.openInNewTab('${element.deepLink}')">${element.title}</li>`;
            
                            }
                        }
                    })
                    linkElement += `${subMenu}</ul></li>`
                } else {
                    linkElement = `<li class="chp_dropdown_1 chp_dropdown-traits">
                        <div>${item.title}</div>
                            <div class="chp_dropdown-content_1 chp_dropdown-put"><ul>`
                            dropdownList.forEach(element => {
                                if (element.parentLink == item.title){
                                    if (element.actionType === 'navigation') {
                                        subMenu += `<li onclick="customConfigHeader.navigation('${element.deepLink}')">${element.title}</li>`;
                                    } else if (element.actionType === 'activity') {
                                        subMenu += `<li onclick="customConfigHeader.createNewActivity('','','${element.deepLink}',true, '${element.activityName}')">${element.title}</li>`;
                                    } else if (element.actionType === 'transaction') {
                                        subMenu += `<li onclick="customConfigHeader.setUUIDandNav('','','${element.deepLink}')">${element.title}</li>`;
                                    } else if (element.actionType === 'openInNewTab') {
                                        subMenu += `<li onclick="customConfigHeader.openInNewTab('${element.deepLink}')">${element.title}</li>`;
                                    }
                                }
                                
                            })
                    linkElement+=`${subMenu}</ul></div>
                        </li>`
                }
            }

            let catalog = this.catalogs.find((el) => el.ExternalID === item.catalog);
            if(item.actionType === 'dropdown'){
                htmlStr += `${linkElement}`;    
            }else{
                htmlStr += `<li>${linkElement}</li>`;
            }
            
        })

        

        document.getElementById('test-drpd').innerHTML += htmlStr;
        document.getElementById('header_btn_bar').innerHTML = htmlStr;
        // break;

        


        document.getElementById('userName1').innerHTML = this.userName;

    }

    customConfigHeader.openMobDropdown = function (data) {
        console.log(data.children[0]);
        data.children[0].classList.toggle('chp_show')
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
            file.href = 'https://burrypony.github.io/test/header/header.css';

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


}.apply(customConfigHeader));