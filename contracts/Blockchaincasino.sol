pragma solidity ^0.4.23;

import "./Bank.sol";
contract Blockchaincasino is Bank
{

//inialized variables holds the value of the bets
uint public winnings;
uint public betsplaced;
uint i;
uint[2] redblack = [0];
uint[2] evenodd = [0];
uint[2] lowhigh = [0];
uint[3] dozens = [0];
uint[3] columns = [0];
uint[11] six = [0];
uint[22] four = [0];
uint[12] three = [0];
uint[56] two = [0];
uint[38] single = [0];
//fournum,threenums, twonums, straight
uint[18] red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
uint[18] black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Bank object for calling bank functions and variables
Bank public Bankobj;
//accepts the address to the bank smart contract
constructor(address bankaddress) public{
  //inialies the bank object
  Bankobj = Bank(bankaddress);
}
//removes all the winnings of the player
//only if we can pay them
function ClearWinnings() public {
  require(Bankobj.balance >= (winnings * 10**18));
  winnings = 0;
}
//keeps track of the bet placed so we can access it later when we play the playgame
//param 1 amount of chips bet; param 2 type of bet ex,black; param 3 array possition that the button presses is
//associated with
  function setbet(uint _money, string bet, uint number) public returns (uint)
  {
        if((keccak256(bet) == keccak256("red")))
        {

          redblack[0] += _money;
          Bankobj.AdjustChips(_money);
          betsplaced += _money;
        }else if( (keccak256(bet) == keccak256("black")))
        {
          redblack[1] += _money;
          Bankobj.AdjustChips(_money);
          betsplaced += _money;
        }else if((keccak256(bet) == keccak256("even")))
        {
            evenodd[0] += _money;
          Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }else if((keccak256(bet) == keccak256("odd"))){
          evenodd[1] += _money;
          Bankobj.AdjustChips(_money);
          betsplaced += _money;
        }else if((keccak256(bet) == keccak256("low")))
        {
            lowhigh[0] += _money;
            Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }else if((keccak256(bet) == keccak256("high")))
        {
          lowhigh[1] = _money;
          Bankobj.AdjustChips(_money);
          betsplaced += _money;
        }else if((keccak256(bet) == keccak256("dozens")))
        {
          dozens[number] += _money;
          Bankobj.AdjustChips(_money);
          betsplaced += _money;
        }else if((keccak256(bet) == keccak256("columns")))
        {
            columns[number] += _money;
          Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }else if((keccak256(bet) == keccak256("sixnum")))
        {
            six[number] += _money;
          Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }
        else if((keccak256(bet) == keccak256("fournum")))
        {
            four[number] += _money;
          Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }else if((keccak256(bet) == keccak256("threenums")))
        {
            three[number] += _money;
          Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }else if((keccak256(bet) == keccak256("twonums")))
        {
            two[number] += _money;
          Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }else if((keccak256(bet) == keccak256("single")))
        {
            single[number] += _money;
          Bankobj.AdjustChips(_money);
            betsplaced += _money;
        }

  }
  //gets a value from an array that holds onto the betsplaced
  //this function is called to check every bet position if the
  //winning number can be there
  //Ex, function is calle if the number is a red number and does the firset if statement
  //param1 the type of bet param2 the array position of the bet type
  function getbet(string bet, uint number) public returns (uint)
  {
    if((keccak256(bet) == keccak256("red")))
    {
    return redblack[0] * 2 ;
    }else if( (keccak256(bet) == keccak256("black")))
    {
    return redblack[1] * 2;
    }else if((keccak256(bet) == keccak256("even")))
    {
    return evenodd[0] * 2;
    }else if((keccak256(bet) == keccak256("odd")))
    {
    return evenodd[1] * 2;
    }else if((keccak256(bet) == keccak256("low")))
    {
    return lowhigh[0] * 2;
    }else if((keccak256(bet) == keccak256("high")))
    {
    return lowhigh[1] * 2;
    }else if((keccak256(bet) == keccak256("dozens")))
    {
    return ( (dozens[number] * 2) + dozens[number]);
    }else if((keccak256(bet) == keccak256("columns")))
    {
    return ( (columns[number] * 2) + columns[number]);
    }else if((keccak256(bet) == keccak256("sixnum")))
    {
    return ( (six[number] * 5) + six[number]);
    }
    else if((keccak256(bet) == keccak256("fournum")))
    {
    return ( (four[number] * 8) + four[number]);
    }else if((keccak256(bet) == keccak256("threenums")))
    {
    return ( (three[number] * 11) + three[number]);
    }else if((keccak256(bet) == keccak256("twonums")))
    {
    return ( (two[number] * 17) + two[number]);
    }else if((keccak256(bet) == keccak256("single")))
    {
    return ( (single[number] * 35) + single[number]);
    }
    }
//searches to see if the drawn number has any bets placed on it
//param1 draw: is the number the ball lands on
//sets the winnings if the number drawn belongs to that possition
//then sets the set bet arrays to zzero
    function play(uint draw) public returns (uint)
    {

      betsplaced = 0;
      if(draw != 0 && draw != 37){
      //red or black
      for(i = 0; i < 18; i++)
      {
        if(draw == red[i] ){
          winnings += getbet("red",0);
          break;
        }else if(draw == black[i]){
          winnings+= getbet("black",1);
          break;
      }
    }
      //even odds
      if(draw%2 == 0){
        winnings += getbet("even", 0);
      }else{
        winnings += getbet("odd",1);
      }

      //high low
      if(draw > 18){
        winnings+= getbet("high",1);
      }
      else{
        winnings+= getbet("low",0);
      }

      //dozens
      if(draw >= 1 && draw <= 12){
        winnings+= getbet("dozens",0);
      }else if(draw >= 13 && draw <= 24){
        winnings+= getbet("dozens",1);
      }else if(draw > 25){
        winnings+= getbet("dozens",2);
      }

      //columns
      // if you place a bet on the third column
      if( (draw % 3) == 0)
      {
        winnings+= getbet("columns",0);
      }//second column
      else if( ((draw + 1)%3) == 0){
        winnings += getbet("columns",1);
      }//first column
      else if( ((draw +2)%3) == 0){
        winnings += getbet("columns", 2);
      }

//bet six numbers
            if(draw >= 1 && draw <=6){
              winnings+= getbet("sixnum",0);
            }if(draw >=4 && draw <=9){
              winnings+= getbet("sixnum",1);
            }if(draw >=7 && draw <=12){
              winnings+= getbet("sixnum",2);
            }if(draw >=10 && draw <=15){
              winnings+= getbet("sixnum",3);
            }if(draw >=13 && draw <=18){
              winnings+= getbet("sixnum",4);
            }if(draw >=16 && draw <=21){
              winnings+= getbet("sixnum",5);
            }if(draw >=19 && draw <=24){
              winnings+= getbet("sixnum",6);
            }if(draw >=22 && draw <=27){
              winnings+= getbet("sixnum",7);
            }if(draw >=25 && draw <=30){
              winnings+= getbet("sixnum",8);
            }if(draw >=28 && draw <=33){
              winnings+= getbet("sixnum",9);
            }if(draw >=31 && draw <=36){
              winnings+= getbet("sixnum",10);
            }

      //fournum 1,2,5,4 ; 4,5,8,7
      for(i = 1; i<=31; i+=3){
        if( (draw == i) || (draw == (i+1)) || (draw == (i+3)) || (draw == (i+4)) )
        {
        winnings += getbet("fournum", ((i+2)/3)-1);
        }
      }
      //2,5,6,9; 5,8,9,6
      for(i = 2; i<=32; i+=3){
        if( (draw == i) || (draw == (i+1)) || (draw == (i+3)) || (draw == (i+4)))
        {
        winnings += getbet("fournum", ((i+1)/3)+10);
        }
      }

      // three numbers 1,2,3 ; 4,5,6
      for(i = 1; i<34;i+=3){
        if(draw >= i && draw <= i+2){
          winnings += getbet("threenums", ((i+2)/3)-1);
        }
      }


      //two numbers for vertical betting on the first vertical lines ie 1,2;4,5;
      for(i = 1; i<=34; i+=3){
        if( (draw == i) || (draw == (i+1)) )
        {
            winnings += getbet("twonums", ( ((i+2)/3) -1) );
        }
      }
      //two numbers for vertical betting on the second vertical line 2,3; 5,6
      for(i = 2; i<=35; i+=3){
        if( (draw == i) || (draw == (i+1)) )
        {
            winnings += getbet("twonums", (((i+1)/3) + 11) );
        }
      }
      //two numbers for horizontal betting on the first column horizontal lines
      // bets like 1,4; 7,10;

      for(i = 1; i<=31; i+=3){
        if ( (draw == i) || (draw ==(i+3)) )
        {
            winnings += getbet("twonums", (((i+2)/3) + 23) );
        }
      }
      //second horizontal line 2,5; 5,8
      for(i = 2; i<=32; i+=3){
        if( (draw == i) || (draw == (i+3)) )
        {
            winnings += getbet("twonums", (((i+1)/3) + 34) );
        }
      }
      //third horizontal line 3,6; 6,9
      for(i = 3; i<=33; i+=3){
        if( (draw == i) || (draw == (i+3)) )
        {
            winnings += getbet("twonums", ( (i/3) + 45) );
        }
      }




}
      //single
      //for drawing a 00
        winnings += getbet("single", draw);

//sets all arrays to zero so we don't win based on old bets
      for(i = 0; i <56; i++)
      {
        if(i<2){
          redblack[i] = 0;
          evenodd[i] = 0;
          lowhigh[i] = 0;
        }if(i<3){
          dozens[i] = 0;
          columns[i] = 0;
        }if(i< 11){
          six[i] = 0;
        }if(i< 22){
          four[i] = 0;
        }if(i< 12){
          three[i] = 0;
        }if(i< 56){
          two[i] = 0;
        }if(i< 38){
          single[i] = 0;
        }
      }

    }


}
