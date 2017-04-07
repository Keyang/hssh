module.exports = {
  setup: function (pro) {
    pro.arguments("<url>");
  },
  result: function (pro) {
    return {
      rows: process.stdout.rows,
      cols: process.stdout.columns
    };
  }
}