App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,


  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined') {
      //so we are going to reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //we are going to create a new provider and plug it directly into our local node
      // this is the strategy recommended by Metamask to initialize web3.
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    // then we may initialize web3 object with whatever provider we get before.
    web3 = new Web3(App.web3Provider);
    // then, we called function in oder to display account information (account address and Balance).
    // At this point, we have not defined this function, but we will do it in a moment.

    App.displayAccountInfo();   // this function need to define delow.

    return App.initContract();
  },


    displayAccountInfo: function() {
      // following code will retrive the main account.
      // call back function takes two arguments: error & account. It is asynchronous function.
      web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
          App.account = account;
          $('#account').text(account);
          web3.eth.getBalance(account, function(err, balance) {
            if(err === null) {
              $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
            }
          })
        }
      });
    },

  initContract: function() {
    $.getJSON('Blockchaincasino.json', function(bookstoreArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.Bookstore = TruffleContract(bookstoreArtifact);
      // set the provider for our contracts
      App.contracts.Bookstore.setProvider(App.web3Provider);
      // retrieve the article from the contract
      return App.reloadArticles();  // this function need to define delow.
    });
  },

   // following is code implementation of above function.
   // also, make sure to visit "index.html" file and remove
   // hard code of balance and account information.
  reloadArticles: function() {
    // refresh account information because the balance might have changed
    //
   // first thing we do refresh account information because balance might have changed.
   // so every time we will call realoadArticles, will also refresh the account balance and account address.
   // Therefore, call following functions.
  App.displayAccountInfo();

    // retrieve the article placeholder and clear it in order to make sure that information is clean.
    // we are doing it with JQuery using articles row.
    $('#articlesRow').empty();

   // since we already saved reference to our Truffle contract artifacts, we just need to
   // deployed instance of it. Like we did it before. Here the "Bookstore" object is contract abstraction.
   // Therefore, it has a deployed() function. Then, we get instance of it in a call back function(instance).
   // Since it is asynchronous, so we can chain with another "then" promise with function(article)
   //
   // Then, there are two possibility either article initialized ot not initialized.
   //
    App.contracts.Bookstore.deployed().then(function(instance) {
      return instance.getArticle();
    }).then(function(article) {
      if(article[0] == 0x0) {
        // There is no article to display. so simply return.
        return;
      }
      // we retrive article template and fill it with data.
      var articleTemplate = $('#articleTemplate');
      articleTemplate.find('.panel-title').text(article[1]);
      articleTemplate.find('.article-description').text(article[2]);
    // since price is in big number, so we need to convert into fromWei to ether.
      articleTemplate.find('.article-price').text(web3.fromWei(article[3], "ether"));

      var seller = article[0];
      // if seller is the connected account
      if (seller == App.account) {
        seller = "You";  // article is sold by yourself.
      }
      // thereafter, we add to the article Template.
      articleTemplate.find('.article-seller').text(seller);

      // Now, we can add this article the articles row. So, again use JQuery.
      // There might be chances of errors, so we have to put "then" with catch exceptions.
      // cath error with call back.
      //
      $('#articlesRow').append(articleTemplate.html());
    }).catch(function(err) {
      console.error(err.message);
    });
  },

  sellArticle: function(){
    var article_name = $('#article_name').val();
    var description = $('#article_description').val();
    var price = web3.toWei(parseFloat($('#article_price').val()|| 0), "ether");
    if((article_name.trim() == '') || (price == 0)){
      return false;
    }
    App.contracts.ChainList.deployed().then(function(instance){
      return instance.sellArticle(article_name, description,price,{
        from: App.account,
        gas:500000
      });
    }).then(function(result){
      App.reloadArticles();
    }).catch(function(err){
      console.error(err);
    });
  },


};
//////////////////////////Module-3 :end
//////////////////////////////////////////////



$(function() {
  $(window).load(function() {
    App.init();
  });
});
