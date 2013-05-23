/*

http://www.codeproject.com/Questions/434562/How-To-Get-Position-Cursor-in-TextBox-Or-TextArea

*/



function getPos(el)
{
	var pos = 0;
	if("selectionStart" in el) {
	   pos = el.selectionStart;
	} else if("selection" in document) {
	   el.focus();
	   var Sel = document.selection.createRange();
	   var SelLength = document.selection.createRange().text.length;
	   Sel.moveStart("character", -el.value.length);
	   pos = Sel.text.length - SelLength;
	}
	return pos;
}