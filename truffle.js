module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache:{
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    development:{

        host: "localhost",
        port: 9545,
        network_id: "5777"
    }
  }
};
