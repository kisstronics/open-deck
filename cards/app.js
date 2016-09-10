var decks = [],cards = [],names={"C":"club","D":"diamond","H":"heart","S":"spade"};
var noOfDecks = 1,noOfPlayers = 3,cardKeys=[];
var playerCards = [],remainCards=[],openCards=[],remainCardIndex=0,cardDrawn=0,curPlayer=0,playerGroups=[];

try {
	// noOfDecks = parseInt(prompt("How many no.of decks are there?"));
	// noOfPlayers = parseInt(prompt("How many no.of players are there?"));
	if (noOfDecks*52 <= noOfPlayers*13) {
		throw "Cards are not enough, drop some players";
	}
	cardKeys = Object.keys(names);
	tck = parseInt(4*noOfDecks);
	for(c=0;c<tck;c++) {
		for(j=1;j<=13;j++) {
			cardNumberInd = (c > 3) ? (c-4) : c;
			// for(i=1;i<=noOfDecks;i++) {
				cards.push({
					"name": cardKeys[cardNumberInd]+"-"+j,
					// "rank": j+(13*(c-1)),
					"rank": 13*c+j,
					"score": (j==1 || j>=10) ? 10 : j
				});
			// }
		}
	}

	var shuffledCards = cards;
	shuffledCards = shuffle(shuffledCards);

	for(s=0;s<shuffledCards.length;s++) {
		playerIndex = s%noOfPlayers;
		if (!$.isArray(playerCards[playerIndex]))
			playerCards[playerIndex] = [];
		if (playerCards[playerIndex].length >= 13) {
			remainCards.push(shuffledCards[s]);
			// remainCardsArr.push(shuffledCards[s].name);
		} else {
			playerCards[playerIndex].push(shuffledCards[s]);
			// playerCardsArr.push(shuffledCards[s].name);
		}
	}

	$("#content").html("");
	for (k in playerCards) {
		var dvi_obj = $("<div/>").attr({"class":"cards-container"}).appendTo("#content");
		$("<label/>").text("Player - "+(parseInt(k)+1)).appendTo(dvi_obj);
		var ul_obj = $("<ul/>").attr({"id":"player"+k}).appendTo(dvi_obj);
		for(card in playerCards[k]) {
			$(ul_obj).append($("<li/>").attr({"attr-index":card}).html(getCardView(playerCards[k][card])))
		}
		// $(ul_obj).after($("<span/>").html($("<button/>").attr({"type":"button","onclick":"sortPlayerCards("+k+")"}).text("Sort Cards")));
	}
	processButtons(0);
	// $("#content").append($("<div/>").attr({"class":"cards-container","id":"open_cards"}));
	// $("<label/>").text("Open Deck").appendTo("#open_cards");

	$("#closedDeckCards").click(function(){
		if (cardDrawn == 1) {
			alert("You have already picked a card, please discard one card.");
			return false;
		}
		if (remainCards.length <= 0) {
			lastOpenCard = openCards.pop();
			shuffle(openCards);
			for (ocd in openCards) {
				remainCards.push(openCards[ocd]);
				//openCards.splice(ocd,1);
			}
			openCards = [lastOpenCard];
			// openCards.push(lastOpenCard);
			// $("#deckCards").trigger("click");
		} else {
			cardDrawn = 1;
			deckFromCard = remainCards[remainCardIndex];
			lastIndexInc = parseInt($("#player"+curPlayer).find("li:last").attr("attr-index"))+1;
			$("#player"+curPlayer).append($("<li/>").attr("attr-index",lastIndexInc).html(getCardView(deckFromCard)));
			playerCards[curPlayer].push(deckFromCard);
			remainCards.splice(0, 1);
		}
		console.log("open cards")
		for(oooo in openCards) {
			console.log(JSON.stringify(openCards[oooo]))
		}
		console.log("remain cards")
		for(rrrr in remainCards) {
			console.log(JSON.stringify(remainCards[rrrr]))
		}
		processButtons(curPlayer);
		// remainCardIndex++;
	});

	$("#openedDeckCards").click(function(){
		if (cardDrawn == 1) {
			alert("You have already picked a card, please discard one card.");
			return false;
		}
		if (remainCards.length <= 0) {
			lastOpenCard = openCards.pop();
			shuffle(openCards);
			for (ocd in openCards) {
				remainCards.push(openCards[ocd]);
				//openCards.splice(ocd,1);
			}
			openCards = [lastOpenCard];
			// openCards.push(lastOpenCard);
			// $("#deckCards").trigger("click");
		}
		if (openCards.length <= 0) {
			alert("Sorry, there are no cards opened. You need to take card from deck only.");
			return false;
		}
		cardDrawn = 1;
		deckFromCard = openCards[openCards.length-1];
		lastIndexInc = parseInt($("#player"+curPlayer).find("li:last").attr("attr-index"))+1;
		$("#player"+curPlayer).append($("<li/>").attr("attr-index",lastIndexInc).html(getCardView(deckFromCard)));
		playerCards[curPlayer].push(deckFromCard);
		openCards.pop();
		$("#open_cards > ul").find("li:last").remove();
	});

	$(document).on("click", ".cards-container > ul > li > img", function(){
		var playerSelectedIndex = parseInt($(this).parent().parent().attr("id").replace("player",""));
		if (playerSelectedIndex != curPlayer) {
			return false;
		}
		if ($(this).hasClass("card-selected")) {
			$(this).removeClass("card-selected");
		} else {
			$(this).addClass("card-selected");
		}
		processButtons(playerSelectedIndex);
		// $(this).parent().parent().find(".discard-card").remove();
		// $(this).after("<a class='btn btn-info discard-card'>Discard</a>");
	});

	$(document).on("click", ".btns-list a.discard-card", function(){
		var playerSelectedIndex = parseInt($(this).parent().prev().attr("id").replace("player",""));
		if (playerSelectedIndex == curPlayer) {
			if (cardDrawn == 1) {
				var attr_index = parseInt($(this).parent().prev().find("img.card-selected").parent().attr("attr-index"));
				discardCard = playerCards[curPlayer][attr_index];
				console.log(curPlayer+">>>>"+attr_index)
				console.log(discardCard)
				openCards.push(discardCard);
				delete playerCards[curPlayer][attr_index];
				$("#open_cards > ul").append($("<li/>").html(getCardView(discardCard)));
				// $("#player"+curPlayer).find("li:not([attr-index])").attr("attr-index",$(this).parent().attr("attr-index"));
				$(this).parent().prev().find("img.card-selected").parent().remove();
				cardDrawn = 0;
				if (curPlayer >= noOfPlayers-1) {
					// alert("it's again turn to first player")
					curPlayer = 0;
				} else {
					curPlayer++;
				}
				processButtons(curPlayer);
			} else {
				alert("You need to take card from deck");
			}
		} else {
			alert("It's not your turn");
		}
	});
	$(document).on("click",".group-cards",function(){
		var playerSelectedIndex = parseInt($(this).parent().prev().attr("id").replace("player",""));
		var groupCardsArr = [];
		$("#player"+playerSelectedIndex).find("li img.card-selected").each(function(){
			var attr_index = parseInt($(this).parent().attr("attr-index"));
			var groupCardSingle = playerCards[playerSelectedIndex][attr_index];
			groupCardsArr.push({"index":attr_index, "card":groupCardSingle});
		});
		
		if (!$.isArray(playerGroups[playerSelectedIndex]))
			playerGroups[playerSelectedIndex] = [];

		playerGroups[playerSelectedIndex].push(groupCardsArr);
		processGroupCards(playerSelectedIndex);
	});
	// $(document).on("click", ".cards-container > ul > li > a.discard-card", function(){
	// 	if (parseInt($(this).parent().parent().attr("id").replace("player","")) == curPlayer) {
	// 		if (cardDrawn == 1) {
	// 			var attr_index = parseInt($(this).parent().attr("attr-index"));
	// 			discardCard = playerCards[curPlayer][attr_index];
	// 			console.log(curPlayer+">>>>"+attr_index)
	// 			console.log(discardCard)
	// 			openCards.push(discardCard);
	// 			delete playerCards[curPlayer][attr_index];
	// 			// $("#player"+curPlayer).find("li:not([attr-index])").attr("attr-index",$(this).parent().attr("attr-index"));
	// 			$(this).parent().remove();
	// 			if (curPlayer >= noOfPlayers-1) {
	// 				// alert("it's again turn to first player")
	// 				curPlayer = 0;
	// 			} else {
	// 				curPlayer++;
	// 			}
	// 			cardDrawn = 0;
	// 		} else {
	// 			alert("You need to take card from deck");
	// 		}
	// 	} else {
	// 		alert("It's not your turn");
	// 	}
	// });
}
catch(err) {
	$("#content").html("");
	alert(err)
}

