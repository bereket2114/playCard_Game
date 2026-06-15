
//if(!localStorage.getItem('count')){
    //localStorage.setItem("count", 0)
//}


//document.querySelector('button').addEventListener("click",score)

//function score(){//
   //let anotherOne = Number(localStorage.getItem("count"))
   // anotherOne += 1
   // localStorage.setItem("count",anotherOne)

//}

                  ////////////CARD GAME

 let deckId = ''   

fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
.then(res => res.json())
.then(data => {
    console.log(data)
    deckId = data.deck_id
})
.catch(err => {
    console.log(`error is ${err}.`)
})  

document.querySelector('button').addEventListener('click',game)

function game(){
        let url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            if(data.cards.length === 0){
                let h4 = document.querySelector('.warn')
                h4.innerText = 'Sorry! You are out of cards ⚠! GAME OVER'
                h4.style.color = 'red'
                return;
            }
           
            document.querySelector('#player1').src = data.cards[0].image
            document.querySelector('#player2').src = data.cards[1].image
            
        
            let Player1 = deckHelper(data.cards[0].value)
            let Player2 = deckHelper(data.cards[1].value)

            if(Player1 > Player2){
                document.querySelector('h3').innerText = 'Player 1 win 🏆'
                document.querySelector('h3').style.color = 'yellow';
            }else if (Player1 < Player2){
                document.querySelector('h3').innerText = 'Player 2 win 🏆'
                document.querySelector('h3').style.color = 'yellow';
            }else{      
                document.querySelector('h3').innerText = 'Time for War!🗡'
                document.querySelector('h3').style.color = 'red';
                
            }
        })
        .catch(err =>{
            console.log(`error: ${err}.`)
        })
}
function deckHelper(val){
    if(val === 'ACE'){
        return 14
    }else if(val === 'KING'){
        return 13
    }else if(val === 'QUEEN'){
        return 12
    }else if(val === 'JACK'){
        return 11
    }else{
        return Number(val)
    }
}  




//document.querySelector('button').addEventListener('click',goToWar)
//function goToWar (war){
// let url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
 //fetch(url)
 //.then(res => res.json())
// .then(data => {
   //  console.log(data)
   //  document.querySelector('#player1').src = data.cards[0].image
    // document.querySelector('#player2').src = data.cards[1].image
 //})
 //.catch(err => {
  //  console.log(`Error: ${err}.`)
 //})
//}

/*class playCards{
        constructor(){
            this.Player1 = document.querySelector('#player1')
            this.Player2 = document.querySelector('#player2')
            this.deckId = data.deck_id
            this.h3 = document.querySelector('h3')
            this.button = document.querySelector('button')
            this.button.addEventListener('click', ()=> this.drawCards())

        }
    //////// First we Put How Many Tables Do We Need To Play The Game

        deckOfCards(){   
            this.deckId = ''
            fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.deckId = data.deck_id
            })
            .catch(err => {
                console.log(`error is ${err}.`)
            })
        }
        drawCards(){  
   /////// Then We Draw Cards On the deckId (on our table) To Play & Start The Game

            let url = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=2`
            fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.cards.length === 0){
                    alert('Sorry! You are out of cards ⚠! GAME OVER ')
                    return;
                }
    ///////Show Cards Image From Api

                this.Player1.src = data.cards[0].image
                this.Player2.src = data.cards[1].image
    
    //////Take The Value Of Cards From Api

                let Player1 = deckHelper(data.cards[0].value)
                let Player2 = deckHelper(data.cards[1].value)
                
    /////// Let's Play Some Good Game HERE!!

                if(Player1 > Player2){
                    this.h3.innerText = 'Player 1 win 🏆'
                    this.h3.style.color = 'yellow';
                }else if (Player1 < Player2){
                    this.h3.innerText = 'Player 2 win 🏆'
                    this.h3.style.color = 'yellow';
                }else{
                    this.h3.innerText = 'Time for War!🗡'
                    this.h3.style.color = 'red';
                }
           })
           .catch(err => {
                console.log(`error: ${err}.`)
           })
        }

    ////// This Little Function Help Us To Balance Our Cards Value

        deckHelper(val){
            if(val === 'ACE'){
                return 14
            }else if(val === 'KING'){
                return 13
            }else if(val === 'QUEEN'){
                return 12
            }else if(val === 'JACK'){
                return 11
            }else{
                return Number(val)
            }
        }

}
let letsPlay = new playCards() */