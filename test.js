const passport = require("./src/config/config.passport");
const { User } = require("./src/models/user.model");
const { Recovery } = require("./src/models/recovery.model");
const sendMail = require("./src/utils/sendMail");
const { getBookList } = require("./src/services/book.service");

const addAdmin = async () => {
  await require("./src/dbs/init.mongoose");

  // const info = {
  //   name: "admin-3",
  //   email: "nguyenminhgiabao2501@gmail.com",
  //   gender: "Male",
  //   role: "Admin",
  //   phone: "0123456789",
  //   address: "Ho Chi Minh",
  //   identity: "123456789",
  // };

  setTimeout(async () => {
      // await User.register(info, "123456", (err, user) => {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //   console.log(user);
      // });
      let bookList = await getBookList();
      console.log(bookList);
  }, 15000);
};

addAdmin();