function processGroupCards(playerCurIndex) {
	for (pgInd in playerGroups[playerCurIndex]) {
		for (grpInd in playerGroups[playerCurIndex][pgInd]) {
			var groupSelCard = playerGroups[playerCurIndex][pgInd][grpInd];
			var li_props = {};
			li_props["attr-index"] = groupSelCard.index;
			if (grpInd == 0) {
				li_props["class"] = "group-last-card";
			}
			$("#player"+playerCurIndex).find("li[attr-index='"+groupSelCard.index+"']").remove();
			$("#player"+playerCurIndex).prepend($("<li/>").attr(li_props).html(getCardView(groupSelCard.card)));		
		}
	}
}

function processButtons(playerCurIndex) {
	if (playerCurIndex != curPlayer) {
		return false;
	}
	$(".btns-list").html("");
	var opts = {};
	if (cardDrawn == 0) {
		opts["drop"] = true;
	} else {
		if ($("#player"+curPlayer).find("li img.card-selected").length == 1) {
			opts["discard"] = true;
			opts["endgame"] = true;
		}
	}
	if ($("#player"+curPlayer).find("li img.card-selected").length > 1) {
		opts["group"] = true;
	}
	if (!$("#player"+curPlayer).next().hasClass("btns-list")) {
		$("#player"+curPlayer).after($("<div/>").attr({"class":"btns-list"}));
	} else {
		$("#player"+curPlayer).next();
	}
	// $("#player"+curPlayer).next().html("");
	if (opts.drop == true) {
		$("#player"+curPlayer).next().append($("<a/>").attr({"class":"drop-game","title":"Drop"}).html($("<img/>").attr({"src":"images/drop_game.png"})));
	}
	if ($("#player"+curPlayer).find("li img.card-selected").length > 0) {
		if (opts.discard == true) {
			$("#player"+curPlayer).next().append($("<a/>").attr({"class":"discard-card","title":"Discard"}).html($("<img/>").attr({"src":"images/discard_card.png"})));
		}
		if (opts.group == true) {
			$("#player"+curPlayer).next().append($("<a/>").attr({"class":"group-cards","title":"Group"}).html($("<img/>").attr({"src":"images/group_card.png"})));
		}
		if (opts.endgame == true) {
			$("#player"+curPlayer).next().append($("<a/>").attr({"class":"end-game","title":"Finish Game"}).html($("<img/>").attr({"src":"images/finish_game.png"})));
		}
	}
	$("#player"+curPlayer).next().show();
}

function getCardView(cardObj) {
	var cardImage = "";
	// console.log(cardObj.rank)
	var cardOpts = getCardInfo(cardObj.rank);
	// console.log(cardOpts)
	cardImage = names[cardKeys[cardOpts["type"]]]+"_"+cardOpts["number"]+".png";
	// console.log(cardImage)
	return "<img src='images/"+cardImage+"'>";
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function sortPlayerCards(playerIndex) {
	playerCards[playerIndex].sort(sortCards);
	$("ul#player"+playerIndex).html("");
	for(card in playerCards[playerIndex]) {
		$("ul#player"+playerIndex).append($("<li/>").html(getCardView(playerCards[playerIndex][card])))
	}
}

function sortCards(a, b) {
  if (a.rank < b.rank)
    return -1;
  if (a.rank > b.rank)
    return 1;
  return 0;
}

function getCardInfo(x){
	var y=x/13,k;
	if (Number.isInteger(y)) {
		y=y-1;
		k=13;
	}else{
		y=parseInt(y);
		k=x%13;
	}
	//b=13*y+k;
	// types = ["C","D","H","S"];
	return {"type":(y%4), "number":k};
}