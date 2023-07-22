const mongoose = require("mongoose");
const DueDate = require("./DueDate");

function GetCloseDate1(date) {
  const dueDate15 = new Date(date.getFullYear(), date.getMonth(), 15);
  const dueDate30 = new Date(date.getFullYear(), date.getMonth(), 30);

  const diff15 = dueDate15.getDate() - date.getDate();
  const diff30 = dueDate30.getDate() - date.getDate();

  if (
    diff15 >= -4 &&
    (diff15 <= 0) | (date.getDate() >= 11 && date.getDate() <= 15)
  ) {
    return 15; // Date is within 4 days before the 15th
  } else if (
    (diff30 >= -4 && diff30 <= 0) ||
    (date.getDate() >= 26 && date.getDate() <= 30)
  ) {
    return 30; // Date is within 4 days before the 30th
  }

  return false; // Date is not within the specified range
}

function GetCloseDate2(date) {
  const dueDate15 = new Date(date.getFullYear(), date.getMonth(), 10);
  const dueDate30 = new Date(date.getFullYear(), date.getMonth(), 25);

  const diff15 = dueDate15.getDate() - date.getDate();
  const diff30 = dueDate30.getDate() - date.getDate();

  if (
    diff15 >= -4 &&
    (diff15 <= 0) | (date.getDate() >= 6 && date.getDate() <= 10)
  ) {
    return 10; // Date is within 4 days before the 10th
  } else if (
    (diff30 >= -4 && diff30 <= 0) ||
    (date.getDate() >= 21 && date.getDate() <= 25)
  ) {
    return 25; // Date is within 4 days before the 25th
  }

  return false; // Date is not within the specified range
}

const contractSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  lendingType: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  amountToPay: {
    type: Number,
    require: true,
  },
  payMethod: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    require: true,
  },
  letter: {
    type: String,
    require: true,
  },
  proof: {
    type: String,
    require: true,
  },
  dateLended: {
    type: Date,
    default: Date.now(),
  },
  finalDate: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
  },
  dueDateGenerated: {
    type: Boolean,
    default: false,
  },
});

contractSchema.post("save", async function (doc) {
  if (!doc.dueDateGenerated) {
    doc.dueDateGenerated = true;

    // Calculate the total amount to pay for
    const amount = doc.amount + doc.amount * 0.2;
    let numOfPayments = 1,
      set = 0;
    let toPay = amount;

    // Calculate due dates
    if (doc.payMethod === 1) {
      numOfPayments = 30;
      toPay = amount / 30;
    } else if (doc.payMethod === 2) {
      numOfPayments = 4;
      toPay = amount / 4;
    } else if (doc.payMethod === 3 || doc.payMethod === 4) {
      numOfPayments = 2;
      toPay = amount / 2;
    }

    //Create the Due Dates
    for (let i = 1; i <= numOfPayments; i++) {
      const dateLended = new Date(doc.dateLended); //Date Lended
      if (doc.payMethod === 1) {
        dateLended.setDate(dateLended.getDate() + i);
      } else if (doc.payMethod === 2) {
        dateLended.setDate(dateLended.getDate() + i * 7);
      } else if (doc.payMethod === 3) {
        //Close to 15
        if (GetCloseDate1(dateLended) === 15 && set === 0) {
          dateLended.setDate(30);
          set = 1;
        } else if (GetCloseDate1(dateLended) === 15 && set === 1) {
          dateLended.setMonth(dateLended.getMonth() + 1, 15);
          //Close to 30
        } else if (GetCloseDate1(dateLended) === 30 && set === 0) {
          dateLended.setMonth(dateLended.getMonth() + 1, 15);
          set = 1;
        } else if (GetCloseDate1(dateLended) === 30 && set === 1) {
          dateLended.setMonth(dateLended.getMonth() + 1, 30);
          //Not close to 30
        } else if (
          GetCloseDate1(dateLended) === false &&
          set === 0 &&
          dateLended.getDate() < 30 &&
          dateLended.getDate() > 15
        ) {
          dateLended.setDate(30);
          set = 1;
        } else if (
          GetCloseDate1(dateLended) === false &&
          set === 1 &&
          dateLended.getDate() < 30 &&
          dateLended.getDate() > 15
        ) {
          dateLended.setMonth(dateLended.getMonth() + 1, 15);
          //Not close to 15
        } else if (
          GetCloseDate1(dateLended) === false &&
          set === 0 &&
          dateLended.getDate() < 15
        ) {
          dateLended.setDate(15);
          set = 1;
        } else if (
          GetCloseDate1(dateLended) === false &&
          set === 1 &&
          dateLended.getDate() < 15
        ) {
          dateLended.setDate(30);
        }
      } else if (doc.payMethod === 4) {
        if (GetCloseDate2(dateLended) === 10 && set === 0) {
          dateLended.setDate(25);
          set = 1;
        } else if (GetCloseDate2(dateLended) === 10 && set === 1) {
          dateLended.setMonth(dateLended.getMonth() + 1, 10);
        } else if (GetCloseDate2(dateLended) === 25 && set === 0) {
          dateLended.setMonth(dateLended.getMonth() + 1, 10);
          set = 1;
        } else if (GetCloseDate2(dateLended) === 25 && set === 1) {
          dateLended.setMonth(dateLended.getMonth() + 1, 25);
        } else if (
          !GetCloseDate2(dateLended) &&
          set === 0 &&
          dateLended.getDate() < 25 &&
          dateLended.getDate() > 10
        ) {
          dateLended.setDate(25);
          set = 1;
        } else if (
          !GetCloseDate2(dateLended) &&
          set === 1 &&
          dateLended.getDate() < 25 &&
          dateLended.getDate() > 10
        ) {
          dateLended.setMonth(dateLended.getMonth() + 1, 10);
        } else if (
          !GetCloseDate2(dateLended) &&
          set === 0 &&
          dateLended.getDate() < 10
        ) {
          dateLended.setDate(10);
          set = 1;
        } else if (
          !GetCloseDate2(dateLended) &&
          set === 1 &&
          dateLended.getDate() < 10
        ) {
          dateLended.setDate(25);
        }
      } else if (doc.payMethod === 5) {
        dateLended.setDate(dateLended.getDate() + 30);
      }

      //Setting the fjnal date for completion
      if (i === numOfPayments) {
        doc.finalDate = dateLended;
        doc.amountToPay = amount;
      }

      // Create due date
      const dueDateDocument = new DueDate({
        username: doc.username,
        amountToPay: toPay,
        payMethod: doc.payMethod,
        dueDate: dateLended,
        status: 0,
        contractID: doc._id,
      });

      // Save the due date document
      await dueDateDocument.save();
    }
    await doc.save();
  }
});

module.exports = mongoose.model("Contract", contractSchema);
