var InvoiceLineStatus = /** @class */ (function () {
    function InvoiceLineStatus(scriptArgs) {
        this.top = 4;
        this.left = 40;
        this.controller = scriptArgs.controller;
        this.args = scriptArgs.args;
        var startingPosition = this.args.split(",");
        if (startingPosition.length == 2) {
            this.top = Number(startingPosition[0]);
            this.left = Number(startingPosition[1]);
        }
    }
    InvoiceLineStatus.Init = function (args) {
        new InvoiceLineStatus(args).run();
    };
    InvoiceLineStatus.prototype.run = function () {
        var _this = this;
        this.addUI();
        this.controller.GetGrid().onSelectedRowsChanged.subscribe(function () {
            _this.updateUI();
        });
        this.updateUI();
    };
    InvoiceLineStatus.prototype.updateUI = function () {
        var rows = this.getSelectedRows();
        if (rows.length > 0) {
            this.showLineStatus(rows[0]);
        }
        else {
            this.showLowestStatus();
        }
    };
    InvoiceLineStatus.prototype.updateValues = function (status) {
        this.controller.SetValue("LNQT", status.lineQuantity);
        this.controller.SetValue("LNPR", status.linePrice);
        this.controller.SetValue("CHQT", status.chargeQuantity);
        this.controller.SetValue("CHPR", status.chargePrice);
        this.controller.SetValue("ACCT", status.accountingEntries);
    };
    InvoiceLineStatus.prototype.getSelectedRows = function () {
        var grid = this.controller.GetGrid();
        var columns = grid.getColumns().reduce(function (acc, cur) {
            acc[cur.colFld] = cur.id;
            return acc;
        });
        return grid.getSelectedRows().map(function (idx) {
            //@ts-ignore
            var item = grid.getDataItem(idx);
            return Object.keys(columns).reduce(function (acc, cur) {
                acc[cur] = item[columns[cur]];
                return acc;
            }, {});
        });
    };
    InvoiceLineStatus.prototype.showLowestStatus = function () {
        var statusStr = this.controller.GetValue("WWINS0");
        var status = this.parseStatus(statusStr);
        this.updateValues(status);
    };
    InvoiceLineStatus.prototype.showLineStatus = function (row) {
        var statusStr = row["&INSX"];
        var status = this.parseStatus(statusStr);
        this.updateValues(status);
    };
    InvoiceLineStatus.prototype.parseStatus = function (status) {
        return {
            lineQuantity: InvoiceLineStatus.DESCRIPTIONS.lineQuantity[status[0]],
            linePrice: InvoiceLineStatus.DESCRIPTIONS.linePrice[status[1]],
            chargeQuantity: InvoiceLineStatus.DESCRIPTIONS.chargeQuantity[status[2]],
            chargePrice: InvoiceLineStatus.DESCRIPTIONS.chargePrice[status[3]],
            accountingEntries: InvoiceLineStatus.DESCRIPTIONS.accountingEntries[status[4]]
        };
    };
    InvoiceLineStatus.prototype.addUI = function () {
        this.addHeader();
        this.addLineQty();
        this.addLinePrc();
        this.addChgQty();
        this.addChgPrc();
        this.addAccEnt();
    };
    InvoiceLineStatus.prototype.addHeader = function () {
        var lbl = new LabelElement();
        lbl.Value = "Invoice Line Status";
        lbl.Position = new PositionElement();
        lbl.IsEmphasized = true;
        lbl.Position.Top = this.top;
        lbl.Position.Left = this.left;
        this.controller.GetContentElement().AddElement(lbl);
    };
    InvoiceLineStatus.prototype.addLineQty = function () {
        var lbl = new LabelElement();
        lbl.Value = "Line qty";
        lbl.Position = new PositionElement();
        lbl.Position.Top = this.top + 1;
        lbl.Position.Left = this.left;
        this.controller.GetContentElement().AddElement(lbl);
        var txt = new TextBoxElement();
        txt.Name = "LNQT";
        txt.Value = "";
        txt.IsEnabled = false;
        txt.Position = new PositionElement();
        txt.Position.Top = this.top + 1;
        txt.Position.Left = this.left + 10;
        txt.Position.Width = 20;
        this.controller.GetContentElement().AddElement(txt);
    };
    InvoiceLineStatus.prototype.addLinePrc = function () {
        var lbl = new LabelElement();
        lbl.Value = "Line prc";
        lbl.Position = new PositionElement();
        lbl.Position.Top = this.top + 2;
        lbl.Position.Left = this.left;
        this.controller.GetContentElement().AddElement(lbl);
        var txt = new TextBoxElement();
        txt.Name = "LNPR";
        txt.Value = "";
        txt.IsEnabled = false;
        txt.Position = new PositionElement();
        txt.Position.Top = this.top + 2;
        txt.Position.Left = this.left + 10;
        txt.Position.Width = 20;
        this.controller.GetContentElement().AddElement(txt);
    };
    InvoiceLineStatus.prototype.addChgQty = function () {
        var lbl = new LabelElement();
        lbl.Value = "Chg qty";
        lbl.Position = new PositionElement();
        lbl.Position.Top = this.top + 3;
        lbl.Position.Left = this.left;
        this.controller.GetContentElement().AddElement(lbl);
        var txt = new TextBoxElement();
        txt.Name = "CHQT";
        txt.Value = "";
        txt.IsEnabled = false;
        txt.Position = new PositionElement();
        txt.Position.Top = this.top + 3;
        txt.Position.Left = this.left + 10;
        txt.Position.Width = 20;
        this.controller.GetContentElement().AddElement(txt);
    };
    InvoiceLineStatus.prototype.addChgPrc = function () {
        var lbl = new LabelElement();
        lbl.Value = "Chg prc";
        lbl.Position = new PositionElement();
        lbl.Position.Top = this.top + 4;
        lbl.Position.Left = this.left;
        this.controller.GetContentElement().AddElement(lbl);
        var txt = new TextBoxElement();
        txt.Name = "CHPR";
        txt.Value = "";
        txt.IsEnabled = false;
        txt.Position = new PositionElement();
        txt.Position.Top = this.top + 4;
        txt.Position.Left = this.left + 10;
        txt.Position.Width = 20;
        this.controller.GetContentElement().AddElement(txt);
    };
    InvoiceLineStatus.prototype.addAccEnt = function () {
        var lbl = new LabelElement();
        lbl.Value = "Acct Ent";
        lbl.Position = new PositionElement();
        lbl.Position.Top = this.top + 5;
        lbl.Position.Left = this.left;
        this.controller.GetContentElement().AddElement(lbl);
        var txt = new TextBoxElement();
        txt.Name = "ACCT";
        txt.Value = "";
        txt.IsEnabled = false;
        txt.Position = new PositionElement();
        txt.Position.Top = this.top + 5;
        txt.Position.Left = this.left + 10;
        txt.Position.Width = 20;
        this.controller.GetContentElement().AddElement(txt);
    };
    InvoiceLineStatus.DESCRIPTIONS = {
        lineQuantity: {
            "0": "0-Not checked",
            "1": "1-Checked, not approved",
            "2": "2-Manually not approved",
            "3": "3-Approved",
            "*": "*-No qty to check"
        },
        linePrice: {
            "0": "0-Not checked",
            "1": "1-Checked, not approved",
            "2": "2-Manually not approved",
            "3": "3-Approved"
        },
        chargeQuantity: {
            "0": "0-Not checked",
            "1": "1-Checked, not approved",
            "2": "2-Manually not approved",
            "3": "3-Approved",
            "*": "*-No qty to check"
        },
        chargePrice: {
            "0": "0-Not checked",
            "1": "1-Checked, not approved",
            "2": "2-Manually not approved",
            "3": "3-Approved"
        },
        accountingEntries: {
            "0": "0-Not created",
            "1": "1-Checked, not correct",
            "2": "2-Created",
            "3": "3-Transferred",
            "4": "4-Updated in GL"
        }
    };
    return InvoiceLineStatus;
}());
//# sourceMappingURL=InvoiceLineStatus.js.map