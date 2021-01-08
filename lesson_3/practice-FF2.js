// Q5

// factory function for invoices
function createInvoice(services = {}) {
  return {
    fon: services.fon >= 0 ? services.fon : 3000,
    net: services.net >= 0 ? services.net : 5500,
    paid: 0,

    addPmt(pmt) { this.paid += pmt.total(); },
    addPmts(pmts = []) {
      // arrow functions keep their original context
      pmts.forEach(pmt => this.addPmt(pmt));
    },

    total() {
      return this.fon + this.net;
    },

    amtDue() {
      return this.total() - this.paid;
    }
  }
}

// factory function for payments
function createPayment(services = {}) {
  return {
    fon: services.fon || 0,
    net: services.net || 0,
    amt: services.amt,

    total() {
      return this.amt || this.fon + this.net;
    }
  }
}

let invoice = createInvoice({ fon: 1200, net: 4000 });

let pmt1 = createPayment({ amt: 2000 });
let pmt2 = createPayment({ fon: 1000, net: 1200 });
let pmt3 = createPayment({ fon: 1000 });

invoice.addPmts([pmt1, pmt2, pmt3]);
console.log(invoice.amtDue());
