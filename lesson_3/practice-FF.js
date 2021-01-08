// Qs 3 & 4

// factory function for invoices
function createInvoice(services = {}) {
  return {
    fon: services.fon >= 0 ? services.fon : 3000,
    net: services.net >= 0 ? services.net : 5500,

    total() {
      return this.fon + this.net;
    }
  }
}

let invoices = [];
invoices.push(createInvoice());
invoices.push(createInvoice({ net: 6500 }));
invoices.push(createInvoice({ fon: 2000 }));
invoices.push(createInvoice({ fon: 1000, net: 4500 }));

function invoiceTotal(invoices) {
    let total = 0;
    for (let i = 0; i < invoices.length; i += 1) {
      total += invoices[i].total();
    }
    return total;
}
// console.log(invoiceTotal(invoices));

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

let payments = [];
payments.push(createPayment());
payments.push(createPayment({ net: 6500 }));
payments.push(createPayment({ fon: 2000 }));
payments.push(createPayment({ fon: 1000, net: 4500 }));
payments.push(createPayment({ amt: 10000 }));

function paymentTotal(payments) {
  return payments.reduce((sum, pmt) => sum + pmt.total(), 0);
}
console.log(paymentTotal(payments));
