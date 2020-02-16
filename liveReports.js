function showGraph(data) {
	const titles = Object.keys(data);
	console.log(data)
	let options = {
		// exportEnabled: true,
		animationEnabled: true,
		title: {
			text: "Live Reports"
		},
		subtitles: [{
			text: titles.join(", ")
		}],
		axisX: {
			title: "States"
		},
		axisY: {
			title: "Units Sold",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#4F81BC",
			includeZero: false
		},
		axisY2: {
			title: "Profit in USD",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E",
			includeZero: false
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "spline",
			name: "Units Sold",
			showInLegend: true,
			xValueFormatString: "MMM YYYY",
			yValueFormatString: "#,##0 Units",
			dataPoints: [
				{ x: new Date(), y: data.USD },
			]
		},
		{
			type: "spline",
			name: "Profit",
			axisYType: "secondary",
			showInLegend: true,
			xValueFormatString: "MMM YYYY",
			yValueFormatString: "$#,##0.#",
		}]
	};
	const graphDiv = $("<div>");
	graphDiv.css("position", "relative");
	graphDiv.CanvasJSChart(options);
	$("#container").append(graphDiv);

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
}


