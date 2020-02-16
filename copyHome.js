(function () {

    $(document).ready(function () {

        const dataArray = getDataFromSessionStorage();
        const chosenSwitch = {};
        let graphData = {};
        let isInGraphView = false;

        let candidate;

        function createId(coinId, type) { return `${coinId}-${type}` };

        function removeSwitch(elementId) {
            chosenSwitch[elementId] && delete chosenSwitch[elementId]
            const element = document.getElementById(elementId)
            if (!!element) { element.checked = false }
        }

        function addSWitch(elementId, data) {
            chosenSwitch[elementId] = data;
            const element = document.getElementById(elementId)
            if (!!element) { element.checked = true }
        }

        setInterval(setGraphData, 2000)

        function setGraphData() {
            if (Object.keys(chosenSwitch).length <= 0 || !isInGraphView) return;
            const relevantSymbols = Object.values(chosenSwitch).map(({ symbol, }) => symbol);
            const url = buildPath(...relevantSymbols);
            $.ajax({
                type: 'GET',
                url,
                contentType: 'application/json',
                success: function (data) {
                    graphData = data
                },
                error: function () {
                    console.log("Error! cannot GET data from server.");
                }
            });
        }

        function buildPath(...args) {
            const pathStart = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms='
            const pathEnd = '&tsyms=USD,EUR'
            const params = args.join(",")
            return pathStart + params + pathEnd
        }

        displayView();
        onSearchBtnCkick();

        function displayView() {

            $.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins',
                contentType: 'application/json',
                success: function (data) {
                    cleareDynamicArea();
                    renderData(data);
                    setDataOnSessionStorage(data);
                    console.log("Successful GET request.");
                    Object.keys(chosenSwitch).forEach(id => document.getElementById(id).checked = true)
                },
                error: function () {
                    console.log("Error! cannot GET data from server.");
                }
            });
        };

        function renderData(data) {
            $.each(data, function (i, coin) {
                createCard(coin);
            });
        };

        function createCard(coin) {
            const coinId = coin.id;
            const inputId = createId(coinId, "input");
            const inputSwitch = $(`<input id = ${inputId} type = checkbox>`);
            inputSwitch.on("click", () => switchHandler(inputId, coin));
            const labelSwitch = $("<label class = switch>");
            const spanSwitch = $("<span>");
            const coinSymbol = $(`<h5 class = card-title>${coin.symbol}</h5>`);
            const coinName = $(`<p class = card-text>${coin.name}</p>`);
            const card = $(`<div id = ${createId(coinId, "card")} class = card-body>`);
            const infoBtn = $("<button class = btn-info>More Info</button>");
            const coinInfo = $(`<div id = ${createId(coinId, "info")} class = collapse>`);
            const img = $(`<img src = ${coin.image.small}>`);
            spanSwitch.attr("class", "slider round");
            // labelSwitch.attr("float", "right");
            labelSwitch.append(inputSwitch, spanSwitch);
            coinInfo.append(img, ` <p> ILS: ${coin.market_data.current_price.ils} </p> 
                <p> USD: ${coin.market_data.current_price.usd} </p>
                <p> EUR: ${coin.market_data.current_price.eur} </p>`);
            card.attr("class", "card card-block col-sm-3 card mb-3");
            // card.addClass("card");
            infoBtn.click(function () {
                coinInfo.toggle(500);
            });
            $(card).append(labelSwitch, coinSymbol, coinName, infoBtn, coinInfo);
            $("#container").append(card);
        };

        function switchHandler(elementId, coin) {

            const { name, symbol, } = coin;
            const currentElement = document.getElementById(`${coin.id}-input`)

            if (chosenSwitch[elementId] != null) {
                removeSwitch(elementId)
                return;
            };

            if (Object.keys(chosenSwitch).length > 4) {
                candidate = { id: elementId, data: { symbol, name } }
                currentElement.checked = false;
                createModalView({ name, symbol })
                $("#modal").show();
            } else {
                addSWitch(elementId, { name, symbol })
            };
        };

        function createModalView({ name, symbol }) {
            cleareModalValues();
            $("#modal-header").text(`If you want to add ${name}`);
            $("#modal-body").text(`You need to remove one of the following:`);

            // UI
            Object.entries(chosenSwitch).forEach(([id, { name, symbol }]) => {
                const label = createSwitch(id);
                const para = $(`<p>${name}</p>`);
                para.append(label);
                $("#modal-body").append(para);
            });

            $("#btnModalSaveChanges").click(() => {

                Object.keys(chosenSwitch).forEach(id => {

                    const currentElement = document.getElementById(`${id}-inner`);

                    if (currentElement && !currentElement.checked) {
                        removeSwitch(id)
                        addSWitch(candidate.id, candidate.data)
                    }

                    $("#modal").hide();
                    return
                });

                candidate = null;
                setGraphData(() => { })

            });
            return $("#modal-body");
        };

        $("#closeModalIcon").click(function () {
            $("#modal").hide();
        });
        $("#btnModalClose").click(function () {
            $("#modal").hide();
        });

        function createSwitch(id) {
            const input = $("<input>");
            const label = $("<label>");
            const span = $("<span>");
            input.attr("type", "checkbox");
            input.attr("id", `${id}-inner`)
            label.attr("class", "switch");
            label.css("float", "right");
            span.attr("class", "slider round");
            label.append(input, span);
            input.attr("checked", true)
            return label;
        };

        function onSearchBtnCkick() {
            $("#searchBtn").click(function () {
                const searchInput = $("#searchInput").val();
                if (searchInput === "") {
                    displayView();
                    cleareModalValues();
                    $("#modal-header").text("Sorry but...")
                    $("#modal-body").text("We need the code of the coin you are looking for.");
                    $("#btnModalSaveChanges").remove();
                    $("#modal").show();
                };

                for (let i = 0; i < dataArray.length; i++) {
                    if (searchInput === dataArray[i].symbol) {
                        cleareDynamicArea();
                        cleareInputField();
                        createCard(dataArray[i]);
                    };
                };
            });
        };

        function setDataOnSessionStorage(data) {
            sessionStorage.setItem("dataModel", JSON.stringify(data))
        };

        function getDataFromSessionStorage() {
            return JSON.parse(sessionStorage.getItem("dataModel"));
        };

        function cleareDynamicArea() {
            $("#container").empty();
        };

        function cleareModalValues() {
            $("#modal-header").text("");
            $("#modal-body").text("");
        };

        function cleareInputField() {
            $("#searchInput").val("");
        };

        $("#navBarToggler").click(function () {
            $("#navbarSupportedContent").toggle(1000);
        });

        $("#home").click(function () {
            isInGraphView = false;
            cleareDynamicArea();
            displayView();
        });

        $("#liveReports").click(function () {
            isInGraphView = true;
            cleareDynamicArea();
            showGraph(graphData)
        });

        $("#about").click(function () {
            isInGraphView = false;
            cleareDynamicArea();
            createAbout();
        });

    });

})();