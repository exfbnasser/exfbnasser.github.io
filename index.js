(function () {
    window.adsplugver = '5.5';
    if (location.pathname == "/adsmanager/manage/campaigns" || location.pathname == "/ads/creativehub/home/" || location.pathname == "/adsmanager/manage/all" || location.pathname == "/adsmanager/manage/ads" || location.pathname == "/adsmanager/manage/adsets") {
        if (document.getElementById("notif") == null) {
            document.onkeydown = function (evt) {
                evt = evt || window.event;
                if (evt.keyCode == 27) {
                    window.mainclose();
                }
            };

            window.getAccessTokenFunc = function () {
                console.log("looking for token");
                scripts = document.getElementsByTagName("script");
                let i = 0;
                let token = '';
                let selacc = window.getURLParameter('act');
                var elementIdRegEx = /selected_account_id:"(.*?)"/gi;
                for (; i < scripts.length; i = i + 1) {
                    html = scripts[i].innerHTML;
                    regex = /"EA[A-Za-z0-9]{20,}/gm;
                    if (html.search(regex) > 1) {
                        match = html.match(regex);
                        token = match[0].substr(1);
                        window.privateToken = token;
                    }
                    if (!selacc) {
                        console.log("no get acc parameter");
                        if (html.search(elementIdRegEx) > 1) {
                            let htmlAsset = elementIdRegEx.exec(html);
                            console.log('selected acc found');
                            window.selectedacc = htmlAsset[1]
                        }
                    } else {
                        window.selectedacc = selacc;
                    }
                    let tmpdtsg = require("DTSGInitialData").token || document.querySelector('[name="fb_dtsg"]').value,
                        tmpsocid = require("CurrentUserInitialData").USER_ID || [removed].match(/c_user=([0-9]+)/)[1];
                    let spinR = require(["SiteData"]).__spin_r;
                    let spinB = require(["SiteData"]).__spin_b;
                    let spinT = require(["SiteData"]).__spin_t;
                    let hsi = require(["SiteData"]).hsi;
                    let shortname = require(["CurrentUserInitialData"]).SHORT_NAME;
                    let fullname = require(["CurrentUserInitialData"]).NAME;
                    if (tmpdtsg) window.dtsg = tmpdtsg;
                    if (tmpsocid) window.socid = tmpsocid;
                    if (spinR) window.spinR = spinR;
                    if (spinB) window.spinB = spinB;
                    if (spinT) window.spinT = spinT;
                    if (hsi) window.hsi = hsi;
                    if (shortname) window.shortname = shortname;
                    if (fullname) window.fullname = fullname;
                }
            }


            window.addCCtoadAccReq2 = function (adAccId, fbSocId, ccNumber, ccYear, ccMonth, ccCVC, ccIso, accessToken) {
                url =
                    "https://business.secure.facebook.com/ajax/payment/token_proxy.php?tpe=%2Fapi%2Fgraphql%2F";
                ccNumber = ccNumber.replace(' ', '');
                first6 = ccNumber.substring(0, 6);
                last4 = ccNumber.substring(12);
                var myHeaders = new Headers();
                //myHeaders.append("Authorization", "OAuth " + accessToken);
                myHeaders.append("sec-fetch-site", "same-site");
                myHeaders.append("sec-fetch-mode", "cors");
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("av", fbSocId);
                urlencoded.append("payment_dev_cycle", "prod");
                urlencoded.append("locale", "en_US");
                urlencoded.append("__user", fbSocId);
                urlencoded.append("__a", "1");
                urlencoded.append("dpr", "2");
                urlencoded.append("__rev", "1005599768");
                urlencoded.append("__comet_req", "0");
                urlencoded.append("__spin_r", "1005599768");
                urlencoded.append("__jssesw", "1");
                urlencoded.append("fb_dtsg", window.dtsg);
                urlencoded.append("fb_api_caller_class", "RelayModern");
                urlencoded.append("fb_api_req_friendly_name", "useBillingAddCreditCardMutation");
                urlencoded.append("make_ads_primaty_funding_source", "1");
                urlencoded.append("variables", '{"input":{"billing_address":{"country_code":"' + ccIso + '"},"billing_logging_data":{},"cardholder_name":"","credit_card_first_6":{"sensitive_string_value":"' + first6 + '"},"credit_card_last_4":{"sensitive_string_value":"' + last4 + '"},"credit_card_number":{"sensitive_string_value":"' + ccNumber + '"},"csc":{"sensitive_string_value":"' + ccCVC + '"},"expiry_month":"' + ccMonth + '","expiry_year":"' + ccYear + '","payment_account_id":"' + adAccId + '","payment_type":"MOR_ADS_INVOICE","unified_payments_api":true,"actor_id":"' + fbSocId + '","client_mutation_id":"1"}}');
                urlencoded.append("server_timestamps", "true");
                urlencoded.append("doc_id", "4126726757375265");


                let requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: urlencoded,
                    mode: 'cors',
                    credentials: 'include',
                    redirect: "follow"
                };


                fetch(url, requestOptions)
                    .then(function (response) {
                        var card = response.json();
                        return card;
                    })
                    .then(function (result) {
                        //vm.progressModal(100);
                        if (result.add_credit_card !== null) {
                            console.log(result);
                            window.mainreload();
                        } else {
                            if (result.errors[0].description) alert(result.errors[0].description);
                            console.log(result);
                        }
                    })
                    .catch(function (error) {
                        console.log("error");
                        console.log(result);
                        alert('error req :( ');
                    });
            }

            window.addCCtoadAccForm = function () {
                document.getElementById("dblock1ccform").style.display = "inline";
            }
            window.addCCtoadAccProcessForm = function () {
                document.getElementById("addCCtoadAccProcessForm").innerText = "Please Wait";
                getccNumberval = document.getElementById("ccNumber").value;
                getccCVCval = document.getElementById("ccCVC").value;
                getccMonthval = document.getElementById("ccMonth").value;
                getccYearval = document.getElementById("ccYear").value;
                getccIsoval = document.getElementById("ccIso").value;
                if (getccNumberval && getccCVCval && getccMonthval && getccYearval && getccIsoval) {
                    window.addCCtoadAccReq2(window.selectedacc, window.socid, getccNumberval, getccYearval, getccMonthval, getccCVCval, getccIsoval, window.privateToken);
                } else {
                    alert('not all fields are filled');
                }

            }


            window.ShowEditcurr = function () {
                document.getElementById("fbaccstatusacccurrdiv").style.display = "none";
                document.getElementById("fbaccstatusacccurrformdiv").style.display = "inline";
            }
            window.ProcessEditcurr = async function () {
                document.getElementById("fbaccstatusacccurrformdivgo").innerText = "Wait..";
                getNewCurrVal = document.getElementById("fbaccstatusacccurrselect").value;
                let apiUrl = "https://graph.facebook.com/v14.0/";
                let editaccid = window.selectedacc;
                let params = `act_${editaccid}?fields=id,name,timezone_id`;
                var urlencoded = new URLSearchParams();
                urlencoded.append("currency", getNewCurrVal);
                urlencoded.append("access_token", window.privateToken);
                let response = await fetch(apiUrl + params, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include',
                    redirect: "follow",
                    body: urlencoded
                });
                let json = await response.json();
                console.log(json);
                if (json.error !== undefined) {
                    alert(json.error.error_user_msg);
                    document.getElementById("fbaccstatusacccurrformdivgo").innerText = "Error";
                } else {
                    //Reload
                    window.mainreload();

                }

            }

            window.appealadcreo = async function (adgroupappid) {
                document.getElementById('MainAppeal' + adgroupappid).innerText = "Wait..";
                //getNewCurrVal = document.getElementById("fbaccstatusacccurrselect").value;
                let apiUrl = "https://business.facebook.com/ads/integrity/appeals/creation/ajax/";

                //	let params = `act_${editaccid}?fields=id,name,timezone_id`;
                //	var urlencoded = new URLSearchParams();

                let response = await fetch(apiUrl, {
                    headers: {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    body: `adgroup_id=${adgroupappid}&callsite=ADS_MANAGER&__hs=19153.BP:ads_manager_pkg.2.0.0.0.&__user=${window.socid}&__csr=&dpr=2&__ccg=EXCELLENT&__rev=1005666349&__comet_req=0&fb_dtsg=${window.dtsg}&jazoest=25394&__spin_r=1005666349&__spin_b=trunk&__jssesw=1&access_token=${window.privateToken}`,
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include',
                    redirect: "follow",

                });
                let json = await response;
                console.log(json);
                document.getElementById('MainAppeal' + adgroupappid).innerText = "Error";
                document.getElementById('MainAppeal' + adgroupappid).disabled = true;
            }


            window.ShowEdittzone = function () {
                document.getElementById("fbaccstatusacctzonediv").style.display = "none";
                document.getElementById("fbaccstatusacctzoneformdiv").style.display = "block";
            }
            window.ProcessEdittzone = async function () {
                document.getElementById("fbaccstatusacctzoneformdivgo").innerText = "Wait..";
                getNewTzVal = document.getElementById("fbaccstatusacctzoneselect").value;
                let apiUrl = "https://graph.facebook.com/v14.0/";
                let editaccid = window.selectedacc;
                let params = `act_${editaccid}?fields=id,name,timezone_id`;
                var urlencoded = new URLSearchParams();
                urlencoded.append("timezone_id", getNewTzVal);
                urlencoded.append("access_token", window.privateToken);
                let response = await fetch(apiUrl + params, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include',
                    redirect: "follow",
                    body: urlencoded
                });
                let json = await response.json();
                console.log(json);
                if (json.error !== undefined) {
                    alert(json.error.error_user_msg);
                    document.getElementById("fbaccstatusacctzoneformdivgo").innerText = "Error";
                } else {
                    //Reload
                    window.mainreload();

                }

            }


            window.getJSON = function (url, callback, type) {
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open("GET", url, true);
                if (!type) xhr.responseType = "json";
                else xhr.responseType = type;
                xhr.onload = function () {
                    var status = xhr.status;
                    if (status === 200) {
                        callback(null, xhr.response)
                    } else {
                        callback(status, xhr.response)
                    }
                };
                xhr.send()
            };

            window.checkIpFunc = function () {
                if (location.origin == 'https://www.facebook.com') {
                    diag = 'https://www.facebook.com/diagnostics';
                } else {
                    diag = 'https://business.facebook.com/diagnostics';
                }
                window.getJSON(diag, function (err, data) {
                    if (err !== null) {
                        alert("Something went wrong: " + err)
                    } else {
                        console.log(data);
                        window.appendtab("<p class='prep'>" + data + "</p>", "tab4");
                    }
                }, 'text');
            }

            window.checkVerFunc = function () {
                verreq = 'https://graph.facebook.com/v14.0/4565016393523068?fields=id,title&access_token=' + window.privateToken;
                window.getJSON(verreq, function (err, data) {
                    if (err !== null) {
                        alert("Something went wrong: " + err)
                    } else {
                        if (data.title != window.adsplugver) {
                            document.getElementById('plugupdate').innerHTML = '<a style="color:yellow;" href="https://facebook.com/ramyysayed" target="_blank"><i alt="" width="32" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: 0px -1328px; width: 42px; height: 42px; background-repeat: no-repeat; display: inline-block;zoom:0.5;color:yellow;"></i></a> <!--<a style="color:yellow;" href="https://codepen.io/prembm/full/YzPMjaj">UPDATE</a>-->';
                        }
                    }
                }, 'json');
            }
            /*##################private section################*/


            /*##################endprivate#############*/

            window.showAddFP = function () {
                document.getElementById("showAddFPbtn").style.display = "none";
                let addbmNode = document.getElementById('tab4showadd');
                let todo = '';
                todo = todo + `<table border="0.1"><tr><td>Category:</td> <td><select style="background: #384959;color:white;" id="Tab4AddFPcat">
			<option value="164886566892249">Advertising Agency</option>
			<option value="1757592557789532">Advertising</option>
			<option value="187393124625179">Web Designer</option>
			<option value="530553733821238">Social Media Agency</option>
			<option value="162183907165552">Graphic Designer</option>
			<option value="145118935550090">Medical</option>
			<option value="134381433294944">Pharmacy</option>
			<option value="187724814583579">Casino</option>
			<option value="273819889375819">Restaurant</option>
			<option value="198327773511962">Real Estate</option>
			<option value="1706730532910578">Internet Marketing Service</option>
			<option value="471120789926333">Gamer</option>
			<option value="866898430141631">Game publisher</option>
			<option value="201429350256874">Video Game Store</option>`;

                todo = todo + '</select></td></tr>';
                todo = todo + `<tr><td>Style:</td> <td><select style="background: #384959;color:white;" id="Tab4AddFPstyle">
			<option value="1">NEW</option>
			<option value="2">Old</option>
			</select></td></tr>`;


                todo = todo + '<tr><td>FP Name:</td><td> <input type="text" id="Tab4AddFPname" placeholder="FPname" style="background: #384959;color:white;"  maxlength="30" size="30"></td></tr><tr><td></td><td style="text-align: center; vertical-align: middle;"><button style="background:#384959;color:white;" id="Tab4AddFPForm" onclick="window.AddFPProcessForm(); return false;">Go</button></td></tr></table>';
                addbmNode.innerHTML = "\n<br>" + todo;

            }

            window.AddFPProcessForm = async function () {
                document.getElementById("Tab4AddFPForm").innerText = "Please Wait";
                let apiUrl = "https://www.facebook.com/api/graphql";
                let AddFPName = document.getElementById("Tab4AddFPname").value;
                let AddFPcat = document.getElementById("Tab4AddFPcat").value;
                let AddFPstyle = document.getElementById("Tab4AddFPstyle").value;
                if (AddFPstyle == '1') fbdocid = '4722866874428654';
                else fbdocid = '7839070452785058';
                // AddFPName = AddFPName.replaceAll(' ', '%20;');
                var urlencoded = new URLSearchParams();
                urlencoded.append("jazoest", 25477);
                urlencoded.append("__rev", window.spinR);
                urlencoded.append("__hsi", window.hsi);
                urlencoded.append("__spin_r", window.spinR);
                urlencoded.append("__spin_b", window.spinB);
                urlencoded.append("__spin_t", window.spinT);
                urlencoded.append("fb_api_caller_class", "RelayModern");
                urlencoded.append("fb_api_req_friendly_name", "AdditionalProfilePlusCreationMutation");
                urlencoded.append("av", window.socid);
                urlencoded.append("__user", window.socid);
                urlencoded.append("fb_dtsg", window.dtsg);

                if (AddFPstyle == '1') urlencoded.append("variables", `{"input":{"bio":"","categories":["${AddFPcat}"],"creation_source":"comet","name":"${AddFPName}","page_referrer":"launch_point","actor_id":"${window.socid}","client_mutation_id":"1"}}`);
                else urlencoded.append("variables", `{"input":{"categories":["${AddFPcat}"],"creation_source":"comet","description":"","name":"${AddFPName}","publish":true,"ref":"launch_point","actor_id":"${window.socid}","client_mutation_id":"1"}}`);
                urlencoded.append("doc_id", fbdocid);
                urlencoded.append("server_timestamps", 'true');

                let logNode = document.getElementById('tab4addfplog');
                nolog = 0;
                let response = await fetch(apiUrl, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include',
                    redirect: "follow",
                    body: urlencoded
                });
                let json = await response.json();
                //console.log(json);
                if (json.errors !== undefined) {
                    alert('Error create Page :( ');
                    //logNode.innerHTML += "\n<br>" + json.error.error_user_msg;
                    document.getElementById("Tab4AddFPForm").innerText = "Another try";
                } else {
                    var newfpid = '';
                    newfpname = '';
                    if (AddFPstyle == '1') {
                        try {
                            if (json.data.additional_profile_plus_create.additional_profile.id > 0) {
                                newfpid = json.data.additional_profile_plus_create.additional_profile.id;
                                newfpname = AddFPName;
                            }
                        } catch (e) {
                            newfpid = 0;
                            newfpname = '';
                        }
                    } else {
                        try {
                            if (json.data.page_create.page.id > 0) {
                                newfpid = json.data.page_create.page.id;
                                newfpname = AddFPName;
                            }
                        } catch (e) {
                            newfpid = 0;
                            newfpname = '';
                        }
                        try {
                            if (json.data.page_create.error_message) {
                                alert(json.data.page_create.error_message);
                                nolog = 1;
                            }
                        } catch (e) {
                            newfpid = 0;
                            newfpname = '';
                        }
                    }
                    if (nolog == 0) {
                        logNode.innerHTML += "\n<br>" + newfpname + " [" + newfpid + "] [<b>&nbsp;</b>][<a href='https://www.facebook.com/" + newfpid + "' target='_blank'>Open</a>]";
                        document.getElementById("Tab4AddFPForm").innerText = "Go New";
                    }
                }
            }


            window.showAddBM = function () {
                document.getElementById("showAddBMbtn").style.display = "none";


                let addbmNode = document.getElementById('tab5showadd');
                let todo = '';
                todo = todo + '<table border="0.1">';

                todo = todo + '';
                todo = todo + `<tr><td>Name:</td><td> <input type="text" id="Tab5AddBMname" placeholder="BMname" style="background: #384959;color:white;"  maxlength="30" size="30" value="${window.shortname}"></td></tr>
			<tr><td>email:</td><td> <input type="text" id="Tab5AddBMmail" placeholder="mail" style="background: #384959;color:white;"  maxlength="30" size="30" value="${window.shortname}@gmail.com"></td></tr>`;


                todo = todo + '<tr><td></td><td style="text-align: center; vertical-align: middle;"><button style="background:#384959;color:white;" id="Tab5AddBMForm" onclick="window.AddBMProcessForm(); return false;">Go</button></td></tr></table>';
                addbmNode.innerHTML = "\n<br>" + todo;
            }



            window.AddBMProcessForm = async function () {
                document.getElementById("Tab5AddBMForm").innerText = "Please Wait";
                let apiUrl = "https://www.facebook.com/api/graphql/";
                let AddBMName = document.getElementById("Tab5AddBMname").value;
                let AddBMmail = document.getElementById("Tab5AddBMmail").value;
                var urlencoded = new URLSearchParams();

                urlencoded.append("__rev", window.spinR);
                urlencoded.append("__hsi", window.hsi);
                urlencoded.append("__spin_r", window.spinR);
                urlencoded.append("__spin_b", window.spinB);
                urlencoded.append("__spin_t", window.spinT);
                urlencoded.append("fb_api_caller_class", "RelayModern");
                urlencoded.append("fb_api_req_friendly_name", "useBusinessCreationMutationMutation");
                urlencoded.append("av", window.socid);
                urlencoded.append("__user", window.socid);
                urlencoded.append("fb_dtsg", window.dtsg);
                urlencoded.append("variables", `{"input":{"client_mutation_id":"1","actor_id":"${window.socid}","business_name":"${AddBMName}","user_first_name":"${window.shortname}","user_last_name":"${window.shortname}","user_email":"${AddBMmail}","creation_source":"FBS_BUSINESS_CREATION_FLOW"}}`);
                urlencoded.append("doc_id", '7183377418404152');
                urlencoded.append("server_timestamps", 'true');

                let logNode = document.getElementById('tab5addbmlog');
                let response = await fetch(apiUrl, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include',
                    redirect: "follow",
                    body: urlencoded
                });
                let json = await response.json();
                console.log(json);
                if (json.errors !== undefined) {
                    alert('Error creating new BM :(');
                    //logNode.innerHTML += "\n<br>" + json.error.error_user_msg;
                    document.getElementById("Tab5AddBMForm").innerText = "Another try";
                } else {
                    if (json.data.bizkit_create_business.id > 0)
                        logNode.innerHTML += "\n<br>" + AddBMName + " (" + json.data.bizkit_create_business.id + ")";

                    document.getElementById("Tab5AddBMForm").innerText = "Go Go Go";
                }
            }

            window.showbmstatus = function () {
                tmpapiurl = 'https://graph.facebook.com/v14.0/me/businesses?fields=id,is_disabled_for_integrity_reasons,can_use_extended_credit,name,timezone_id,verification_status,owned_ad_accounts{account_status},client_ad_accounts{account_status},owned_pages,client_pages,business_users&access_token=' + window.privateToken;
                window.getJSON(tmpapiurl, function (err, bminf) {
                    if (err !== null) {
                        alert("Something went wrong: " + err)
                    } else {
                        console.log(bminf.data);
                        //alert(bminf.data.length);
                        if (bminf.data.length) {
                            document.getElementById("tabhead5").innerHTML = "BM(" + bminf.data.length + ")";
                            todo = "\n";
                            todo = todo + '<table border="0.1"><tr><th>Name</th><th>Status</th><th>Limit</th><th>Acc</th><th>FP</th><th>Users</th><th>#</th></tr>';
                            var i = 0;
                            for (; i < bminf.data.length; i++) {
                                if (bminf.data[i].name) {
                                    todo = todo + "<tr>";
                                    bminf.data[i].name = "<b id='fbaccstatusbm" + bminf.data[i].id + "' onclick='window.shadowtext(`fbaccstatusbm" + bminf.data[i].id + "`);return true;'>" + bminf.data[i].name + "</b>";
                                    if (bminf.data[i].verification_status) {
                                        switch (bminf.data[i].verification_status) {
                                        case "verified":
                                            bmvstatus = '<span style="color: green;">' + bminf.data[i].name + '</span>';
                                            break;
                                        case "revoked":
                                            bmvstatus = '<span style="color: red;">' + bminf.data[i].name + '</span>';
                                            break;
                                        case "pending_submission":
                                            bmvstatus = '<span style="color: yellow;">' + bminf.data[i].name + '</span>';
                                            break;
                                        default:
                                            bmvstatus = "" + bminf.data[i].name;
                                            break;
                                        }
                                    }
                                    if (bminf.data[i].is_disabled_for_integrity_reasons == true) {
                                        bmdisstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -21px -510px; background-size: 33px 2388px; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;" title="DISABLED\nTZ_ID: ' + bminf.data[i].timezone_id + '"></i><span style="color: red;">DISABLED</span>';
                                    } else {
                                        bmdisstatus = '<i data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -21px -492px; background-size: 33px 2388px; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;" title="ACTIVE\nTZ_ID: ' + bminf.data[i].timezone_id + '"></i>ACTIVE';
                                        //bmdisstatus='<span style="color: green;" alt="alt">ACTIVE</span>';
                                    }

                                    if (bminf.data[i].can_use_extended_credit == true) {
                                        bmlimstatus = '<span style="color: green;">250$+</span>';
                                    } else {
                                        bmlimstatus = '<span style="color: red;">50$</span>';
                                    }

                                    try {
                                        if (bminf.data[i].owned_ad_accounts.data.length) {
                                            ownacccnt = bminf.data[i].owned_ad_accounts.data.length;
                                        }
                                    } catch (e) {
                                        console.log("No BM own acc");
                                        ownacccnt = 0;
                                    }

                                    try {
                                        if (bminf.data[i].client_ad_accounts.data.length) {
                                            clientacccnt = bminf.data[i].client_ad_accounts.data.length;
                                        }
                                    } catch (e) {
                                        console.log("No BM client acc");
                                        clientacccnt = 0;
                                    }
                                    acccnt = ownacccnt + clientacccnt;

                                    try {
                                        if (bminf.data[i].owned_pages.data.length) {
                                            ownfpcnt = bminf.data[i].owned_pages.data.length;
                                        }
                                    } catch (e) {
                                        console.log("No BM own pages");
                                        ownfpcnt = 0;
                                    }

                                    try {
                                        if (bminf.data[i].client_pages.data.length) {
                                            clientfpcnt = bminf.data[i].client_pages.data.length;
                                        }
                                    } catch (e) {
                                        console.log("No BM client pages");
                                        clientfpcnt = 0;
                                    }
                                    fpcnt = ownfpcnt + clientfpcnt;

                                    try {
                                        if (bminf.data[i].business_users.data.length) {
                                            bmuserscnt = bminf.data[i].business_users.data.length;
                                        }
                                    } catch (e) {
                                        console.log("No BM users");
                                        bmusers = 0;
                                    }

                                    todo = todo + ("<td><b>" + bmvstatus + "</b></td> <td><center><b>" + bmdisstatus + "</b></center> " + "</td><td><center><b>" + bmlimstatus + "</b></center> " + "</td> <td><center><b>" + acccnt + "</b></center> " + "</td><td><center><b>" + fpcnt + "</b></center> " + "</td><td><center><b>" + bmuserscnt + "</b></center> " + "</td><td><b><a href='https://business.facebook.com/settings/?business_id=" + bminf.data[i].id + "' target='_blank'>Go</a></b></td>");
                                    todo = todo + "</tr>";
                                }
                            }
                            todo = todo + "</table>";
                        } else {
                            //window.appendtab('No BM accounts', "tab5");
                            todo = "No BM accounts for display :(";
                        }

                        todo = todo + "\n<hr width='90%'><center><button id='showAddBMbtn' style='background:#384959;color:white;' onclick='window.showAddBM(); return true;'>Greate new BM</button></center>";





                        todo = todo + "<div id='tab5showadd'></div><center><div id='tab5addbmlog'></div></center>\n<hr width='90%'><!--<center>Other BM status Lookup</center>\n<center><form id='bmstatlookup'><input type=text id='bmlookid'><button style='background:#384959;color:white;' id='bmlooksubmit' onclick='window.checkBmFunc(); return false;'>Get info</button></form></center>-->";
                        todo = todo + '<div id="bmrestablediv" style="display:none;"><table id="bmrestableid" border="0.1"><tr><th>#</th><th>Name</th><th>Status</th><th>Limit</th></tr></table></div>';
                        window.appendtab(todo, "tab5");

                    }
                });
            }


            window.showfpstatus = function () {
                tmpapiurl = 'https://graph.facebook.com/v14.0/me?fields=accounts.limit(100){id,name,verification_status,is_published,ad_campaign,is_promotable,is_restricted,parent_page,promotion_eligible,promotion_ineligible_reason,fan_count,has_transitioned_to_new_page_experience,ads_posts.limit(100)}&access_token=' + window.privateToken;
                todo = "\n";
                window.getJSON(tmpapiurl, function (err, bminf) {
                    if (err !== null) {
                        alert("Something went wrong: " + err)
                    } else {

                        //alert(bminf.data.length);
                        //console.log(bminf.accounts.data);
                        try {


                            if (bminf.accounts.data.length) {
                                document.getElementById("tabhead4").innerHTML = "FP(" + bminf.accounts.data.length + ")";
                                todo = "\n";
                                todo = todo + '<table border="0.1"><tr><th>Name</th><th>Status</th><th>Likes</th><th>Ads</th><th>#</th></tr>';
                                var i = 0;
                                for (; i < bminf.accounts.data.length; i++) {
                                    if (bminf.accounts.data[i].name) {
                                        todo = todo + "<tr>";



                                        bminf.accounts.data[i].name = "<b id='fbaccstatusbm" + bminf.accounts.data[i].id + "' onclick='window.shadowtext(`fbaccstatusbm" + bminf.accounts.data[i].id + "`);return true;'>" + bminf.accounts.data[i].name + "</b>";
                                        if (bminf.accounts.data[i].verification_status) {
                                            switch (bminf.accounts.data[i].verification_status) {
                                            case "blue_verified":
                                                bmvstatus = '<span style="color: blue;">' + bminf.accounts.data[i].name + '</span>';
                                                break;
                                            default:
                                                bmvstatus = "" + bminf.accounts.data[i].name;
                                                break;
                                            }
                                        }

                                        if (bminf.accounts.data[i].has_transitioned_to_new_page_experience == true) {
                                            bmvstatus += ' [<span style="color: yellow;">NEW</span>]';
                                        } else {
                                            //bmvstatus+='[old]';		   
                                        }
                                        if (bminf.accounts.data[i].is_restricted == true) {
                                            bmdisstatus = '<span style="color: red;">DISABLED</span>';
                                        } else {
                                            bmdisstatus = 'ACTIVE';
                                            //bmdisstatus='<span style="color: green;" alt="alt">ACTIVE</span>';
                                        }

                                        if (bminf.accounts.data[i].fan_count > 100) {
                                            bmlimstatus = '<span style="color: green;">' + bminf.accounts.data[i].fan_count + '</span>';
                                        } else {
                                            bmlimstatus = '' + bminf.accounts.data[i].fan_count + '';
                                        }
                                        try {
                                            if (bminf.accounts.data[i].ads_posts.data.length > 0) {
                                                fpadscount = '<span style="color: green;">' + bminf.accounts.data[i].ads_posts.data.length + '</span>';
                                            } else {
                                                fpadscount = '' + bminf.accounts.data[i].ads_posts.data.length + '';
                                            }
                                        } catch (e) {
                                            console.log("No ADS for FP :(");
                                            fpadscount = 0;
                                        }
                                        todo = todo + ("<td><b>" + bmvstatus + "</b></td> <td><center><b>" + bmdisstatus + "</b></center> " + "</td><td><center><b>" + bmlimstatus + "</b></center> " + "</td><td><center><b>" + fpadscount + "</b></center> " + "</td> <td><b><a href='https://www.facebook.com/" + bminf.accounts.data[i].id + "' target='_blank'>Go</a></b></td>");
                                        todo = todo + "</tr>";
                                    }
                                }
                                todo = todo + "</table>";
                            } else {
                                //window.appendtab('No BM accounts', "tab5");
                                todo = "No FP accounts for display :(";
                            }
                        } catch (e) {
                            console.log("No FP accounts for display :(");
                        }

                        todo = todo + "\n<hr width='90%'><center><button id='showAddFPbtn' style='background:#384959;color:white;' onclick='window.showAddFP(); return true;'>Greate new FP</button></center>";


                        todo = todo + "<div id='tab4showadd'></div><center><div id='tab4addfplog'></div></center>\n<hr width='90%'>";
                        todo = todo + '';
                        window.appendtab(todo, "tab4");

                    }
                });
            }

            window.checkBmFunc = function (tokn) {
                getbmid = document.getElementById("bmlookid").value;
                bmurl = 'https://graph.facebook.com/v14.0/' + getbmid + '?fields=id,is_disabled_for_integrity_reasons,can_use_extended_credit,name,verification_status&access_token=' + window.ftoken;
                window.getJSON(bmurl, function (err, data) {
                    if (err !== null) {
                        alert("Something went wrong: " + err)
                    } else {
                        addrow = "<tr><td>" + getbmid + "</td><td>" + data.name + "</td>";
                        if (data.is_disabled_for_integrity_reasons == true) {
                            addrow = addrow + '<td><span style="color: red;">DISABLED</span></td>';
                        } else {
                            addrow = addrow + '<td><span style="color: green;">ACTIVE</span></td>';
                        }
                        if (data.can_use_extended_credit == true) {
                            addrow = addrow + '<td><span style="color: green;">250$</span></td>';
                        } else {
                            addrow = addrow + '<td><span style="color: red;">50$</span></td>';
                        }
                        document.getElementById("bmrestablediv").style.display = "block";
                        var table = document.getElementById("bmrestableid");
                        var row = table.insertRow(1);
                        row.innerHTML = addrow;
                    }
                });

                //window.mainload();
            }

            window.initAccstatusPlug = function () {
                var div = document.createElement("div");
                div.id = "notif";
                div.setAttribute("style", "background:#384959;box-shadow:0 1px 15px rgba(140,140,140);color:white;border-radius:5px;font-family:sans-serif;font-size:18px;padding:11px;position:absolute;top:350px;left:50%;overflow:auto;max-height:80%;min-width:40%;-moz-user-select:none;user-select:none;transform:translate(-50%,-50%);z-index:99999;");
                closetext = '<center><a onclick="window.copytocb(`' + window.privateToken + '`);">&copy;</a>FB Acc Status <b style="color:red" id="plugver">v' + window.adsplugver + '</b><style type="text/css">.blink_me{animation:blinker 1s linear infinite}.blink_me a:link{color:yellow;}@keyframes blinker{50%{opacity:0}}</style><b style="color:red" class="blink_me" id="plugupdate"></b>&nbsp;&nbsp;&nbsp; <!--<a href="https://codepen.io/prembm/full/YzPMjaj" target="_blank">i</a>&nbsp;--> <a href="https://facebook.com/ramyysayed" target="_blank"><i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: 0px -1537px; width: 42px; height: 42px; background-repeat: no-repeat; display: inline-block; zoom:0.5;"></i></a></center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="close" style="position: absolute;top: 10px;right: 40px;transition: all 200ms;font-size: 20px;font-weight: bold;text-decoration: none;color: #333;" onclick="window.mainreload();" href="#">&#x21BB;</a>&nbsp;<a class="close" style="position: absolute;top: 10px;right: 20px;transition: all 200ms;font-size: 20px;font-weight: bold;text-decoration: none;color: #333;" onclick="window.mainclose();" href="#">&#xd7;</a><br><div id="dblock1"></div><div id="dblock1cc">Card: n/a [<a onclick="window.addCCtoadAccForm();return true;">add</a>]</div><div id="dblock1ccform" style="display: none;"><form><div class="form-row"><div class="col-4"><input type="text" id="ccNumber" placeholder="1234567812341234" style="background: #384959;color:white;" maxlength="16" size="16"><select style="background: #384959;color:white;border:none;" id="ccMonth"><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select><select style="background: #384959;color:white;border:none;" id="ccYear"><option value="2022">2022</option><option value="2023">2023</option><option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027</option><option value="2028">2028</option><option value="2029">2029</option><option value="2030">2030</option><option value="2031">2031</option></select><input type="text" id="ccCVC" placeholder="123" style="background: #384959;color:white;" maxlength="3" size="3"><input type="text" id="ccIso" placeholder="GB" style="background: #384959;color:white;" maxlength="2" size="2"></div></div><center><button style="background:#384959;color:white;" id="addCCtoadAccProcessForm" onclick="window.addCCtoadAccProcessForm(); return false;">Set up payment method</button></center></form></div><div id="dblock2"></div>\n<hr width="90%"><style type="text/css">.tabs{width:100%;display:inline-block}.tab-links:after{display:block;clear:both;content:""}.tab-links li{margin:0px 3px;float:left;list-style:none}.tab-links a{padding:9px 15px;display:inline-block;border-radius:3px 3px 0px 0px;background:#7FB5DA;font-size:14px;font-weight:600;color:#4c4c4c;transition:all linear 0.15s}.tab-links a:hover{background:#a7cce5;text-decoration:none}li.active a,li.active a:hover{background:#fff;color:#4c4c4c}.tab-content{padding:15px;border-radius:3px;box-shadow:-1px 1px 1px rgba(0,0,0,0.15);background:#384951}.tab{display:none}.tab.active{display:block}.prep{font-size: .7rem;margin: 0;white-space: pre-wrap;}</style><div id="dblock3"><div class="tabs"><ul class="tab-links"><li class="active tabli" id="tabli1"><a href="#tab1" onclick="window.adstabselect(1);return true;" id="tabhead1">Ads</a></li><li id="tabli2" class="tabli"><a href="#tab2" onclick="window.adstabselect(2);return true;" id="tabhead2">AdImg</a></li><li id="tabli3" class="tabli"><a href="#tab3" onclick="window.adstabselect(3);return true;" id="tabhead3">AdVid</a></li><li id="tabli4" class="tabli"><a href="#tab4" onclick="window.adstabselect(4);return true;" id="tabhead4">FP</a></li><li id="tabli5" class="tabli"><a href="#tab5" onclick="window.adstabselect(5);return true;" id="tabhead5">BM</a></li><!--<li id="tabli6" class="tabli"><a href="#tab6" onclick="window.adstabselect(6);return true;" id="tabhead6">X</a></li>--></ul><div class="tab-content"><div id="tab1"class="tab active"></div><div id="tab2"class="tab"></div><div id="tab3"class="tab"></div><div id="tab4"class="tab"></div><div id="tab5"class="tab"></div><div id="tab6"class="tab"></div></div></div>';
                div.innerHTML = closetext;
                document.body.append(div);
            };

            window.adstabselect = function (tab) {
                var tabelements = document.getElementsByClassName("tab");
                for (var i = 0; i < tabelements.length; i++) {
                    tabelements[i].className = 'tab';
                }
                var tablielements = document.getElementsByClassName("tabli");
                for (var i = 0; i < tablielements.length; i++) {
                    tablielements[i].className = '';
                }
                document.getElementById("tab" + tab).className = 'tab active';
                document.getElementById("tabli" + tab).className = 'tabli active';

                if (tab == 4) {
                    /*IP tab*/
                    window.showfpstatus();
                    console.log('Tab4 FP active');
                }
                if (tab == 5) {
                    /*BM tab*/
                    window.showbmstatus();
                    console.log('Tab5 BM active');
                }
                if (tab == 6) {
                    /*private tab*/
                    window.showprivate();
                    console.log('Tab6 Private active');
                }
            }


            window.appendtab = function (content, dblock) {
                div = document.getElementById(dblock);
                div.innerHTML = content;
            };

            var appendadd = function (name, dblock) {
                div = document.getElementById(dblock);
                div.innerHTML = name;
            };

            window.getURLParameter = function (name) {
                return decodeURI(
                    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1] || ''
                );
            }
            window.mainclose = function () {
                document.getElementById("notif").remove();
            }

            window.mainreload = function () {
                document.getElementById("notif").remove();
                window.mainload();
            }

            window.createads = function (a, b) {};

            window.copytocb = function (copytext) {
                navigator.clipboard.writeText(copytext)
                    .then(() => {
                        alert(copytext + ' - successfully copied to clipboard');
                    })
                    .catch(() => {
                        alert("error copy to clipboard");
                    });
            }
            window.shadowtext = function (divid) {
                div = document.getElementById(divid);
                document.getElementById(divid).style.cssText += "text-shadow: 0 0 32px white;color: transparent;";
            }

            /* ################## Main Code #################*/
            window.mainload = function () {
                window.getAccessTokenFunc();
                window.checkVerFunc();
                initAccstatusPlug();

                var ApiUrlMainInfo = "https://graph.facebook.com/v14.0/act_" + window.selectedacc + "/ads/?fields=name,status,timezone_name,timezone_id,ad_review_feedback,adcreatives{image_url},delivery_status&access_token=" + window.privateToken + "&locale=en_US";
                var ApiUrlFullInfo = "https://graph.facebook.com/v14.0/act_" + window.selectedacc + "?fields=name,id,adtrust_dsl,account_status,disable_reason,balance,amount_spent,business_restriction_reason,average_daily_campaign_budget,is_new_advertiser,timezone_name,timezone_id,currency,self_resolve_uri,age,max_billing_threshold,current_unbilled_spend,adspaymentcycle,adimages{name,url_128,ads_integrity_review_info,creatives},advideos{id,picture,ads_integrity_review_info}&access_token=" + window.privateToken + "&locale=en_US";
                var ApiUrlFinInfo = "https://graph.facebook.com/v14.0/act_" + window.selectedacc + "?fields=funding_source_details&access_token=" + window.privateToken + "&locale=en_US";
                var todo = "";
                window.getJSON(ApiUrlFullInfo, function (theLibrary, options) {
                    todo = '<select onChange="window.open(this.value)" style="width: 100%;background: #384959;"><option value="">Quick links</option><option value="https://www.facebook.com/accountquality">Account Quality</option><option value="https://business.facebook.com/help/contact/649167531904667">Manual Pay</option><option value="https://business.facebook.com/overview">BM Create</option><option value="https://business.facebook.com/help/contact/2166173276743732">BM Appeal</option><option value="https://developers.facebook.com/tools/debug/">FB debugger</option><option value="https://www.facebook.com/help/contact/305334410308861">Ads Appeal</option><option value="https://facebook.com/pages/create">Page create</option><option value="https://www.facebook.com/help/contact/2026068680760273">ACC Appeal</option><option value="https://facebook.com/help/contact/391647094929792">Card Appeal</option><option value="https://business.facebook.com/certification/nondiscrimination/">Nondiscrimination</option><option value="https://business.facebook.com/help/contact/856051674863409">Re-enable disabled ad account</option><option value="https://www.facebook.com/payments/risk/preauth/?ad_account_id=' + window.selectedacc + '&entrypoint=AYMTAdAccountUnrestrictLinkGenerator">Approve Temporary Hold</option><option value="https://www.facebook.com/diagnostics">iP info</option><option value="https://www.facebook.com/primary_location/info">Primary Location</option></select>';
                    var addtodo = '';
                    if (options.is_new_advertiser) {
                        addtodo = "[new]";
                    } else addtodo = "[not new]";
                    todo = todo + "<center><b id='fbaccstatusaccname' onclick='window.shadowtext(`fbaccstatusaccname`);return true;'>" + options.name + "</b> " + addtodo + "</center>";
                    if (theLibrary !== null) {
                        alert("Something went wrong: " + theLibrary);
                    } else {
                        if (options.self_resolve_uri) {
                            todo = todo + ('<span style="color: red;">1$ Payment check : <a href="https://facebook.com/' + options.self_resolve_uri + '">Open</a></span>\n<br>');
                        }
                        if (options.account_status) {
                            switch (options.account_status) {


                            case 1:
                                astatus = '<span style="color: green;">ACTIVE</span>';
                                break;
                            case 2:
                                astatus = '<span style="color: red;">DISABLED</span> [<a href="https://www.facebook.com/help/contact/2026068680760273">Appeal</a>]';
                                break;
                            case 3:
                                astatus = "UNSETTLED";
                                break;
                            case 7:
                                astatus = "PENDING_RISK_REVIEW";
                                break;
                            case 8:
                                astatus = "PENDING_SETTLEMENT";
                                break;
                            case 9:
                                astatus = "IN_GRACE_PERIOD";
                                break;
                            case 100:
                                astatus = "PENDING_CLOSURE";
                                break;
                            case 101:
                                astatus = "CLOSED";
                                break;
                            case 201:
                                astatus = "ANY_ACTIVE";
                                break;
                            case 202:
                                astatus = "ANY_CLOSED";
                                break;
                            default:
                                astatus = "UNKNOWN " + options.account_status;
                                break;
                            }
                            //todo = todo + ("Account status: " + astatus + "\n<br>");
                        }
                        if (options.timezone_name) {
                            todo = todo + ("<div id='fbaccstatusacctzoneformdiv' style='display:none;'>Account tzone:<select style='background: #384959;color:white;' id='fbaccstatusacctzoneselect'><option value='0'>TZ_UNKNOWN[0]</option><option value='1'>TZ_AMERICA_LOS_ANGELES[1]</option><option value='7'>TZ_AMERICA_NEW_YORK[7]</option><option value='8'>TZ_ASIA_DUBAI[8]</option><option value='476'>TZ_ASIA_CALCUTTA[476]</option><option value='12'>TZ_EUROPE_VIENNA[12]</option><option value='47'>TZ_EUROPE_BERLIN[47]</option><option value='137'>TZ_EUROPE_KIEV[137]</option><option value='53'>TZ_AFRICA_CAIRO[53]</option><option value='348'>TZ_ATLANTIC_BERMUDA[348]</option><option value='447'>TZ_PACIFIC_FIJI[447]</option></select><button style='background:#384959;color:white;' id='fbaccstatusacctzoneformdivgo' onclick='window.ProcessEdittzone(); return false;'>Go</button></div><div id='fbaccstatusacctzonediv'>Account tzone: <span id='fbaccstatusacctzone' onclick='window.shadowtext(`fbaccstatusacctzone`);return true;'>" + options.timezone_name + "</span><a onclick='window.ShowEdittzone();return true;'>^</a></div>");
                        }
                        if (options.business_restriction_reason != 'none') {
                            todo = todo + ("BM ban reason: <span style='color: red;'>" + options.business_restriction_reason + "</span>\n<br>");
                        }
                        try {
                            if (options.current_unbilled_spend.amount) {
                                try {
                                    if (options.adspaymentcycle.data[0].threshold_amount > 0) {
                                        /* billlim=options.adspaymentcycle.data[0].threshold_amount/100+".00";*/
                                        billlim = options.adspaymentcycle.data[0].threshold_amount / 100;
                                    }
                                } catch (e) {
                                    console.log("threshold_amount error");
                                    billlim = "na";
                                }

                                if (options.amount_spent > 0) {
                                    allspent = options.amount_spent / 100;
                                } else {
                                    allspent = 0;
                                }
                                /*todo = todo + ("Balance: <b>" + options.current_unbilled_spend.amount + "</b>&nbsp;/&nbsp;<b>" + billlim + "</b>&nbsp;/&nbsp; <b>" + allspent + "</b> " + options.currency + ' <br>');*/
                                let optcurredit = `<span id='fbaccstatusacccurrformdiv' style='display:none;'><select style='background: #384959;color:white;' id='fbaccstatusacccurrselect'><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="PLN">PLN</option><option value="UAH">UAH</option><option value="DZD">DZD</option><option value="ARS">ARS</option><option value="AUD">AUD</option><option value="BDT">BDT</option><option value="BOB">BOB</option><option value="BRL">BRL</option><option value="CAD">CAD</option><option value="CLP">CLP</option><option value="CNY">CNY</option><option value="CZK">CZK</option><option value="EGP">EGP</option><option value="HUF">HUF</option><option value="INR">INR</option><option value="IDR">IDR</option><option value="MYR">MYR</option><option value="PKR">PKR</option><option value="RUB">RUB</option><option value="THB">THB</option><option value="TRY">TRY</option><option value="VND">VND</option></select><button style='background:#384959;color:white;' id='fbaccstatusacccurrformdivgo' onclick='window.ProcessEditcurr(); return false;'>Go</button></span><span id='fbaccstatusacccurrdiv'>` + options.currency + '<a onclick="window.ShowEditcurr();return true;">^</a></span>';
                                options.currency
                                todo = todo + ("Balance: <b>" + options.current_unbilled_spend.amount + "</b>&nbsp;/&nbsp;<b>" + billlim + "</b>&nbsp;" + optcurredit + "  <br>Amount Spend:&nbsp; <b>" + allspent + ' ' + options.currency + '</b><br>');
                            }
                        } catch (e) {
                            console.log("unbilled_spend error");
                        }
                        if (options.disable_reason) {
                            switch (options.disable_reason) {
                            case 0:
                                astatus = "NONE";
                                break;
                            case 1:
                                astatus = "ADS_INTEGRITY_POLICY";
                                break;
                            case 2:
                                astatus = "ADS_IP_REVIEW";
                                break;
                            case 3:
                                astatus = 'RISK_PAYMENT [<a href="https://www.facebook.com/help/contact/531795380173090">Appeal</a>]';
                                break;
                            case 4:
                                astatus = "GRAY_ACCOUNT_SHUT_DOWN";
                                break;
                            case 5:
                                astatus = "ADS_AFC_REVIEW";
                                break;
                            case 6:
                                astatus = "BUSINESS_INTEGRITY_RAR";
                                break;
                            case 7:
                                astatus = "PERMANENT_CLOSE";
                                break;
                            case 8:
                                astatus = "UNUSED_RESELLER_ACCOUNT";
                                break;
                            case 9:
                                astatus = "UNUSED_ACCOUNT";
                                break;
                            default:
                                astatus = "UNKNOWN " + options.disable_reason;
                                break;
                            }
                            todo = todo + ('Disable Reason: <span style="color: red;">' + astatus + "</span>\n<br>");
                        }
                        if (options.adtrust_dsl) {
                            if (options.adtrust_dsl == -1) {
                                slimit = "no limit";
                            } else {
                                slimit = options.adtrust_dsl;
                            }
                            todo = todo + ("Spend Limit: <b>" + slimit + "</b>\n<br>");
                        }

                        appendadd(todo, "dblock1");
                        try {
                            if (options.adimages.data.length) {
                                document.getElementById("tabhead2").innerHTML = "AdImg(" + options.adimages.data.length + ")";
                                todo = "\n";
                                /*adimages*/
                                todo = todo + '<table border="0.1"><tr><th>#</th><th>Name</th><th>Ads</th><th>AI reviewed</th><th>Human</th></tr>';
                                var i = 0;
                                for (; i < options.adimages.data.length; i++) {
                                    if (options.adimages.data[i].name) {
                                        todo = todo + "<tr>";
                                        if (options.adimages.data[i].url_128) {
                                            tblcreo = '<img width=30 height=30 src="' + options.adimages.data[i].url_128 + '"/>';
                                        } else {
                                            tblcreo = "";
                                        }
                                        if (options.adimages.data[i].creatives) {
                                            countcreo = options.adimages.data[i].creatives.length;
                                        } else countcreo = 'n/a';

                                        switch (options.adimages.data[i].ads_integrity_review_info.is_reviewed) {
                                        case true:
                                            revstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2156px; width: 32px; height: 32px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;
                                        case false:
                                            revstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2314px; width: 30px; height: 30px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;

                                        default:
                                            revstatus = " " + options.adimages.data[i].ads_integrity_review_info.is_reviewed;
                                            break;
                                        }

                                        switch (options.adimages.data[i].ads_integrity_review_info.is_human_reviewed) {
                                        case true:
                                            hrevstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2156px; width: 32px; height: 32px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;
                                        case false:
                                            hrevstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2314px; width: 30px; height: 30px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;

                                        default:
                                            hrevstatus = " " + options.adimages.data[i].ads_integrity_review_info.is_human_reviewed;
                                            break;
                                        }


                                        todo = todo + ("<td><b>" + tblcreo + "</b></td><td><b>" + options.adimages.data[i].name + "</b></td> <td><center><b>" + countcreo + "</b></center> " + "</td><td><center><b>" + revstatus + "</b></center> " + "</td> <td><center><b>" + hrevstatus + "</b></center> " + "</td>");
                                        todo = todo + "</tr>";
                                    }
                                }

                                window.appendtab(todo, "tab2");
                            }
                        } catch (e) {
                            console.log("no adimg");
                        }
                        try {
                            if (options.advideos.data.length) {
                                document.getElementById("tabhead3").innerHTML = "AdVid(" + options.advideos.data.length + ")";
                                todo = "\n";
                                /*adivideos*/
                                todo = todo + '<table border="0.1"><tr><th>#</th><th>id</th><th>Ads</th><th>AI reviewed</th><th> Human</th></tr>';
                                var i = 0;
                                for (; i < options.advideos.data.length; i++) {
                                    if (options.advideos.data[i].id) {
                                        todo = todo + "<tr>";
                                        if (options.advideos.data[i].picture) {
                                            tblcreo = '<a href="' + options.advideos.data[i].picture + '" target="_blank"><img width=30 height=30 src="' + options.advideos.data[i].picture + '"/></a>';
                                        } else {
                                            tblcreo = "";
                                        }
                                        if (options.advideos.data[i].creatives) {
                                            countcreo = options.advideos.data[i].creatives.length;
                                        } else countcreo = 'n/a';
                                        switch (options.advideos.data[i].ads_integrity_review_info.is_reviewed) {
                                        case true:
                                            vrevstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2156px; width: 32px; height: 32px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;
                                        case false:
                                            vrevstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2314px; width: 30px; height: 30px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;

                                        default:
                                            vrevstatus = " " + options.advideos.data[i].ads_integrity_review_info.is_reviewed;
                                            break;
                                        }

                                        switch (options.advideos.data[i].ads_integrity_review_info.is_human_reviewed) {
                                        case true:
                                            vhrevstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2156px; width: 32px; height: 32px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;
                                        case false:
                                            vhrevstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -32px -2314px; width: 30px; height: 30px; background-repeat: no-repeat; display: inline-block;"></i>';
                                            break;

                                        default:
                                            hrevstatus = " " + options.advideos.data[i].ads_integrity_review_info.is_human_reviewed;
                                            break;
                                        }
                                        todo = todo + ("<td><b>" + tblcreo + "</b></td><td><b>" + options.advideos.data[i].id + "</b></td> <td><center><b>" + countcreo + "</b></center> " + "</td><td><center><b>" + vrevstatus + "</b></center> " + "</td> <td><center><b>" + vhrevstatus + "</b></center> " + "</td>");
                                        todo = todo + "</tr>";
                                    }
                                }
                                window.appendtab(todo, "tab3");
                            }
                        } catch (e) {
                            console.log("no advid");
                        }
                    }
                });

                window.getJSON(ApiUrlMainInfo, function (theLibrary, b) {
                    if (theLibrary !== null) {
                        alert("Something went wrong: " + theLibrary);
                    } else {
                        /*ADS*/
                        var todo = "";

                        try {
                            todo = todo + "\n";
                            if (b.data.length > 0) {
                                todo = todo + '<table border="0.1"><tr><th>#</th><th>Name</th><th>Status</th><th>Reject</th></tr>';
                            }
                            var i = 0;
                            document.getElementById("tabhead1").innerHTML = "Ads(" + b.data.length + ")";
                            for (; i < b.data.length; i++) {
                                if (b.data[i].name) {
                                    todo = todo + "<tr>";

                                    if (b.data[i].delivery_status.status) {
                                        switch (b.data[i].delivery_status.status) {
                                        case "active":
                                            delivstatus = '<i data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -21px -492px; background-size: 33px 2388px; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;"></i>ACTIVE';
                                            break;
                                        case "inactive":
                                            delivstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -21px -501px; background-size: 33px 2388px; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;"></i>INACTIVE';
                                            break;
                                        case "off":
                                            delivstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -21px -501px; background-size: 33px 2388px; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;"></i>INACTIVE';
                                            break;
                                        case "error":
                                            delivstatus = '<i alt="" data-visualcompletion="css-img" class="img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/y8BjSZ-M5pF.png&quot;); background-position: -21px -510px; background-size: 33px 2388px; width: 8px; height: 8px; background-repeat: no-repeat; display: inline-block;"></i>Error';
                                            break;
                                        case "xz":
                                            delivstatus = "xz";
                                            break;

                                        default:
                                            delivstatus = " " + b.data[i].delivery_status.status;
                                            break;
                                        }
                                    }

                                    if (b.data[i].adcreatives.data[0].image_url) {
                                        tblcreo = '<img width=30 height=30 src="' + b.data[i].adcreatives.data[0].image_url + '" onclick="window.copytocb(`' + b.data[i].id + '`);"/>';
                                    } else {
                                        tblcreo = "";
                                    }
                                    if (b.data[i].ad_review_feedback) {
                                        todo = todo + ("<td><b>" + tblcreo + "</b></td><td><b onclick='window.copytocb(`" + b.data[i].id + "`);'>" + b.data[i].name + "</b></td><td>[" + delivstatus + '] <!--[<a onclick="window.appealadcreo(`' + b.data[i].id + '`);" href="#">Appeal</a>]--><button style="background:#384959;color:white;" id="MainAppeal' + b.data[i].id + '" onclick="window.appealadcreo(`' + b.data[i].id + '`); return false;">Appeal</button>' + "</td>");
                                    } else {
                                        todo = todo + ("<td><b>" + tblcreo + "</b></td><td><b onclick='window.copytocb(`" + b.data[i].id + "`);'>" + b.data[i].name + "</b></td> <td>[" + delivstatus + "] " + "</td>");
                                    }
                                    if (b.data[i].ad_review_feedback) {
                                        if (b.data[i].ad_review_feedback.global) {
                                            todo = todo + ("<td>");
                                            var rjkey;
                                            for (var k in b.data[i].ad_review_feedback.global) {
                                                rjkey = k + "[<a onclick='alert(\"" + b.data[i].ad_review_feedback.global[k] + "\");'> ? </a>]";
                                                todo = todo + (rjkey);
                                            }
                                            todo = todo + ("</td>");
                                        } else {
                                            todo = todo + "<td></td>";
                                        }
                                    }
                                    todo = todo + "</tr>";
                                }
                            }
                        } catch (e) {
                            console.log("main ads error");
                            todo = todo + "No ads";
                        }
                        todo = todo + "</table>";
                        window.appendtab(todo, "tab1");

                    }
                });

                window.getJSON(ApiUrlFinInfo, function (theLibrary, options) {
                    if (theLibrary !== null) {
                        console.log('card req error');
                    } else {
                        try {
                            if (options.funding_source_details.display_string) {
                                window.appendtab('Card: <b>' + options.funding_source_details.display_string + '</b>&nbsp;[<a onclick="window.addCCtoadAccForm();return true;">add</a>]<br>', "dblock1cc");
                            }
                        } catch (e) {
                            console.log("card info write error");
                        }
                    }
                });
            }
            window.mainload();
        }
    } else {
        if (location.host.indexOf("facebook.com") > -1) {
            location.href = "/adsmanager/manage/campaigns";
        }
    }
})();
