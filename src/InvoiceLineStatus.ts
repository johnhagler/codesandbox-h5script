class InvoiceLineStatus {
  private controller: IInstanceController;
  private args: string;
  private top: number = 4;
  private left: number = 40;

  static DESCRIPTIONS = {
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

  constructor(scriptArgs: IScriptArgs) {
    this.controller = scriptArgs.controller;
    this.args = scriptArgs.args;

    const startingPosition = this.args.split(",");
    if (startingPosition.length == 2) {
      this.top = Number(startingPosition[0]);
      this.left = Number(startingPosition[1]);
    }
  }

  public static Init(args: IScriptArgs): void {
    new InvoiceLineStatus(args).run();
  }

  private run(): void {
    this.addUI();

    this.controller.GetGrid().onSelectedRowsChanged.subscribe(() => {
      this.updateUI();
    });
    this.updateUI();
  }

  private updateUI(): void {
    const rows = this.getSelectedRows();
    if (rows.length > 0) {
      this.showLineStatus(rows[0]);
    } else {
      this.showLowestStatus();
    }
  }

  private updateValues(status: LineStatus): void {
    this.controller.SetValue("LNQT", status.lineQuantity);
    this.controller.SetValue("LNPR", status.linePrice);
    this.controller.SetValue("CHQT", status.chargeQuantity);
    this.controller.SetValue("CHPR", status.chargePrice);
    this.controller.SetValue("ACCT", status.accountingEntries);
  }

  private getSelectedRows(): any[] {
    const grid = this.controller.GetGrid();

    const columns = grid.getColumns().reduce((acc, cur) => {
      acc[cur.colFld] = cur.id;
      return acc;
    });
    return grid.getSelectedRows().map((idx) => {
      //@ts-ignore
      const item = grid.getDataItem(idx);
      return Object.keys(columns).reduce((acc, cur) => {
        acc[cur] = item[columns[cur]];
        return acc;
      }, {});
    });
  }

  private showLowestStatus() {
    const statusStr = this.controller.GetValue("WWINS0");
    const status = this.parseStatus(statusStr);
    this.updateValues(status);
  }

  private showLineStatus(row: any): void {
    const statusStr = row["&INSX"];
    const status = this.parseStatus(statusStr);
    this.updateValues(status);
  }

  private parseStatus(status: string): LineStatus {
    return {
      lineQuantity: InvoiceLineStatus.DESCRIPTIONS.lineQuantity[status[0]],
      linePrice: InvoiceLineStatus.DESCRIPTIONS.linePrice[status[1]],
      chargeQuantity: InvoiceLineStatus.DESCRIPTIONS.chargeQuantity[status[2]],
      chargePrice: InvoiceLineStatus.DESCRIPTIONS.chargePrice[status[3]],
      accountingEntries:
        InvoiceLineStatus.DESCRIPTIONS.accountingEntries[status[4]]
    };
  }

  private addUI(): void {
    this.addHeader();
    this.addLineQty();
    this.addLinePrc();
    this.addChgQty();
    this.addChgPrc();
    this.addAccEnt();
  }

  private addHeader() {
    const lbl = new LabelElement();
    lbl.Value = "Invoice Line Status";
    lbl.Position = new PositionElement();
    lbl.IsEmphasized = true;
    lbl.Position.Top = this.top;
    lbl.Position.Left = this.left;
    this.controller.GetContentElement().AddElement(lbl);
  }

  private addLineQty() {
    const lbl = new LabelElement();
    lbl.Value = "Line qty";
    lbl.Position = new PositionElement();
    lbl.Position.Top = this.top + 1;
    lbl.Position.Left = this.left;
    this.controller.GetContentElement().AddElement(lbl);

    const txt = new TextBoxElement();
    txt.Name = "LNQT";
    txt.Value = "";
    txt.IsEnabled = false;
    txt.Position = new PositionElement();
    txt.Position.Top = this.top + 1;
    txt.Position.Left = this.left + 10;
    txt.Position.Width = 20;
    this.controller.GetContentElement().AddElement(txt);
  }

  private addLinePrc() {
    const lbl = new LabelElement();
    lbl.Value = "Line prc";
    lbl.Position = new PositionElement();
    lbl.Position.Top = this.top + 2;
    lbl.Position.Left = this.left;
    this.controller.GetContentElement().AddElement(lbl);

    const txt = new TextBoxElement();
    txt.Name = "LNPR";
    txt.Value = "";
    txt.IsEnabled = false;
    txt.Position = new PositionElement();
    txt.Position.Top = this.top + 2;
    txt.Position.Left = this.left + 10;
    txt.Position.Width = 20;
    this.controller.GetContentElement().AddElement(txt);
  }

  private addChgQty() {
    const lbl = new LabelElement();
    lbl.Value = "Chg qty";
    lbl.Position = new PositionElement();
    lbl.Position.Top = this.top + 3;
    lbl.Position.Left = this.left;
    this.controller.GetContentElement().AddElement(lbl);

    const txt = new TextBoxElement();
    txt.Name = "CHQT";
    txt.Value = "";
    txt.IsEnabled = false;
    txt.Position = new PositionElement();
    txt.Position.Top = this.top + 3;
    txt.Position.Left = this.left + 10;
    txt.Position.Width = 20;
    this.controller.GetContentElement().AddElement(txt);
  }
  private addChgPrc() {
    const lbl = new LabelElement();
    lbl.Value = "Chg prc";
    lbl.Position = new PositionElement();
    lbl.Position.Top = this.top + 4;
    lbl.Position.Left = this.left;
    this.controller.GetContentElement().AddElement(lbl);

    const txt = new TextBoxElement();
    txt.Name = "CHPR";
    txt.Value = "";
    txt.IsEnabled = false;
    txt.Position = new PositionElement();
    txt.Position.Top = this.top + 4;
    txt.Position.Left = this.left + 10;
    txt.Position.Width = 20;
    this.controller.GetContentElement().AddElement(txt);
  }
  private addAccEnt() {
    const lbl = new LabelElement();
    lbl.Value = "Acct Ent";
    lbl.Position = new PositionElement();
    lbl.Position.Top = this.top + 5;
    lbl.Position.Left = this.left;
    this.controller.GetContentElement().AddElement(lbl);

    const txt = new TextBoxElement();
    txt.Name = "ACCT";
    txt.Value = "";
    txt.IsEnabled = false;
    txt.Position = new PositionElement();
    txt.Position.Top = this.top + 5;
    txt.Position.Left = this.left + 10;
    txt.Position.Width = 20;
    this.controller.GetContentElement().AddElement(txt);
  }
}

interface LineStatus {
  lineQuantity: string;
  linePrice: string;
  chargeQuantity: string;
  chargePrice: string;
  accountingEntries: string;
}
