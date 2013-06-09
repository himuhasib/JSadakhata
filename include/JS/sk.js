/*

 The contents of this file are subject to the Mozilla Public License
 Version 1.1 (the "License"); you may not use this file except in
 compliance with the License. You may obtain a copy of the License at
 http://www.mozilla.org/MPL/

 Software distributed under the License is distributed on an "AS IS"
 basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 License for the specific language governing rights and limitations
 under the License.

 The Original Code is SadaKhata.

 The Initial Developer of the Original Code is Hasib Al Muhaimin.
 <himuhasib@gmail.com>

 Copyright (C) Sadakhata **http://sadakhata.com**. All Rights Reserved.

 Contributor(s): ______________________________________.

*/


function node(){
	this.wordList = {};
	this.children = [];
}
	
head = new node();
	
function a(str, val){
	str = str.toLowerCase();
	if(str.length == 0){
		return;
	}
	
	var hashed = hash(str);
	
	var T = head;
	
	for(var i=0; i<hashed.length; i++){
		if(T.children[hashed[i]] == undefined){
			T.children[hashed[i]] = new node();
		}
		T = T.children[hashed[i]];
	}
	T.wordList[str] = val;
}
	
function find(str){
	if(str.length == 0){
		return ["",""];
	}
	var emoticon = {':o': ':O', ';p': ';p', ':)': ':)', ':D': ':D', ':p': ':p', 'B)': 'B)', ';P': ';P', ';D': ';D', 'B|': 'B|', ';)': ';)', ':P': ':P', ':v': ':v', ':s': ':s'};
	if(str in emoticon)
		return [emoticon[str]];



	var ret;
	var i;
	var lameSuffix = str.match(/[^a-zA-Z]+$/);
	
	if(lameSuffix != null) {
		lameSuffix = OmicronLab.Avro.Phonetic.parse(lameSuffix[0]);
		ret = find(str.substr(0, str.length - lameSuffix.length));
		ret.pop();
		for(i=0; i<ret.length; i++)
			ret[i] += lameSuffix;
		ret.push(str);
		return ret;
	}
	
	var hashed = hash(str.toLowerCase());
	var parseAvro = OmicronLab.Avro.Phonetic.parse(str);
	var T = head;
	
	
	for(i=0; i<hashed.length; i++) {
		if(T.children[hashed[i]] == undefined)
			break;
		T = T.children[hashed[i]];				
	}
	
	if(i == hashed.length){
		if(!(str in T.wordList)) {//can't find exact match, trying to find nearest one.
			var dist = 100;
			var temp;
			for(key in T.wordList) {
				temp = minimum_edit_dist(key, str);
				if(temp < dist) {
					dist = temp;
					ret = T.wordList[key];
				}
			}
		}else{
			ret = T.wordList[str];
		}

		if(ret != undefined) {
			ret = ret.split(",");
			if(!in_ara(ret, parseAvro))
				ret.push(parseAvro);
		}else{
			ret = [parseAvro];
		}
	}else{
		var suffixes = {"ta":"টা", "tar":"টার", "ti":"টি", "tir":"টির","tai":"টাই", "tuku":"টুকু", "tikei":"টিকেই", "tukuke":"টুকুকে", "tukukei":"টুকুকেই", "tukute":"টুকুতে", "tukutei":"টুকুতেই", "tukun":"টুকুন", "khana":"খানা", "khani":"খানি", "gulo":"গুলো", "guli":"গুলি", "gula":"গুলা", "er":"ের", "na":"না", "somuho":"সমূহ"};
		for(var s in suffixes){
			if(new RegExp(s + "$", "i").test(str)){
				hashed = str.substr(0, str.length - s.length);
				ret = find(hashed);
				ret.pop();
				for(i=0; i < ret.length; i++){
					ret[i] += suffixes[s];
				}
				break;	
			}
		}
		
		
		if(ret != undefined){
			if(!in_ara(ret, parseAvro)){
				ret.push(parseAvro);
			}
		}else{
			ret = [parseAvro];
		}
	}
	if(!in_ara(ret, str))
		ret.push(str);
	return ret;
	
}

function in_ara(ara, str){
	var i;
	for(i=0; i<ara.length; i++)
		if(ara[i] == str)
			break;
	return i < ara.length;
}

function hash(str) {
	/*
	add "//" if you
	*/
	str = str.replace(/aa/g, 'a');	//don't use extra 'a' after 'a', like 'baan'
	//str = str.replace(/e/g, 'a');	//know the difference between 'e' and 'a'
	str = str.replace(/c/g, 's');	//know the difference between 'c' and 's'
	str = str.replace(/h/g, '');	//don't use extra 'h' and don't miss 'h'
	//str = str.replace(/o/g, '');	//use 'o' perfectly
	str = str.replace(/j/g, 'z');	//don't mess up 'j' and 'z'

	var res = "";
	for(var i=0; i<str.length; i++){
		if(i > 0 && in_ara("ae", str[i]) && str[i] != str[i-1] && in_ara("aeiouw", str[i-1]) )
			res = res + 'y' + str[i]; 
		else
			res = res + str[i];
	}
	return res;
}

function minimum_edit_dist(s, t){
	var dp = new Array(s.length);
	for(var i=0; i<s.length; i++){
		dp[i] = new Array(t.length);
		for(var j=0; j<t.length; j++)
			dp[i][j] = -1;
	}
	function calc(i, j){
		if(i<0) return j>0?j:0;
		if(j<0) return i>0?i:0;
		
		if(dp[i][j] != -1)
			return dp[i][j];
		
		if(s[i] == t[j])
			return calc(i-1, j-1);
		else
			return Math.min(calc(i-1, j), calc(i, j-1)) + 1;
	}
	return calc(s.length-1, t.length-1);
}


function convert(str){
	if(str.length == 0) return [];
	var result = find(str);
	return result;
}

function getPos(end, str){
	if(str[end] == ' ' || str[end] == '\n')
		return {"start":end, "end":end};
	var start = end;
	while(start > 0 && str[start-1] != ' ' && str[start-1] != '\n'){
		start--;
	}
	return {"start":start, "end":end};
}



function sadakhata(elm){
	elm.bind( "keydown", function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB /*  && elm.data( "ui-autocomplete" ).menu.active */ ) {
			event.preventDefault();
		}
	}).bind("keyup", function(event){
		if((event.keyCode == 32 || event.keyCode == 13) && $(this).val().length > 1){
			elm.autocomplete("close");
			var obj = getPos(elm.caret().start-2, elm.val());
			
			if((event.keyCode == 32 && elm.val()[obj.end + 1] == ' ') || (event.keyCode == 13 && elm.val()[obj.end + 1] == '\n')){
				var val = convert(elm.val().substr(obj.start, obj.end-obj.start+1))[0];
				elm.val(elm.val().substr(0, obj.start) + val + elm.val().substr(obj.end+1));
				var t = obj.start + val.length + 1;
				elm.caret(t, t);
			}
		}
	}).autocomplete({
		minLength: 1,
		delay: 1,
		source: function( request, response ) {
			var word = "";
			for(var i=elm.caret().start-1; i>-1 && request.term[i] != ' ' && request.term[i] != '\n'; i--){
				word = request.term[i] + word;
			}
			
			response(convert(word));
		},
		focus: function(event, ui) {
			return false;
		},
		select: function( event, ui ) {
			var obj = getPos(elm.caret().start - 1, this.value);
			this.value = this.value.substr(0, obj.start) + ui.item.value + " " + this.value.substr(obj.end+1);
			var t = obj.start + ui.item.value.length + 1;
			elm.caret(t, t);
			return false;
		}
	});
}