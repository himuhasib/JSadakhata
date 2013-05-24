function node()
{
	this.wordList = {};
	this.children = [];
}
	
head = new node();
	
function insert(str, val)
{
	if(str.length == 0)
	{
		return;
	}
	
	var hashed = hash(str);
	
	var T = head;
	
	for(var i=0; i<hashed.length; i++)
	{
		if(T.children[hashed[i]] == undefined)
		{
			T.children[hashed[i]] = new node();
		}
		T = T.children[hashed[i]];
	}
	
	T.wordList[str] = val;
}
	
function find(str)
{
	if(str.length == 0)
	{
		return null;
	}
	
	var hashed = hash(str.toLowerCase());
	
	var T = head;
	var i;
	
	for(i=0; i<hashed.length; i++)
	{
		if(T.children[hashed[i]] == undefined)
		{
			break;
		}
		
		T = T.children[hashed[i]];				
	}
	
	if(i == hashed.length)
	{
		var ret;
		if(!(str in T.wordList))
		{//can't find exact match, trying to find nearest one.
			var dist = 100;
			var temp;
			for(key in T.wordList)
			{
				temp = minimum_edit_dist(key, str);
				if(temp < dist)
				{
					dist = temp;
					ret = T.wordList[key];
				}
				
			}
		}
		else
		{
			ret = T.wordList[str];
		}
		var parseAvro = OmicronLab.Avro.Phonetic.parse(str);
		if(ret != undefined)
		{
			ret = ret.split(",");
			for(i=0; i<ret.length; i++)
				if(parseAvro == ret[i])
					break;
			
			if(i == ret.length)
				ret.push(parseAvro);
		}
		else
		{
			ret = [parseAvro];
		}
		return ret;
	}
	else
	{
		return [OmicronLab.Avro.Phonetic.parse(str)];
	}
	
}

function hash(str)
{
	str = str.replace(/e/g, 'a');
	str = str.replace(/c/g, 's');
	str = str.replace(/h/g, '');
	str = str.replace(/o/g, '');
	str = str.replace(/j/g, 'z');
	return str;
}

function minimum_edit_dist(s, t)
{
	var dp = new Array(s.length);
	for(var i=0; i<s.length; i++)
	{
		dp[i] = new Array(t.length);
		for(var j=0; j<t.length; j++)
			dp[i][j] = -1;
	}
	
	function calc(i, j)
	{
		if(i<0) return j>0?j:0;
		if(j<0) return i>0?i:0;
		
		if(dp[i][j] != -1)
		{
			return dp[i][j];
		}
		
		if(s[i] == t[j])
		{
			return calc(i-1, j-1);
		}
		else
		{
			return Math.min(calc(i-1, j), calc(i, j-1)) + 1;
		}
	}
	
	return calc(s.length-1, t.length-1);
}


function convert(str)
{
	if(str.length == 0) return [];
	var result = find(str);
	return result;
}