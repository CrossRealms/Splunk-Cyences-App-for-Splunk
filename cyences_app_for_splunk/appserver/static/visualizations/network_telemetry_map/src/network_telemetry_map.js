define([
    'jquery',
    'leaflet',
    'leaflet-curve',
    'api/SplunkVisualizationBase',
    'api/SplunkVisualizationUtils',
    'splunkjs/mvc'
],
    function (
        $,
        L,
        LCurve,
        SplunkVisualizationBase,
        SplunkVisualizationUtils,
        mvc
    ) {

        return SplunkVisualizationBase.extend({

            initialize: function () {
                // Save this.$el for convenience
                this.$el = $(this.el);
                // Add a css selector class
                this.$el.addClass('network_telemetry_map');
                //generate random string to avoid same class name when mulitple chart is used in the same dashboard
                if (!this.randStr) {
                    this.randStr = Math.random().toString(36).substring(2, 7);
                }
            },

            getInitialDataParams: function () {
                return ({
                    outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
                    count: 50000
                });
            },

            formatData: function (data, config) {
                return data;
            },

            getConfig: function (property, config) {
                return SplunkVisualizationUtils.escapeHtml(config[this.getPropertyNamespaceInfo().propertyNamespace + property]);
            },

            updateView: function (data, config) {
                var that = this;

                this.$el.empty();
                if (this.map) {
                    this.map.remove()
                }

                function getNode(name, props) {
                    var ele = document.createElementNS("http://www.w3.org/2000/svg", name);
                    for (var key in props) {
                        ele.setAttributeNS(null, key, props[key]);
                    }
                    return ele
                }

                function addArrowHeadDef() {
                    // Add arrowhead definition once after something is drawn on map
                    var svg = $(".network_telemetry_map svg");

                    var defs = getNode("defs", {});
                    var marker = getNode("marker", { id: "arrowhead", orient: "auto", markerWidth: "25", markerHeight: "40", refX: "0.1", refY: "2" });
                    var path = getNode("path", { d: "M0,0 V4 L2,2 Z", fill: "black" });
                    marker.appendChild(path);
                    defs.appendChild(marker);
                    svg.append(defs);
                }

                function unescape(raw_string) {
                    return raw_string.replaceAll("&lt;", '<').replaceAll("&gt;", '>').replaceAll("&quot;", '"').replaceAll("&apos;", '`').replaceAll("&amp;", '&');
                }

                const sanitize = SplunkVisualizationUtils.escapeHtml;

                const url = '/splunkd/__raw/services/mbtiles/splunk-tiles/{z}/{x}/{y}';
                const lat = this.getConfig("mapLatitude", config) || 30;
                const lon = this.getConfig("mapLongitude", config) || 0;
                const zoom = this.getConfig("mapZoom", config) || 2;

                var map = this.map = L.map(this.el).setView([lat, lon], zoom);
                L.tileLayer(url).addTo(map);


                var dataRows = data.rows;
                if (!dataRows || dataRows.length === 0 || dataRows[0].length === 0) {
                    return this;
                }

                var dataFields = data.fields;
                for (i = 0; i < dataFields.length; i++) {
                    switch (dataFields[i].name) {
                        case "start_lat":
                            var start_lat_idx = i;
                            break;
                        case "start_lon":
                            var start_lon_idx = i;
                            break;
                        case "start_label":
                            var start_label_idx = i;
                            break;
                        case "end_lat":
                            var end_lat_idx = i;
                            break;
                        case "end_lon":
                            var end_lon_idx = i;
                            break;
                        case "end_label":
                            var end_label_idx = i;
                            break;
                        case "color":
                            var color_idx = i;
                            break;
                        case "weight":
                            var weight_idx = i;
                            break;
                    }
                }
                const defaultColor = this.getConfig("defaultColor", config) || "#0000FF";
                const defaultWeight = this.getConfig("defaultWeight", config) || 3;

                var formattedData = dataRows.map(function (data) {
                    var start_lat = parseFloat(data[start_lat_idx]);
                    var start_lon = parseFloat(data[start_lon_idx]);
                    var start_label = sanitize(data[start_label_idx]);
                    var end_lat = parseFloat(data[end_lat_idx]);
                    var end_lon = parseFloat(data[end_lon_idx]);
                    var end_label = sanitize(data[end_label_idx]);
                    var color = sanitize(data[color_idx]);
                    var weight = sanitize(data[weight_idx]);

                    if (!color) { color = defaultColor; }
                    if (!weight) { weight = defaultWeight; }

                    return { "from": [start_lat, start_lon], "to": [end_lat, end_lon], "color": color, "weight": weight, labels: [start_label, end_label] }
                });

                let isArrowHeadDefAdded = false;

                const drilldownTimeRangeToken = sanitize(this.getConfig("drilldownTimeRangeToken", config));
                // Need to replace special characters two times in order to unescape properly 
                const drilldownQuery = unescape(unescape(sanitize(this.getConfig("drilldownQuery", config))));

                const drilldownTokenName = sanitize(this.getConfig("drilldownTokenName", config));
                // Need to replace special characters two times in order to unescape properly 
                const drilldownTokenValue = unescape(unescape(sanitize(this.getConfig("drilldownTokenValue", config))));

                formattedData.forEach(function (data, index) {
                    var startX = data.from[0];
                    var startY = data.from[1];
                    var endX = data.to[0];
                    var endY = data.to[1];

                    if (Number.isNaN(startX) || Number.isNaN(startY) || Number.isNaN(endX) || Number.isNaN(endY)) {
                        console.log("Invalid lat lon");
                        return;
                    }

                    var xx = (startX + endX) / 2
                    var yy = (startY + endY) / 2
                    var ll = Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2));
                    cc = [xx + ll * 0.20, yy]

                    let classname = that.randStr + "-trafficpath" + index.toString();

                    var path = L.curve(['M', data.from, 'Q', cc, data.to],
                        { weight: data.weight, color: data.color, fill: false, className: classname }).addTo(map);

                    if (!isArrowHeadDefAdded) {
                        // Add arrowhead definition once after something is drawn on map
                        addArrowHeadDef()
                        isArrowHeadDefAdded = true;
                    }

                    const search_condition = ` | search start_lat=${data.from[0]} start_lon=${data.from[1]} end_lat=${data.to[0]} end_lon=${data.to[1]}`;

                    $("." + classname).attr("marker-end", 'url(#arrowhead)');

                    if (drilldownTimeRangeToken && drilldownQuery) {
                        $("." + classname).click(function () {
                            const tokens = mvc.Components.get("default");
                            const earliest = tokens.get(drilldownTimeRangeToken + ".earliest");
                            const latest = tokens.get(drilldownTimeRangeToken + ".latest");

                            const url = 'search?earliest=' + encodeURIComponent(earliest) + '&latest=' + encodeURIComponent(latest) + '&q=' + encodeURIComponent(drilldownQuery + search_condition);
                            window.open(url);
                        });
                    }

                    if (drilldownTokenName && drilldownTokenValue) {
                        $("." + classname).click(function () {
                            // Need to set both default and submitted token to make it work
                            const defaultTokens = mvc.Components.getInstance('default');
                            const submittedTokens = mvc.Components.getInstance('submitted');
                            defaultTokens.set(drilldownTokenName, drilldownTokenValue + search_condition);
                            submittedTokens.set(drilldownTokenName, drilldownTokenValue + search_condition);
                        });
                    }
                })
            }
        });
    });
