$(document).ready(function() {
    var sqlizer = new Vue({
        el: '#sqlizer',
        data: {
            sintaks: '',
            dtRaw: '',
            dtXml: '',
            dtJson: '',
            info: ''
        },
        methods: {
            funcProses: function () {
                $('.ui.dimmer').slideDown(200).addClass('active');
                setTimeout(function () {
                    $.post('/api/sqlizer/proses', sqlizer.sintaks, function(data) {
                        $('#tabel').children('table').remove();
                        $('#dlJSON').children('a').remove();
                        $('#dlXML').children('a').remove();
                        sqlizer.dtXml = data.xml;
                        sqlizer.dtJson = data.dt;
                        sqlizer.dtRaw = JSON.stringify(data.dt,null,6);
                        $('#tabel').append(buildHtmlTable(data.dt));
                        $('table').addClass('ui green inverted striped celled table');
                        sqlizer.funcXML();
                        sqlizer.funcJSON();
                        setTimeout(function () {
                            $('.ui.dimmer').slideUp(400, function () {
                                $('.ui.dimmer').removeClass('active');
                            })
                        }, 2000);
                    });
                }, 1000);
            },
            funcJSON: function () {
                var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sqlizer.dtJson,null,6));

                var btnJSON = document.createElement('a');
                btnJSON.href = 'data:' + data;
                btnJSON.download = 'SQLizer(Surya-PW).json';
                btnJSON.innerHTML = 'Download (JSON)';
                btnJSON.setAttribute('class','ui right floated button green');

                var divJSON = document.getElementById('dlJSON');
                divJSON.appendChild(btnJSON);

            },
            funcXML: function () {
                var data = "text/xml;charset=utf-8," + encodeURIComponent(sqlizer.dtXml);

                var btnXML = document.createElement('a');
                btnXML.href = 'data:' + data;
                btnXML.download = 'SQLizer(Surya-PW).xml';
                btnXML.innerHTML = 'Download (XML)';
                btnXML.setAttribute('class','ui button green');

                var divXML = document.getElementById('dlXML');
                divXML.appendChild(btnXML);
            }
        }
    });

    var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

    function buildHtmlTable(arr) {
        var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
        for (var i=0, maxi=arr.length; i < maxi; ++i) {
            var tr = _tr_.cloneNode(false);
            for (var j=0, maxj=columns.length; j < maxj ; ++j) {
                var td = _td_.cloneNode(false);
                cellValue = arr[i][columns[j]];
                td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    }

    function addAllColumnHeaders(arr, table)
    {
        var columnSet = [],
        tr = _tr_.cloneNode(false);
        for (var i=0, l=arr.length; i < l; i++) {
            for (var key in arr[i]) {
                if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                    columnSet.push(key);
                    var th = _th_.cloneNode(false);
                    th.appendChild(document.createTextNode(key));
                    tr.appendChild(th);
                }
            }
        }
        table.appendChild(tr);
        return columnSet;
    }
});
